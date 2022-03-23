import { useDispatch } from 'react-redux'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { setNotification, clearNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const addAnecdote = async (event) => {
        event.preventDefault()
        console.log(event.target)
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        dispatch(createAnecdote(content))
        dispatch(setNotification(`New anecdote '${content}' created'`))
        setTimeout(() => {
          dispatch(clearNotification())
        }, 5000)
      }
    
    return (
     <div>
        <h2>create new</h2>
        <form onSubmit={addAnecdote}>
          <div><input name="anecdote" /></div>
          <button type='submit'>create</button>
        </form>
     </div>
    )
}

export default AnecdoteForm