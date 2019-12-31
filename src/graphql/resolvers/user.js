import User from '../../models/user'
import Post from '../../models/post'
import { checkAdmin, checkAuth } from '../../utils/auth'
import { validationUser, verify } from '../../utils/validation'

export default {
  Query: {
    User: async (_, { _id }, { UserLoader }) => {
      const user = await UserLoader.load(_id)
      if (!user) {
        throw new Error('the user doesnt exist')
      }
      return user
    },
    Users: async (_, __, { request: { req } }) => {
      // checkAdmin(req)

      const users = await User.find({})
      //.populate('posts')
      // .populate('comments')
      return users
    },
    Profile: async (_, __, { request: { req } }) => {
      checkAuth(req)
      const user = await User.findById(req.session.userId)
      return user
    }
  },
  Mutation: {
    createUser: async (_, { input }, { request: { req } }) => {
      const { error } = validationUser(input)
      if (error) {
        throw new Error(`${error.message}`)
      }
      const { email, username } = input
      const Email = await User.findOne({ email })
      const Username = await User.findOne({ username })
      verify(Email, email)
      verify(Username, username)
      const user = await User.create(input)
      console.log(req)
      return user
    },
    deleteUser: async (_, { _id }, { request: { req } }) => {
      // checkAuth(req)
      // checkAdmin(req)
      const user = await User.findById(_id)
      await user.remove()
      return user
    }
  },
  User: {
    posts: async (parent, _, { PostLoader }) => {
      return await PostLoader.load(parent.posts)
    }
  }
}
