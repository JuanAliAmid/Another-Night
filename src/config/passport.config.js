import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { createHash, isValidPassword } from '../utils/hash.js';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { env } from './env.js';
import bcrypt from 'bcrypt';
import usersDao from '../dao/users.dao.js';

const cookieExtractor = req => {
    let token = null
    if (req && req.cookies) {
        token = req.cookies.currentUser;
    }
    return token;
}

const bearerOrCookie = (req) => {
    return ExtractJwt.fromAuthHeaderAsBearerToken()(req) || cookieExtractor(req);
}

const jwtOptions = { jwtFromRequest: bearerOrCookie, secretOrKey: env.jwt_secret }

const jwtVerify = async (payload, done) => {
    try {
        const user = await usersDao.findUserById(payload.id);
        if (!user) {
            return done(null, false, { message: "Usuario no encontrado" });
        }
        return done(null, user)
    } catch (error) {
        return done(error)
    }
}

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
                const { first_name, last_name } = req.body

                if (!first_name || !last_name || !email || !password) {
                    return done(null, false, {
                        message: 'Todos los campos son obligatorios'
                    })
                }

                const normalizedEmail = email.toLowerCase().trim()

                const userExists = await usersDao.findUserByEmail(normalizedEmail)

                if (userExists) {
                    return done(null, false, {
                        message: 'Ya existe un usuario registrado con ese email'
                    })
                }

                const hashedPassword = await createHash(password)

                const newUser = await usersDao.createUser({ first_name, last_name, password: hashedPassword, email: normalizedEmail })

                return done(null, newUser)
            } catch (error) {
                return done(error)
            }
        }
    )
)


//login
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (email, password, done) => {

            try {
                const normalizedEmail = email.toLowerCase().trim()

                const user = await usersDao.findUserByEmail(normalizedEmail)


                if (!user) {
                    return done(null, false, {
                        message: 'Credenciales inválidas'
                    })
                }

                const validPassword = await isValidPassword(
                    password,
                    user.password
                )


                if (!validPassword) {
                    return done(null, false, {
                        message: 'Credenciales inválidas'
                    })
                }

                return done(null, user)

            } catch (error) {
                return done(error)
            }
        }
    )
)

//current 
passport.use("jwt", new JwtStrategy(jwtOptions, jwtVerify));

export default {
    initPassport
}