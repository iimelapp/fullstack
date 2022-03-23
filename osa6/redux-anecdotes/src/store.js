import { configureStore } from '@reduxjs/toolkit'
import anecdoteReducer, { setAnecdotes } from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import anecdoteService from './services/anecdotes'

const store = configureStore({
    reducer: {
        anecdotes: anecdoteReducer,
        notification: notificationReducer
    }
})

anecdoteService.getAll().then(anecdotes => 
    store.dispatch(setAnecdotes(anecdotes))
)
console.log(store.getState())

export default store