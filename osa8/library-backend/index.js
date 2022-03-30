const { ApolloServer, UserInputError, gql, AuthenticationError } = require('apollo-server')
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const MONGODB_URI = 'mongodb+srv://fullstack:testisalasana@cluster0.a4inh.mongodb.net/libraryApp?retryWrites=true&w=majority'

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })


const typeDefs = gql`
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Author {
      name: String!
      born: Int
      bookCount: Int!
  }
  type Query {
      bookCount: Int!
      authorCount: Int!
      allBooks(author: String, genre: String): [Book!]!
      allAuthors: [Author!]!
      me: User
  }
  type Mutation {
      addBook(
          title: String!
          published: Int!
          author: String!
          genres: [String!]
      ): Book
      editAuthor(name: String!, setBornTo: Int!) : Author
      createUser(
        username: String!
        favoriteGenre: String!
      ): User
      login(
        username: String!
        password: String!
      ): Token
  }
`

const resolvers = {
  Query: {
      bookCount: async () => Book.collection.countDocuments(),
      authorCount: async () => Author.collection.countDocuments(),
      allBooks: async (root, args) => {
        console.log((await Book.find({})))
        if (!args.author && (args.genre)) return Book.find({ genres: args.genre})
        //else if ((args.author) && !(args.genre)) return books.filter(book => book.author === args.author)
        //else if ((args.author) && (args.genre)) return books.filter(book => book.genres.includes(args.genre) && book.author === args.author)
        //return books
        return Book.find({}).populate('author')
      },
      allAuthors: async (root, args) => {
        return Author.find({})
      },
      me: (root, args, { currentUser }) => {
        return currentUser
      }
  },
  Author: {
      bookCount: async (root) => { 
        const count = await Book.find({author: root}).populate('author').countDocuments()
        return count
      }
  },
  Mutation: {
      addBook: async (root, args, { currentUser }) => {
        if (!currentUser) {
          throw new AuthenticationError("not authenticated")
        }
        let author = await Author.findOne({ name: args.author})
          if (!author) {
              author = new Author({ name: args.author, born: null })
              try {
                await author.save()
              } catch (error) {
                throw new UserInputError(error.message, {
                  invalidArgs: args
                })
              }
              
          }
          const book = new Book({ ...args, author: author })

          try {
            book.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          return book
      },
      editAuthor: async (root, args, { currentUser }) => {
          if (!currentUser) {
            throw new AuthenticationError("not authenticated")
          }
          const author = await Author.findOne({ name: args.name })
          author.born = args.setBornTo
          try {
            await author.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args
            })
          }
          return author
      },
      createUser: async (root, args) => {
        const user = new User({ username: args.username, favoriteGenre: args.favoriteGenre })

        return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
      },
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })

        if ( !user || args.password !== 'secret' ) {
          throw new UserInputError("wrong credentials")
        }

          const userForToken = {
            username: user.username,
            id: user._id,
          }

        return { value: jwt.sign(userForToken, JWT_SECRET) }
       },
    },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})