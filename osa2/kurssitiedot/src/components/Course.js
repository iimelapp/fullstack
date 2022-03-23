const Header = ({course}) => (

    <div><h2>{course}</h2></div>
  )
  
  const Part = ({part}) => {
    return (
      <div>
        <p>{part.name} {part.exercises}</p>
      </div>
    )
  
  }
  
  const Content = ({parts}) => {
    return (
      <div>
       {parts.map(part => 
        <Part key={part.id} part={part} />)}
      </div>
  
    )
  }
  
  const Total = ({parts}) => {
    const exercises = parts.map(part => 
      part.exercises)
    const total = exercises.reduce((s, p) => s + p)
      return (
        <div>Number of exercises {total}</div>
      )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header course={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
  }

export default Course