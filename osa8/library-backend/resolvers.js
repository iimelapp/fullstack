const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const jwt = require('jsonwebtoken')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

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

          pubsub.publish('BOOK_ADDED', { bookAdded: book})
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
    Subscription: {
        bookAdded: {
            subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
        }
    }
}

module.exports = resolvers