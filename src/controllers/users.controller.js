import userService from '../services/user.service.js';
import resDto from '../utils/res.dto.js';

const getAllUsersController = {
    async list(_request, response, next) {
        try {
            const users = await userService.getAllUsersService();
            const resto = users.map (user => resDto.resDto(user.toObject()))
            return response.status(200).json({ status: 'success', payload: resto });
        } catch (error) {
            return next(error);
        }
    }
}

export default getAllUsersController;


