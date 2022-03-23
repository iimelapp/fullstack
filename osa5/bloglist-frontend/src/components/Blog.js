import React from 'react'
import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLikes, removeBlog, viewButton }) => {
  const [viewBlog, setViewBlog] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showBlog = { display: viewBlog ? '' : 'none' }
  const showRemoveBtn = { display: viewButton ? '' : 'none' }

  const toggleVisibility = () => {
    setViewBlog(!viewBlog)
  }

  return (
    <div style={blogStyle}>
      <div className='blog'>
        {blog.title} {blog.author} <button onClick={toggleVisibility}>{viewBlog ? 'hide' : 'view'}</button>
      </div>
      <div className='fullInfo' style={showBlog}>
        <div>{blog.url}</div>
        <div>likes {blog.likes} <button onClick={addLikes}>like</button></div>
        <div>{blog.user.name}</div>
        <div style={showRemoveBtn}><button onClick={removeBlog}>remove</button></div>
      </div>
    </div>
  )}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  removeBlog: PropTypes.func.isRequired,
  viewButton: PropTypes.bool.isRequired
}


export default Blog