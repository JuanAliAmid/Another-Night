import userModel from "../models/user.model.js";

const getAllUsersDao = async () => {
    const users = await userModel.find();
    return users;
}

//Sessions
const findUserByEmail = async (email) => {
    const cleanEmail = email.toLowerCase().trim()
    return await userModel.findOne({ email: cleanEmail }).lean();
};

const findUserById = async (id) => {
    return await userModel.findById(id)
};

const createUser = async (userData) => {
    return await userModel.create( userData );
};

export default {
    getAllUsersDao,
    createUser,
    findUserByEmail,
    findUserById
}