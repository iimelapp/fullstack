import { useState } from "react"

const Books = ({ show, result }) => {
  const [genres, setGenres] = useState([])
  const [filter, setFilter] = useState('')


  if (!show) {
    return null
  }

  if (result.loading)  {
    return <div>loading...</div>
  }

  result.data.allBooks.forEach(book => {
    book.genres.forEach(genre => {
      if (!genres.includes(genre)) {
        setGenres(genres.concat(genre))
      }
    })
  })

  const booksToShow = (filter === '')
    ? result.data.allBooks
    : result.data.allBooks.filter(book => book.genres.includes(filter))
  

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {booksToShow.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>{genre}</button>
      ))}<button key='all' onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books