import passportJWT, { ExtractJwt } from 'passport-jwt'
import GitHubStrategy from 'passport-github2'
import passportLocal from 'passport-local'
import passport from 'passport'

// -----------------------------------------------------------------------------------------

import config from '../index.js'
import { UserModel } from '../../dao/mongo/models/index.js'
import { createHash, isPasswordValid, generateToken, extractCookie } from '../../utils/index.js'

// -----------------------------------------------------------------------------------------

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy

// -----------------------------------------------------------------------------------------

const initializePassport = () => {

    passport.use('register', new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'email'
        },
        async (req, username, password, done) => {

            const { first_name, last_name, email, age } = req.body

            try {

                const user = await UserModel.findOne({ email: username })

                if (user) throw new Error('Usuario ya existe')

                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password),
                    role: 'user'
                }

                const result = await UserModel.create(newUser)

                return done(null, result)

            } catch (error) {

                return done(error, false)

            }

        }
    ))

    passport.use('login', new LocalStrategy(
        {
            usernameField: 'email'
        },
        async (username, password, done) => {

            try {

                const user = await UserModel.findOne({ email: username }).lean().exec()

                if (!user) throw new Error('Usuario no encontrado')

                if (!isPasswordValid(user, password)) throw new Error('Contraseña incorrecta')

                return done(null, user)

            } catch (error) {

                return done(error, false)

            }

        }
    ))

    passport.use('github', new GitHubStrategy(
        {
            clientID: 'Iv1.e49f438f66dc04f8',
            clientSecret: config.githubClientSecret,
            callbackURL: 'http://localhost:8080/api/auth/github-callback'
        },
        async (accessToken, refreshToken, profile, done) => {

            try {

                let user = await UserModel.findOne({ email: profile._json.email })

                if (!user) {

                    const newUser = {
                        first_name: profile._json.name,
                        last_name: '',
                        email: profile._json.email,
                        password: '',
                        role: 'user',
                        age: 0
                    }

                    user = await UserModel.create(newUser)

                }

                user.token = generateToken(user)

                return done(null, user)

            } catch (error) {

                return done(error)

            }

        }
    ))

    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            secretOrKey: config.jwtSecret
        },
        (jwt_payload, done) => {
            const { user } = jwt_payload
            done(null, user)
        }
    ))

    passport.use('current', new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([extractCookie]),
            secretOrKey: config.jwtSecret
        },
        (jwt_payload, done) => {
            const { user } = jwt_payload
            done(null, user)
        }
    ))

}

// -----------------------------------------------------------------------------------------

passport.serializeUser((user, done) => done(null, user._id))

passport.deserializeUser(async (id, done) => done(null, await UserModel.findById(id)))

// -----------------------------------------------------------------------------------------

export default initializePassport