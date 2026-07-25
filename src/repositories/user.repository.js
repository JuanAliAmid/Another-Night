import usersDao from "../dao/users.dao.js";

const getAllUsers = async () => {
    const users = await usersDao.getAllUsersDao();
    return users
} 
export default {
    getAllUsers
}