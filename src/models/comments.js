import { Schema, model } from 'mongoose'

const commentSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  body: { type: String, required: true },
  published: { type: Boolean, default: false },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  post: { type: Schema.Types.ObjectId, ref: 'Posts' },
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})
commentSchema.pre(/^find/, function(next) {
  this.populate({ path: 'likes' }).populate({ path: 'author' })
  next()
})

export default model('Comment', commentSchema)
