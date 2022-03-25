import Togglable from './Togglable'
import BlogForm from './BlogForm'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'

const Blogs = ({ blogFormRef, addBlog, blogs }) => {

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  }

  return (
    <div>
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog}/>
        </Togglable>
      </div>
      <Table striped>
        <tbody>
          {blogs.map(blog =>
            <tr key={blog.id} style={blogStyle}>
              <td>
                <Link to={`/blogs/${blog.id}`}>{blog.title} {blog.author}</Link>
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  )
}

export default Blogs