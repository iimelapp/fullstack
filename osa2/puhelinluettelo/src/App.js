import { useEffect, useState } from 'react'
import personService from './services/persons'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'

const Error = ({message}) => {
  if (message === null) return null
  return (
    <div className='error'>{message}</div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [notification, setNotification] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.map(person => person.name).includes(personObject.name)) {
      if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
        const person = persons.find(p => p.name === newName)
        personService
          .update(person.id, {...person, number: newNumber})
          .then(updatedPerson => {
            setPersons(persons.map(p => (p.name === newName ? updatedPerson : p)))
            setNotification(`${person.name}'s number was updated`)
            setNewName('')
            setNewNumber('')
            setTimeout(() => {
              setNotification(null)
            }, 5000)
          })
          .catch(error => {
            setErrorMessage(`${personObject.name} was already deleted from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
            setPersons(persons.filter(p => p.id !== person.id))
          })
      }
    }

    else {
      personService
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          setNotification(`${personObject.name} was added to phonebook`)
          setTimeout(() => {
            setNotification(null)
          }, 5000)
        })
        .catch(error => {
          setErrorMessage(`${error.response.data.error}`)
          setTimeout(() => {
            setErrorMessage(null)
          }, 10000)
        })
    }

  }

  const deletePerson = (name, id) => {
   if (window.confirm(`Delete ${name}?`)) {
    personService
    .deletePerson(id)
    .then(() => {
      setPersons(persons.filter(p => p.id !== id))
      setNotification(`${name} was deleted from phonebook`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    })
    .catch(error => {
      setErrorMessage(`${name} was already deleted from server`)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setPersons(persons.filter(p => p.id !== id))
      setNewName('')
      setNewNumber('')
    })
   }

  }

  const namesToShow = (newFilter === '') 
    ? persons
    : persons.filter(person => person.name.toUpperCase().includes(newFilter.toUpperCase()))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }



  return (
    <div>
      <Notification message={notification} />
      <Error message={errorMessage} />
      <h2>Phonebook</h2>
      <Filter newFilter={newFilter} handleFilterChange={handleFilterChange} />
      <h2>add a new</h2>
      <PersonForm addName={addName} newName={newName} newNumber={newNumber}
        handleNameChange={handleNameChange} handleNumberChange={handleNumberChange} />
      <h2>Numbers</h2>
      <Persons namesToShow={namesToShow} deletePerson={deletePerson} />
    </div>
  )

}

export default App