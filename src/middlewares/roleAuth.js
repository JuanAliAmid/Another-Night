const rolesAuth = (...permisos) => {
    return (req, res, next) => {
        if (permisos.includes('public')) {
            return next();
        }

        if (!permisos.includes(req.user.role)) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(403).json({ error: 'No tiene privilegios suficientes' });
        }
        next();
    }
}

export default {
    rolesAuth
}