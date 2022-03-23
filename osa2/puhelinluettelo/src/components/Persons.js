const Persons = ({namesToShow, deletePerson}) => {
  return (
    <ul>
    {namesToShow.map(person => 
      <p key={person.name}>{person.name} {person.number} <button onClick={() => deletePerson(person.name, person.id)}>delete</button>
      </p>)}
  </ul>
  )
}

export default Persons