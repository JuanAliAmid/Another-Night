import userRepository from "../repositories/user.repository.js";
import { createHash, isValidPassword } from '../utils/hash.js';


const getAllUsersService = async () => {
    const users = await userRepository.getAllUsers();
    return users;
};

const registerUserService = async (userData) => {
    if (!userData.first_name || !userData.last_name || !userData.email || !userData.password) {
        const error = new Error('Hay campos faltantes');
        error.status = 400;
        throw error;
    };

    if (userData.password.length <= 6 || userData.password === "12345" || userData.password === "12345678910" || userData.password === "aeiou") {
        const error = new Error('Formato de contraseña inválido');
        error.status = 422;
        throw error;
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(userData.email)) {
        const error = new Error('Formato de email incorrecto');
        error.status = 400;
        throw error;
    };

    const normalizedEmail = userData.email.toLowerCase().trim();

    const userExists = await userRepository.findUserByEmail(normalizedEmail);

    if (userExists) {
        const error = new Error('Ya existe un usuario registrado con ese email');
        error.status = 409;
        throw error;
    };

    const hashedPassword = await createHash(userData.password);

    const newUser = await userRepository.createUser({ first_name: userData.first_name, last_name: userData.last_name, password: hashedPassword, email: normalizedEmail });

    return newUser;
};

const loginUserService = async (userData) => {

    if (!userData.email || !userData.password) {
        const error = new Error('Complete los campos "email" y "password"');
        error.status = 400;
        throw error;
    };

    const normalizedEmail = userData.email.toLowerCase().trim();

    const user = await userRepository.findUserByEmail(normalizedEmail);

    if (!user) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    };

    const validPassword = await isValidPassword(
        userData.password,
        user.password
    );

    if (!validPassword) {
        const error = new Error('Credenciales inválidas');
        error.status = 401;
        throw error;
    }

    return user;
};
//Sessions

const findUserById = async (_id) => {
    const user = await userRepository.findUserById(_id);
    if (!user) {
        const error = new Error('Usuario no encontrado');
        error.status = 404;
        throw error;
    }
    return user;
};

export default {
    getAllUsersService,
    registerUserService,
    loginUserService,
    findUserById
};
