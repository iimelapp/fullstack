import { useState, useEffect, useRef } from 'react'

import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
//import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
//import Togglable from './components/Togglable'
import Blogs from './components/Blogs'

import blogService from './services/blogs'
import loginService from './services/login'
import userService from './services/user'
import {
  BrowserRouter as Router, Link, Route, Routes,
} from 'react-router-dom'
import Users from './components/Users'
import User from './components/User'
import usersService from './services/users'
import { Alert, Nav, Navbar } from 'react-bootstrap'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState(null)
  const blogFormRef = useRef()
  const byLikes = (b1, b2) => b2.likes>b1.likes ? 1 : -1
  const [users, setUsers] = useState([])
  const [message, setMessage] = useState(null)
  useEffect(() => {
    usersService.getAll().then(users => setUsers(users))
  }, [])

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs.sort(byLikes) )
    )
  }, [])

  useEffect(() => {
    const userFromStorage = userService.getUser()
    if (userFromStorage) {
      setUser(userFromStorage)
    }
  }, [])

  const login = async (username, password) => {
    loginService.login({
      username, password,
    }).then(user => {
      setUser(user)
      userService.setUser(user)
      setMessage(`welcome ${user.name}`)
      setTimeout(() => {
        setMessage(null)
      }, 10000)
    }).catch(() => {
      notify('wrong username/password', 'alert')
    })
  }

  const logout = () => {
    setUser(null)
    userService.clearUser()
    notify('good bye!')
  }

  const createBlog = async (blog) => {
    blogService.create(blog).then(createdBlog => {
      notify(`a new blog '${createdBlog.title}' by ${createdBlog.author} added`)
      setBlogs(blogs.concat(createdBlog))
      blogFormRef.current.toggleVisibility()
    }).catch(error => {
      notify('creating a blog failed: ' + error.response.data.error, 'alert')
    })
  }

  /*const removeBlog = (id) => {
    const toRemove = blogs.find(b => b.id === id)

    const ok = window.confirm(`remove '${toRemove.title}' by ${toRemove.author}?`)

    if (!ok) {
      return
    }

    blogService.remove(id).then(() => {
      const updatedBlogs = blogs
        .filter(b => b.id!==id)
        .sort(byLikes)
      setBlogs(updatedBlogs)
    })
  }*/

  const likeBlog = async (id) => {
    const toLike = blogs.find(b => b.id === id)
    const liked = {
      ...toLike,
      likes: (toLike.likes||0) + 1,
      user: toLike.user
    }
    blogService.update(liked.id, liked).then(updatedBlog => {
      updatedBlog = {
        ...liked,
        user: toLike.user
      }
      notify(`you liked '${updatedBlog.title}' by ${updatedBlog.author}`)
      const updatedBlogs = blogs
        .map(b => b.id===id ? updatedBlog : b)
      setBlogs(updatedBlogs)
    })
  }

  const addComment = async (id, comment) => {
    console.log(id, comment)
    await blogService.comment(id, comment)
  }


  const notify = (message, type='info') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  if (user === null) {
    return <>
      <Notification notification={notification} />
      <LoginForm onLogin={login} />
    </>
  }

  const padding = {
    padding: 5
  }
  /*
          <div>
          <Link style={padding} to='/'>blogs</Link>
          <Link style={padding} to='/users'>users</Link>
          {user.name} logged in
          <button onClick={logout}>logout</button>
        </div>
  */

  return (
    <Router>
      <div className='container'>
        <Navbar collapseOnSelect expand="lg" bg="light" navbar="light">
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/">blogs</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                <Link style={padding} to="/users">users</Link>
              </Nav.Link>
              <Nav.Link href="#" as="span">
                {user
                  ? <em>{user.name} logged in <button onClick={logout}>logout</button></em>
                  : <Link to="/login">login</Link>
                }
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <h2>blogs</h2>

        {(message &&
    <Alert variant="success">
      {message}
    </Alert>
        )}

        <Routes>
          <Route path='/users' element={<Users />}/>
          <Route path='/users/:id' element={<User users={users} />}/>
          <Route path='/blogs/:id' element={<Blog
            blogs={blogs}
            likeBlog={likeBlog}
            addComment={addComment}/>} />
          <Route path='/' element={<Blogs blogFormRef={blogFormRef} addBlog={createBlog} blogs={blogs}/>}/>
        </Routes>
      </div>
    </Router>

  )
}

export default App