import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Recommended from './components/Recommended'
import { ALL_AUTHORS, ALL_BOOKS, ME } from './queries'
import { useQuery, useApolloClient } from '@apollo/client'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(null)
  const [loggedin, setLoggedin] = useState(false)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const user = (useQuery(ME))
  const client = useApolloClient()

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  if (!token) {
    return (
      <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('login')}>login</button>
      </div>
      <Authors show={page === 'authors'} result={authors} loggedin={loggedin}/>

      <Books show={page === 'books'} result={books} />

      <LoginForm show={page === 'login'} setToken={setToken} setLoggedin={setLoggedin} />
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => setPage('recommended')}>recommended</button>
        <button onClick={logout}>logout</button>
      </div>

      <Authors show={page === 'authors'} result={authors} loggedin={loggedin}/>

      <Books show={page === 'books'} result={books} />

      <NewBook show={page === 'add'} />

      <Recommended show={page === 'recommended'} user={user}/> 
    </div>
  )
}

export default App