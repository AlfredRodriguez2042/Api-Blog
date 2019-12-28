import Post from '../../models/post'
import Tag from '../../models/tag'
import User from '../../models/user'
import { checkAuth, checkAdmin } from '../../utils/auth'
import { validationPost } from '../../utils/validation'

export default {
  Query: {
    Post: async (_, { _id }) => {
      const post = await Post.findById({ _id })
      return post
    },
    Posts: async () => {
      const posts = await Post.find().sort({ createdAt: -1 })
      return posts
    }
  },
  Mutation: {
    createPost: async (_, { input }, { request: { req } }) => {
      checkAuth(req)
      const { title, slug, body, author, tags } = input
      const { error } = validationPost({ title, slug, body, author, tags })
      if (error) {
        throw new Error(`${error.message}`)
      }

      const tag = await Tag.create(tags)
      const post = await Post.create({
        title,
        slug,
        body,
        author,
        tags: tag
      })
      const newUser = await User.findById(user)
      await newUser.posts.push(post._id)
      await newUser.update()

      return post
    },
    deletePost: async (_, { _id }, { request: { req, res } }) => {
      checkAuth(req)
      const post = await Post.findById({ _id })
      if (!post.author === req.session.userId) {
        console.log('no es mi post')
      }
      await post.remove()
      return post
    },
    deletePosts: async (_, { _id }, { request: { req, res } }) => {
      checkAuth(req)
      checkAdmin(req)
      const post = await Post.findById({ _id })
      await post.remove()
      return post
    }
  }
}
