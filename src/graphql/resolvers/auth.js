import User from '../../models/user'
import bcrypt from 'bcrypt'
import { validationLogin } from '../../utils/validation'

export default {
  Mutation: {
    Login: async (_, { input }, { request: { req, res } }) => {
      const { email, password } = input
      const { error } = validationLogin(input)
      if (error) {
        throw new Error(`${error.message}`)
      }
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('invalid email/password, try again')
      }

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch) {
        throw new Error('invalid email/password, try again')
      }
      req.session.userId = user._id
      const token = 'asdasdsa'
      console.log(req.cookies)
      console.log(req.session.cookie)
      return { user, token }
    }
  }
}
