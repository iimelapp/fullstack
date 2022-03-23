import { useState } from 'react'

const Button = ({handleClick, text}) => {
  return (
    <button onClick={handleClick}>{text}</button>
  )
}

const StatisticLine = ({text, value, end}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value} {end}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const all = good + bad + neutral
  if (all == 0) {
    return (
      <div>no feedback given</div>
    )
  }
  return (
    <div>
      <table>
        <tbody>
          <StatisticLine text='good' value={good} />
          <StatisticLine text='neutral' value={neutral} />
          <StatisticLine text='bad' value={bad} />
          <StatisticLine text='all' value={all} />
          <StatisticLine text='average' value={(good*1 + bad*(-1)) / (all)} />
          <StatisticLine text='positive' value={(good / (all))*100} end='%'/>
        </tbody>
      </table>
    </div>
  )
}

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' handleClick={increaseGood} />
      <Button text='neutral' handleClick={increaseNeutral} />
      <Button text='bad' handleClick={increaseBad} />
      <h1>statistics</h1>
      <Statistics good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App