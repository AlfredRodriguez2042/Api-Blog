import Post from '../../models/post'
import User from '../../models/user'
import Tag from '../../models/tag'
import { checkAuth, checkAdmin } from '../../utils/auth'
import { validationPost } from '../../utils/validation'

export default {
  Query: {
    Post: async (_, { _id }, { PostLoader }) => {
      const post = await PostLoader.load(_id)
      return post
    },
    Posts: async (_, __, { client }) => {
      try {
        // usado el cache de redis
        const post = await client.lrange(process.env.REDIS_CACHE_KEY, 0, -1)
        const postsCache = post.map(item => JSON.parse(item))
        if (postsCache.length === 0) {
          // usando la DB
          const postDB = await Post.find().sort({ createdAt: -1 })
          console.log('mongo')
          return postDB
        } else {
          console.log('redis')
          return postsCache
        }
      } catch (error) {
        return error
      }
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
      const user = await User.findById(author)
      await user.posts.push(post._id)
      await user.save()

      return post
    },
    deletePost: async (_, { _id }, { client, request: { req } }) => {
      checkAuth(req)
      const post = await Post.findById(_id)

      if (!post.author === req.session.userId) {
        console.log('no es mi post')
      }
      // delete in redis cache
      await post.remove()
      return post
    },
    deletePosts: async (_, { _id }, { request: { req } }) => {
      checkAuth(req)
      checkAdmin(req)
      const post = await Post.findById(_id)
      await post.remove()
      return post
    }
  },
  Post: {
    commentNum: parent => {
      return parent.comment.length
    },
    likesNum: parent => {
      return parent.likes.length
    }
  }
}
