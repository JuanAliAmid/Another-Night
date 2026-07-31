import usersDao from "../dao/users.dao.js";

const getAllUsers = async () => {
    const users = await usersDao.getAllUsersDao();
    return users
} 

//Sessions
const findUserByEmail = async (email) => {
    const findEmail = await usersDao.findUserByEmail(email)
    return findEmail
}

const createUser = async (userData) => {
    const newUser = await usersDao.createUser(userData)
    return newUser
}

export default {
    getAllUsers,
    createUser,
    findUserByEmail
}