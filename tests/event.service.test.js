import { test, mock } from 'node:test';
import assert from 'node:assert';
import eventService from '../src/services/event.service.js';
import eventRepository from '../src/repositories/event.repository.js';

const testing = async () => {
    return [{title: 'Evento test'}]
}

test('getAllEventsService devuelve lo que da el repository', async () => {

    mock.method(eventRepository, 'getAllEvents', testing)
    
    const service = await eventService.getAllEventsService()

    assert.deepStrictEqual(service, [{title: 'Evento test'}])
});