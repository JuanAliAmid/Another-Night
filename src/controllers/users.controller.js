import UserModel from '../models/user.model.js';

const UsersController = {
    async list(_request, response, next) {
        try {
            return response.status(200).json({ status: 'success', total: 0, items: [] });
        } catch (error) {
            return next(error);
        }
    },

    async getById(request, response, next) {
        try {
            const { id } = request.params;
            const encontrado = await UserMondel.findById(id)
            if (!encontrado) return response.status(404).json({ status: 'error', message: 'no encontrado' });
            return response.status(200).json({ status: 'success', item: encontrado });
        } catch (error) {
            return next(error);
        }
    }

}

export default UsersController;