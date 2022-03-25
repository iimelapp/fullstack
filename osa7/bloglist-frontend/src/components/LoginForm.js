/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    onLogin(username, password)
  }

  return (
    <div className='container'>
      <h2>login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          username
          <input
            value={username}
            onChange={({ target }) => setUsername(target.value)}
            id='username'
          />
          password
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            id="password"
          />
          <Button variant="primary" type="submit">
              login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

/*

*/

export default LoginForm