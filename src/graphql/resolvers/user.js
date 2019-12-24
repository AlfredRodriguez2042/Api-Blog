import User from '../../models/user'

export default {
  Query: {
    User: async (_, { _id }) => {
      const user = await User.findById(_id)
      if (!user) {
        throw new Error('the user doesnt exist')
      }
      return user
    },
    Users: async () => {
      const users = await User.find({})
      //.populate('posts')
      // .populate('comments')

      return users
    }
  },
  Mutation: {
    createUser: async (_, { input }) => {
      const user = await User.create(input)
      return user
    },
    deleteUser: async (_, { _id }) => {
      const user = await User.findById(_id)
      await user.remove()
      return user
    }
  }
}
