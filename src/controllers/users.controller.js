import userService from '../services/user.service.js';
import resDto from '../dto/res.dto.js';

const getAllUsersController = {
    async list(_request, response, next) {
        try {

            const users = await userService.getAllUsersService();
            const resto = users.map (user => resDto.userDto(user.toObject()));

            return response.status(200).json({ status: 'success', payload: resto });
        } catch (error) {
            return next(error);
        };
    }
};

export default getAllUsersController;


