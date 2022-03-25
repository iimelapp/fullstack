import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog', () => {
  let container

  beforeEach(() => {
    const user = {
      username: 'vipsu',
      name: 'Vilho',
    }
    const blog = {
      title: 'Uusi blogi',
      author: 'Vilho',
      url: 'vilhonblogi.com',
      user: user,
    }

    container = render(<Blog blog={blog} />).container
  })

  test('renders content', () => {
    const element = screen.getByText('Uusi blogi Vilho')
    expect(element).toBeDefined()
  })

  test('at start the children are not displayed', () => {
    const div = container.querySelector('.fullInfo')
    expect(div).toHaveStyle('display: none')
  })

  test('clicking button will show full info', () => {
    const button = screen.getByText('view')
    userEvent.click(button)

    const div = container.querySelector('.fullInfo')
    expect(div).not.toHaveStyle('display: none')
  })
})

test('clicking the button twice calls event handler twice', async () => {
  const user = {
    username: 'vipsu',
    name: 'Vilho',
  }
  const blog = {
    title: 'Uusi blogi',
    author: 'Vilho',
    url: 'vilhonblogi.com',
    user: user,
  }

  const mockHandler = jest.fn()

  render(<Blog blog={blog} addLikes={mockHandler} />)

  const button = screen.getByText('like')
  userEvent.click(button)
  userEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})
