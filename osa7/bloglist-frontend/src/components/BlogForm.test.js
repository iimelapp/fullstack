import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('a blog can be created', () => {
  const createBlog = jest.fn()

  render(<BlogForm createBlog={createBlog} />)

  const title = screen.getByPlaceholderText('title')
  const author = screen.getByPlaceholderText('author')
  const url = screen.getByPlaceholderText('url')
  const sendButton = screen.getByText('create')

  userEvent.type(title, 'testing form')
  userEvent.type(author, 'Vilho')
  userEvent.type(url, 'vilhonblogi.com')
  userEvent.click(sendButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing form')
  expect(createBlog.mock.calls[0][0].author).toBe('Vilho')
  expect(createBlog.mock.calls[0][0].url).toBe('vilhonblogi.com')
})
