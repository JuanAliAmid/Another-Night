import userService from '../services/user.service.js';

const getAllUsersController = {
    async list(_request, response, next) {
        try {
            const users = await userService.getAllUsersService()
            return response.status(200).json({ status: 'success', payload: users });
        } catch (error) {
            return next(error);
        }
    }
}

export default getAllUsersController;


