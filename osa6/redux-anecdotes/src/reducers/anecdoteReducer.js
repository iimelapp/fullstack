import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
  
  const initialState = []

  const anecdoteSlice = createSlice({
      name: 'anecdotes',
      initialState,
      reducers: {
          appendAnecdote(state, action) {
              state.push(action.payload)
          },
          setAnecdotes(state, action) {
              return action.payload
          }
      }
  })
  
export const { appendAnecdote, setAnecdotes } = anecdoteSlice.actions  

export const initializeAnecdotes = () => {
    return async dispatch => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = anecdote => {
    return async dispatch => {
        const newAnecdote = await anecdoteService.createNew(anecdote)
        dispatch(appendAnecdote(newAnecdote))
    }
}

export const voteAnecdote = (anecdote) => {
    return async dispatch => {
        await anecdoteService.voteAnecdote(anecdote)
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export default anecdoteSlice.reducer