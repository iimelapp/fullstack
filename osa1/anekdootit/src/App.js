import React, { useState } from 'react'

const Button = ({handleClick, text}) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = (props) => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState(Array(anecdotes.length).fill(0))
  const [best, setBest] = useState(0)
  
  const handleNext = () => {
    setSelected(Math.floor(Math.random() * 7))
  }

  const handleVote = () => {
    const copy = {...points}
    copy[selected] +=1
    setPoints(copy)
    if (points[best] <= points[selected]) {
      setBest(selected)
    }
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button handleClick={handleNext} text='next anecdote' />
      <Button handleClick={handleVote} text='vote' />
      <h1>Anecdote with most votes</h1>
      <div>{anecdotes[best]}</div>
      <div>has {points[best]} votes</div>
    </div>
  )
}

export default App