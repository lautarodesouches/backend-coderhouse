import passport from 'passport'
import passportLocal from 'passport-local'
import { UserModel } from '../dao/mongoManager/models/user.model.js'
import { createHash, isPasswordValid } from '../utils/index.js'

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