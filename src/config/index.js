import passport from 'passport'
import passportLocal from 'passport-local'
import { UserModel } from '../dao/mongoManager/models/user.model.js'
import { createHash, isPasswordValid } from '../utils/index.js'
import GitHubStrategy from 'passport-github2'
import { CLIENT_SECRET } from '../constants/index.js'

const LocalStrategy = passportLocal.Strategy

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
            clientSecret: CLIENT_SECRET,
            callbackURL: 'http://localhost:8080/api/auth/github-callback'
        },
        async (accessToken, refreshToken, profile, done) => {
            console.log('profile', profile)

            try {
                const user = await UserModel.findOne({ email: profile._json.email })

                if (user) {
                    console.log('Usuario ya existente ' + user);
                    return done(null, user)
                }

                const newUser = {
                    first_name: profile._json.name,
                    last_name: '',
                    email: profile._json.email,
                    password: '',
                    role: 'user',
                    age: 0
                }

                const result = await UserModel.create(newUser)

                return done(null, result)

            } catch (error) {

                return done(error)

            }

        }
    ))

}

passport.serializeUser((user, done) => {
    console.log(user);
    done(null, user._id)
})

passport.deserializeUser(async (id, done) => {

    const user = await UserModel.findById(id)

    done(null, user)

})

export default initializePassport