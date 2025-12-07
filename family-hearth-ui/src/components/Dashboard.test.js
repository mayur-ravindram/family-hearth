import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';
import { MemoryRouter } from 'react-router-dom';

jest.mock('../api', () => ({
  getFamilyPosts: jest.fn(() => Promise.resolve({
    posts: [
      {
        id: 1,
        contentJson: { text: 'Test post 1' },
        createdAt: new Date().toISOString(),
        author: { firstName: 'John', lastName: 'Doe' },
        media: [],
      },
    ],
    nextCursor: null,
  })),
  getCurrentUserFamily: jest.fn(() => Promise.resolve({ id: 1, name: 'Test Family' })),
  getCurrentUser: jest.fn(() => Promise.resolve({ id: 1, firstName: 'Current', lastName: 'User' })),
}));

describe('Dashboard', () => {
  it('displays the correct author name for posts', async () => {
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    const authorName = await screen.findByText('John Doe');
    expect(authorName).toBeInTheDocument();
  });
});
