import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import usersService from '../services/users'
const Users  = () => {
  const [users, setUsers] = useState([])
  useEffect(() => {
    usersService.getAll().then(users => setUsers(users))
  }, [])

  return (
    <div>
      <h2>users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs created</th>
          </tr>
          {users.map(user =>
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`}>{user.name}</Link></td><td>{user.blogs.length}</td>
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}

export default Users