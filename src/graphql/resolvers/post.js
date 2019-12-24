import Post from '../../models/post'
import Tag from '../../models/tag'
import User from '../../models/user'

export default {
  Query: {
    Post: async (_, { _id }) => {
      const post = await Post.findById({ _id })
      return post
    },
    Posts: async () => {
      const posts = await Post.find()
      return posts
    }
  },
  Mutation: {
    createPost: async (_, { input }) => {
      const user = '5e005f1985f7dd6922a39a8a'
      const { title, slug, body, author, tags } = input
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
      const post = await Post.findById({ _id })

      await post.remove()
      return post
    },
    deletePosts: async (_, { _id }, { request: { req, res } }) => {
      const post = await Post.findById({ _id })
      await post.remove()
      return post
    }
  }
}
