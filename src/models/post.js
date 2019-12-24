import { Schema, model } from 'mongoose'
import Comment from './comments'
import Tags from './tag'

const postSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  slug: { type: String, unique: true, required: true },
  readingTime: { type: String, default: '3 min' },
  body: { type: String, required: true },
  language: { type: String, default: 'es', enum: ['es', 'en'] },
  image: { type: String },
  published: { type: Boolean, default: false },
  createdAt: { type: String, default: new Date() },
  updatedAt: { type: String, default: new Date() },
  comment: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tags' }]
})

postSchema.pre(/^find/, function(next) {
  this.populate({ path: 'author' })
    .populate({ path: 'comment' })
    .populate({ path: 'tags' })
    .populate({ path: 'likes' })
  next()
})

postSchema.pre('remove', async function(next) {
  try {
    await Comment.deleteMany({ _id: { $in: this.comment } })
    await Tags.deleteMany({ _id: { $in: this.tags } })
    console.log('postschema... ')
    next()
  } catch (error) {
    next(error)
  }
})

export default model('Posts', postSchema)
