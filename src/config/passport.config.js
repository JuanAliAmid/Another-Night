import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { env } from './env.js';
import userService from '../services/user.service.js';

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies.currentUser;
    };
    return token;
};

const bearerOrCookie = (req) => {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req) || cookieExtractor(req);
};

const jwtOptions = { jwtFromRequest: bearerOrCookie, secretOrKey: env.jwt_secret }

const jwtVerify = async (payload, done) => {
    try {
        const user = await userService.findUserById(payload.id);
        return done(null, user)
    } catch (error) {
        return done(error)
    };
};

// estrategias locales ↓↓

//register
passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: 'email',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                const newUser = await userService.registerUserService(req.body);
                return done(null, newUser);
            } catch (error) {
                return done(error);
            };
        }
    )
);

//login
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {

            try {
                const user = await userService.loginUserService({email, password});
                return done(null, user)
            } catch (error) {
                return done(error)
            };
        }
    )
);

//current / logout
passport.use("jwt", new JwtStrategy(jwtOptions, jwtVerify));

