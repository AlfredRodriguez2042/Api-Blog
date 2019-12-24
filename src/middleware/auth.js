import jwt from 'jsonwebtoken'
import User from '../models/user'

export async function authMiddleware(req, res, next) {
  try {
    const IsAuthorization = req.headers.authorization || req.headers.cookie

    if (!IsAuthorization) {
      req.isAuth = false
      return next()
    }
    const token =
      req.headers.authorization.split(' ')[1] ||
      req.headers.cookie.split('jwt=')[1]

    if (!token) {
      req.isAuth = false
      return next()
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.payload)
    if (!user) {
      req.isAuth = false
      return next()
    }

    req.user = user
    req.isAuth = true
    next()
  } catch (error) {
    return next(error)
  }
}
