export default `

  type Query {
    Post(_id:ID): Post!
    Posts:[Post!]
  }

  type Post {
    _id: ID
    title: String!
    slug: String!
    body: String!
    author: UserShort!
    language: String!
    image: String!
    createdAt: String!
    comment:[Comment!]
    commentNum: Int
    likes:[Likes!]
    likesNum: Int
    tags:[Tag!]
  }

  type PostShort {
    _id: ID
    title: String!
    image: String!
  }

  type Mutation {
    createPost(input: PostInput): Post!
    deletePost(_id:ID): Post!
    deletePosts(_id:ID): Post!
  }

  input PostInput {
    title: String!
    slug: String!
    body: String!
    author: String!
    tags:[TagInput]!
  }

`
