export default `
  type Query {
    User(_id:ID):User!
    Users:[User!]
  }

  type User {
    _id: ID!
    name: String!
    username: String!
    email: String!
    password: String
    privilege: String
    active: Boolean!
    createAt: String!
    posts:[PostShort!]
    comments:[Comment!]
  }

  type UserShort {
    _id: ID!
    username: String!
    thumbnail: String
  }

  type AuthPayload {
    token: String!
  }

  type Mutation {
    createUser(input: UserInput!): User!
    deleteUser(_id:ID): User!
    Login(input: LoginInput): AuthPayload!
  }

  input UserInput {
    name: String!
    username: String!
    email: String!
    password: String!
  }

  input LoginInput {
    email: String!
    password: String!
  }

`
