import User from '../models/user'
import Post from '../models/post'
import DataLoader from 'dataloader'

export const UserLoader = new DataLoader(_id => {
  return User.find({ _id: { $in: _id } }).execute()
})
export const PostLoader = new DataLoader(_id => {
  return Post.find({ _id: { $in: _id } })
})
