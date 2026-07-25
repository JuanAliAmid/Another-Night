import userModel from "../models/user.model.js";

const getAllUsersDao = async () => {
    const users = await userModel.find();
    return users;
}

export default {
    getAllUsersDao
}