import User from '../../models/user'
import { checkAdmin, checkAuth } from '../../utils/auth'
import { validationUser } from '../../utils/validation'

export default {
  Query: {
    User: async (_, { _id }) => {
      const user = await User.findById(_id)
      if (!user) {
        throw new Error('the user doesnt exist')
      }
      return user
    },
    Users: async (_, __, { request: { req } }) => {
      checkAdmin(req)
      const users = await User.find({})
      //.populate('posts')
      // .populate('comments')

      return users
    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const { error } = validationUser(input)
      if (error) {
        throw new Error(`${error.message}`)
      }
      const user = await User.create(input)
      return user
    },
    deleteUser: async (_, { _id }, { request: { req } }) => {
      checkAuth(req)
      // checkAdmin(req)
      const user = await User.findById(_id)
      await user.remove()
      return user
    }
  }
}
