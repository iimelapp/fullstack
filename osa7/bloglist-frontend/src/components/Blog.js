import { useState } from 'react'
import { useParams } from 'react-router-dom'

const Blog = ({ blogs, likeBlog, addComment }) => {
  const [comment, setComment] = useState('')
  const id = useParams().id
  const blog = blogs.find(b => b.id === id)
  if (!blog) return null

  const handleSubmit = (event) => {
    console.log(id, comment)
    console.log(event.target.value)
    event.preventDefault()
    addComment(id, comment)
    console.log(id, comment)
    setComment('')
  }

  return (
    <div>
      <h2>{blog.title} {blog.author}</h2>
      <a href={`https://${blog.url}`}>{blog.url}</a>
      <p>{blog.likes} likes <button onClick={() => likeBlog(blog.id)}>like</button></p>
      <p>added by {blog.user.name}</p>
      <h3>comments</h3>
      <form onSubmit={handleSubmit}>
        <input value={comment}
          id='comment'
          onChange={({ target }) =>
            setComment(target.value)}></input>
        <button type='submit'>add comment</button>
      </form>
      {blog.comments.map(comment =>
        <li key={comment}>{comment}</li>
      )}
    </div>
  )
}

export default Blog