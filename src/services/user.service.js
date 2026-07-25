import userRepository from "../repositories/user.repository.js";

const getAllUsersService = async () => {
    const users = await userRepository.getAllUsers()
    return users;
}

export default {
    getAllUsersService
}
