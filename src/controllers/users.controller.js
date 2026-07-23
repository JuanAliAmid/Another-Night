import UserModel from '../models/user.model.js';

const UsersController = {
    async list(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', total: 0, items: [] });
        } catch (error) {
            return next(error);
        }
    }
}

export default UsersController;