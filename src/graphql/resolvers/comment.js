import Comment from '../../models/comments'
import Post from '../../models/post'

export default {
  Query: {
    Comments: async () => {
      const come = await Comment.find()
      console.log(come)
      return come
    }
  },
  Mutation: {
    createComment: async (_, { postId, input }, { request: { req } }) => {
      const { body } = input
      const user = '5e005f1985f7dd6922a39a8a'

      const post = await Post.findById(postId)
      const comment = await Comment.create({
        body,
        author: user,
        post: postId
      })

      await post.comment.push(comment._id)
      await post.save()

      return comment
    },
    deleteComment: async (_, { _id }) => {
      const comment = await Comment.findByIdAndDelete(_id)
      return comment
    },
    likePost: async (_, { id }) => {
      const author = '5e005f1985f7dd6922a39a8a'
      const post = await Post.findById({ _id: id })

      if (post.likes.find(like => like._id.toString() === author.toString())) {
        console.log('toggle like')
        post.likes = post.likes.filter(
          like => like._id.toString() !== author.toString()
        )
      } else {
        console.log('make like')
        post.likes.push(author)
      }
      await post.save()
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
