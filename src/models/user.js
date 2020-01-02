import { Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'

import Post from './post'

const userSchema = new Schema({
  name: { type: String, required: true },
  username: {
    type: String,
    required: true,
    // validate: {
    //   // eslint-disable-next-line
    //   validator: username => User.doesntExist({ username }),
    //   message: ({ value }) => `UserName ${value} has already been taken.`
    // },
    unique: [true, 'An account already exists with this username'],
    min: 4,
    max: 12
  },
  photo: { type: String },
  password: { type: String, required: true },
  email: {
    type: String,
    required: true,
    // validate: {
    //   // eslint-disable-next-line
    //   validator: email => User.doesntExist({ email }),
    //   message: ({ value }) => `Email ${value} has already been taken.`
    // },
    unique: [true, 'An account already exists with this email']
  },
  privilege: { type: String, default: 'regular', enum: ['regular', 'admin'] },
  active: { type: Boolean, default: false },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Posts' }],
  comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  createdAt: { type: Date, default: new Date() },
  updatedAt: { type: Date, default: new Date() }
})

async function passwordEncrypt(next) {
  try {
    this.password = await bcrypt.hash(this.password, 12)

    return next()
  } catch (error) {
    next(error)
  }
}
userSchema.statics.doesntExist = async function validate(op) {
  return (await this.where(op).countDocuments()) === 0
}
// userSchema.virtual('posts', {
//   ref: 'Posts',
//   localField: '_id',
//   foreignField: 'author'
// })

userSchema.pre('save', passwordEncrypt)

userSchema.pre(/^find/, function(next) {
  this.populate({ path: 'comments' })
  next()
})

const User = model('User', userSchema)

module.exports = User
