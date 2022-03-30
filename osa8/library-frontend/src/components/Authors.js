import { useMutation} from '@apollo/client'
import { useEffect, useState } from 'react'
import Select from 'react-select'

import { ALL_AUTHORS, EDIT_BORN } from '../queries'

const Authors = ({ show, result, loggedin }) => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const [updateAuthor, res] = useMutation(EDIT_BORN, {
    refetchQueries: [ { query: ALL_AUTHORS }],
      onError: (error) => {
        console.log((error.graphQLErrors[0].message))
      },
  })

  useEffect(() => {
    if (res.data && res.data.editAuthor === null) {
          console.log('error')
        }
    }, [res.data]) // eslint-disable-line


  if (!show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  const submit = async (event) => {
      event.preventDefault()
      console.log(event.target.value)
      updateAuthor({ variables: { name, born }})

      setName('')
      setBorn('')
    }

  const options = result.data.allAuthors.map(author => ({
      "value": author.name,
      "label": author.name
  }))

  if (!loggedin) {
    return (
      <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    )
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {result.data.allAuthors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
      <h3>Set birthyear</h3>
      <form onSubmit={submit}>
        <div>
          <Select
            placeholder="Select author"
            value={options.label}
            onChange={({ label }) => setName(label)}
            options={options}
          />
        </div>
        <div>
            born
            <input 
              value={born}
              onChange={({ target }) => setBorn(parseInt(target.value))}
            />
        </div>
        <button type="submit">update author</button>
        </form>
      </div>
    </div>
  )
}

export default Authors