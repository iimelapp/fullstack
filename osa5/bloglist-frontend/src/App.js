import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'


const Message = ({ message }) => {
  if (message === null) return null
  return (
    <div className='notification'>{message}</div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort(compareLikes))
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setMessage('wrong username or password')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }

  }

  const handleLogout = (event) => {
    event.preventDefault()

    window.localStorage.clear()
    setUser(null)
  }

  const loginForm = () => (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
          <input
            id='username'
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
          <input
            id='password'
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button id='login-button' type="submit">login</button>
      </form>
    </div>
  )

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
      .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} was added`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }

  const addLikes = async (likedBlog) => {
    const blogs = await blogService.getAll()
    const changedBlog = { ...likedBlog, likes: likedBlog.likes + 1 }
    blogService.update(likedBlog.id, changedBlog)
    setBlogs(blogs.map(blog => blog.id !== likedBlog.id ? blog : changedBlog).sort(compareLikes))
  }

  const removeBlog = async (blogToRemove) => {
    if (window.confirm(`Remove blog ${blogToRemove.title}?`)) {
      blogService.deleteBlog(blogToRemove.id)
      setBlogs(blogs.filter(b => b.id !== blogToRemove.id))
    }
  }

  const compareLikes = (a, b) => {
    return b.likes - a.likes
  }

  const blogFormRef = useRef()

  return (
    <div>
      <Message message={message}/>
      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged in <button id='logout-button' onClick={handleLogout}>logout</button></p>
          <Togglable buttonLabel="new blog" ref={blogFormRef}>
            <BlogForm createBlog={addBlog}/>
          </Togglable>
          {blogs.map(blog =>
            <Blog key={blog.id}
              blog={blog}
              addLikes={() => addLikes(blog)}
              removeBlog={() => removeBlog(blog)}
              viewButton={blog.user.username === user.username}
            />
          )}
        </div>
      }
    </div>
  )
}

export default App