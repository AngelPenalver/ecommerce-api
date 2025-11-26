export const jwtConstants = {
    secret_developer: process.env.JWT_SECRET_DEVELOPER || 'secretKey',
    expiresIn_developer: process.env.JWT_EXPIRES_IN_DEVELOPER || '1h',
    secret_user: process.env.JWT_SECRET_USER || 'secretKey',
    expiresIn_user: process.env.JWT_EXPIRES_IN_USER || '1h',
}