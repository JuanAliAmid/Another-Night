import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import '../config/env.js'; // fuerza dotenv.config() antes de que se evalúe app.js (y nodeMailer.config.js)
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import app from '../app.js';
import userModel from '../models/user.model.js';

// Datos de prueba
const testEmail = `test-${Date.now()}@mail.com`;
const testPassword = '12345678';

let cookie;
let eventId;
let ticketId;
let mongod;

before(async () => {
    // Levanta un mongo temporal en RAM para no tocar mi base de datos real 
    mongod = await MongoMemoryServer.create();
    await mongoose.connect(mongod.getUri());
});

after(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});

test('POST /api/sessions/register crea un usuario sin exponer password', async () => {
    const res = await request(app)
        .post('/api/sessions/register')
        .send({ first_name: 'Test', last_name: 'User', email: testEmail, password: testPassword });

    assert.equal(res.status, 201);
    assert.equal(res.body.payload.email, testEmail);
    assert.equal(res.body.payload.password, undefined); // lanza error si se filtra el hash del password en la response
});

test('POST /api/sessions/login devuelve 200 y setea cookie', async () => {
    const res = await request(app)
        .post('/api/sessions/login')
        .send({ email: testEmail, password: testPassword });

    assert.equal(res.status, 200);
    assert.ok(res.headers['set-cookie'], 'debería venir una cookie de sesión');
    cookie = res.headers['set-cookie'];
});

test('GET /api/sessions/current no expone password', async () => {
    const res = await request(app)
        .get('/api/sessions/current')
        .set('Cookie', cookie);

    assert.equal(res.status, 200);
    assert.equal(res.body.payload.email, testEmail);
    assert.equal(res.body.payload.password, undefined);
});

test('GET /api/sessions/current sin cookie devuelve 401', async () => {
    const res = await request(app).get('/api/sessions/current');
    assert.equal(res.status, 401);
});

test('POST /api/events sin rol organizer/admin devuelve 403', async () => {
    const res = await request(app)
        .post('/api/events')
        .set('Cookie', cookie)
        .send({ title: 'Evento test', description: 'Prueba', price: 1000, capacity: 2, category: 'Electronica', location: 'CABA', date: '2026-12-01' });

    assert.equal(res.status, 403);
});

test('flujo completo: promover a organizer → crear evento → publicar → inscribirse → cancelar', async () => {
    // Cambio el rol de usuario a organizer directo en la db (no hay endpoint público para esto)
    await userModel.updateOne({ email: testEmail }, { role: 'organizer' });

    // Volvemos a loguear para que el JWT tenga el rol actualizado
    const loginRes = await request(app)
        .post('/api/sessions/login')
        .send({ email: testEmail, password: testPassword });

    cookie = loginRes.headers['set-cookie']; // pisa la cookie de user

    // Crear evento
    const createRes = await request(app)
        .post('/api/events')
        .set('Cookie', cookie)
        .send({ title: 'Evento test', description: 'Prueba', price: 1000, capacity: 2, category: 'Electronica', location: 'CABA', date: '2026-12-01' });

    assert.equal(createRes.status, 201);
    eventId = createRes.body.payload._id;

    // Editar status
    const publishRes = await request(app)
        .patch(`/api/events/${eventId}/status`)
        .set('Cookie', cookie)
        .send({ status: 'published' });

    assert.equal(publishRes.status, 200);

    // Inscribirse
    const ticketRes = await request(app)
        .post(`/api/events/${eventId}/tickets`)
        .set('Cookie', cookie)
        .send({ quantity: 1 });

    assert.equal(ticketRes.status, 201);
    ticketId = ticketRes.body.payload._id;

    // Inscribirse de nuevo → error de negocio, no 500
    const duplicateRes = await request(app)
        .post(`/api/events/${eventId}/tickets`)
        .set('Cookie', cookie)
        .send({ quantity: 1 });

    assert.equal(duplicateRes.status, 409);

    // Ver inscriptos del evento (populate sin password)
    const viewRes = await request(app)
        .get(`/api/events/${eventId}/tickets`)
        .set('Cookie', cookie);

    assert.equal(viewRes.status, 200);
    assert.equal(viewRes.body.payload[0].user.password, undefined);

    // Cancelar ticket
    const cancelRes = await request(app)
        .patch(`/api/tickets/${ticketId}/cancel`)
        .set('Cookie', cookie);

    assert.equal(cancelRes.status, 200);
    assert.equal(cancelRes.body.payload.status, 'cancelled');

    // Cancelar de nuevo → 409, no 500
    const doubleCancel = await request(app)
        .patch(`/api/tickets/${ticketId}/cancel`)
        .set('Cookie', cookie);

    assert.equal(doubleCancel.status, 409);
});