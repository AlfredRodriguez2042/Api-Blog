import { Schema, model } from 'mongoose'

const tagsSchema = new Schema({
  name: { type: String }
})

export default model('Tags', tagsSchema)
