import Comment from '../../models/comments'
import Post from '../../models/post'
import { checkAuth } from '../../utils/auth'
export default {
  Query: {
    Comments: async () => {
      //checkAuth(req)
      const come = await Comment.find()
      console.log(come)
      return come
    }
  },
  Mutation: {
    createComment: async (_, { postId, input }, { request: { req } }) => {
      checkAuth(req)
      const { body } = input

      const post = await Post.findById(postId)
      const comment = await Comment.create({
        body,
        author: req.session.userId,
        post: postId
      })

      await post.comment.push(comment._id)
      await post.save()

      return comment
    },
    deleteComment: async (_, { _id }, { request: { req } }) => {
      checkAuth(req)
      const comment = await Comment.findOneAndDelete({
        _id,
        author: req.session.userId
      })
      return comment
    },
    likePost: async (_, { id }, { PostLoader, request: { req } }) => {
      checkAuth(req)
      const post = await PostLoader.load(id)

      //  const post = await Post.findById({ _id: id })
      if (!post) {
        throw new Error('post not exist')
      }
      if (
        post.likes.find(
          like => like._id.toString() === req.session.userId.toString()
        )
      ) {
        console.log('toggle like')
        post.likes = post.likes.filter(
          like => like._id.toString() !== req.session.userId.toString()
        )
      } else {
        console.log('make like')
        post.likes.push(req.session.userId)
      }
      await post.save()
      console.log(post)
      return post
    },
    likeComment: async (_, { _id }) => {
      //  const comment = await Comment.findById(_id)
      //   if (commnet.likes.find(like => like.username === username)) {
      //     comment.likes = post.likes.filter(like => like.username !== username)
      //   } else {
      //     comment.likes.push({ username })
      //   }
      //   await comment.save()
      //   return comment
    }
  }
}
