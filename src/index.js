import { GraphQLServer } from "graphql-yoga";
import { type } from "os";
import { log } from "util";

// Scaler DataTypes: String, Boolean, Int, Float, ID

// demo user data
const users = [
  {
    id: "1",
    name: "Akash",
    email: "akash@gmail.com",
    age: 23
  },
  {
    id: "2",
    name: "Sarah",
    email: "Sarah@yahoo.com"
  },
  {
    id: "3",
    name: "Mike",
    email: "Mike@hotmail.com"
  }
];

const posts = [
  {
    id: "abc",
    title: "draft post",
    body: "draft post not published",
    published: false,
    author: "1"
  },
  {
    id: "bcd",
    title: "one new post",
    body: "Hello new post",
    published: true,
    author: "1"
  },
  {
    id: "cde",
    title: "one more post",
    body: "no description",
    published: true,
    author: "2"
  }
];

const comments = [
  {
    id: "a",
    text: "First Comment",
    author: "1",
    post: "abc"
  },
  {
    id: "b",
    text: "Second Comment",
    author: "1",
    post: "abc"
  },
  {
    id: "c",
    text: "Third Comment",
    author: "3",
    post: "bcd"
  },
  {
    id: "d",
    text: "Fourth Comment",
    author: "2",
    post: "bcd"
  }
];

// Type definations (schema)
const typeDefs = `
    type Query {
        users(query: String): [User!]!
        posts(query: String): [Post!]!
        comments: [Comment!]!
        me: User!
        post: Post!
    }

    type User {
        id: ID!
        name: String!
        email: String!
        age: Int
        posts: [Post!]!
        comments: [Comment!]!
    }

    type Post {
        id: ID!
        title: String!
        body: String!
        published: Boolean!
        author: User!
        comments: [Comment!]!
    }

    type Comment {
        id: ID!
        text: String!
        author: User!
        post: Post!
    }
`;
// Resolvers (functions)
// Params: parent, args, ctx, info
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }
      return users.filter(user => {
        return user.name.toLowerCase().includes(args.query.toLowerCase());
      });
    },
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }
      return posts.filter(post => {
        let q = args.query.toLowerCase();
        return (
          post.title.toLowerCase().includes(q) ||
          post.body.toLowerCase().includes(q)
        );
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
    me() {
      return {
        id: "123",
        name: "Akash",
        email: "akash@email"
      };
    },
    post() {
      return {
        id: "abc",
        title: "New Post for GraphQL",
        body: "adadsdadsadadsada",
        published: true
      };
    }
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.post === parent.id;
      });
    }
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter(post => {
        return post.author === parent.id;
      });
    },
    comments(parent, args, ctx, info) {
      return comments.filter(comment => {
        return comment.author === parent.id;
      });
    }
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find(user => {
        return user.id === parent.author;
      });
    },
    post(parent, args, ctx, info) {
      return posts.find(post => {
        return post.id === parent.post;
      });
    }
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("server is up & running on 4000");
});
