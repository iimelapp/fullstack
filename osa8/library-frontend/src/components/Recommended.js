import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries'

const Recommended = ({ show, user }) => {
    const books = useQuery(ALL_BOOKS)
    const genre = user.data.me.favoriteGenre
    const booksToShow = books.data.allBooks.filter(book => book.genres.includes(genre))
    if (!show) {
        return null
    }

    return (
        <div>
            <h2>recommendations</h2>
            <p>books in your favorite genre <b>{genre}</b></p>
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
        </div>
    )
}

export default Recommended