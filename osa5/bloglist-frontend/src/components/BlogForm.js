import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    setNewUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl
    })

    setNewTitle('')
    setNewAuthor('')
    setNewUrl('')
  }

  return (
    <div className='formDiv'>
      <h2>create new blog</h2>
      <form onSubmit={addBlog}>
        <p>title: <input id='title' type="text" value={newTitle} onChange={handleTitleChange} placeholder='title'/></p>
        <p>author: <input id='author' type="text" value={newAuthor} onChange={handleAuthorChange} placeholder='author'/></p>
        <p>url: <input id='url' type="text" value={newUrl} onChange={handleUrlChange} placeholder='url'/> </p>
        <button id='create-button' type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm