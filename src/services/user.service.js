import userRepository from "../repositories/user.repository.js";
import { createHash } from "../utils/hash.js";


const getAllUsersService = async () => {
    const users = await userRepository.getAllUsers()
    return users;
}

//Sessions

const findUserByEmail = async (email) => {
    const findEmail = await userRepository.findUserByEmail(email)
    return findEmail
}

const createUser = async (userData) => {

    if (String(userData.password) === '12345678910' || String(userData.password) === '12345' || userData.password === 'aeiou') {
        throw new Error('Contraseña insegura, intente con una nueva');
    } else if (String(userData.password).length <= 6) {
        throw new Error('La contraseña debe tener más de 6 caracteres');
    };

    userData.password = await createHash(userData.password);

    const newUser = await userRepository.createUser(userData)

    return newUser
}

export default {
    getAllUsersService,
    createUser,
    findUserByEmail
}
