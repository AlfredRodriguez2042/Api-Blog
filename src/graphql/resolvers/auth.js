import User from '../../models/user'

export default {
  Mutation: {
    Login: async (_, { input }, { request: { req, res } }) => {
      const { email, password } = input
      const user = await User.findOne({ email })
      if (!user) {
        throw new Error('invalid email/password, try again')
      }
      req.session.userId = user._id
      const token = 'asdasdsa'
      console.log(req)
      console.log(req.session.userId)
      return { user, token }
    }
  }
}
