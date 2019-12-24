export default `

  type Tag {
    _id: ID
    name: String!
  }

  input TagInput {
    name: String!
  }
  type Likes {
    _id: ID!
    username: ID
    createdAt: String
  }

  type Mutation {
    likePost(id: ID): Post
    likeComment(_id: ID): Comment
  }

`
