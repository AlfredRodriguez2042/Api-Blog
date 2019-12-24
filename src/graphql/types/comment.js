export default `
  type Query {
    Comments:[Comment]
  }
  type Comment {
    _id: ID!
    author: UserShort!
    createdAt: String!
    updatedAt: String!
    post: PostShort!
    body: String!
    likes:[Likes!]
  }

  type Mutation {
    createComment(postId: ID , input: CommentInput): Comment!
    deleteComment(_id:ID): Comment!
  }

  input CommentInput {
    body: String!
  }
`
// mutacion puede devolver un post!
