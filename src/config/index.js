import dotenv from 'dotenv'

dotenv.config()

export default {
    persistence: process.env.PERSISTENCE,
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL,
    mongoDb: process.env.MONGO_DB,
    jwtSecret: process.env.JWT_SECRET,
    jwtCookieName: process.env.JWT_COOKIE_NAME,
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
}