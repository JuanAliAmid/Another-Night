import passport from "passport";
// lee JWT desde cookie, valida, puebla req.user, responde 401 si no hay sesión válida
const auth = (req, res, next) => {
    passport.authenticate('jwt', { session: false }, (err, user) => {

        if (err) return next(err);

        if (!user) {
            return res.status(401).json({ status: 'error', message: 'No hay sesión válida' })
        }

        req.user = user;

        next()
    })(req, res, next);
};

export default {
    auth
}