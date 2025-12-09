import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import CreatePost from './CreatePost';
import * as api from '../api';

vi.mock('../api', () => ({
  createPost: vi.fn(),
}));

describe('CreatePost', () => {
  it('calls createPost with the correct data', async () => {
    render(
      <BrowserRouter>
        <CreatePost />
      </BrowserRouter>
    );

    const contentInput = screen.getByLabelText("What's on your mind?");
    const fileInput = screen.getByLabelText('Add a photo or video');
    const submitButton = screen.getByText('Post');

    const content = 'Test post content';
    const file = new File(['hello'], 'hello.png', { type: 'image/png' });

    fireEvent.change(contentInput, { target: { value: content } });
    fireEvent.change(fileInput, { target: { files: [file] } });

    fireEvent.click(submitButton);

    expect(api.createPost).toHaveBeenCalledWith({
      content,
      file,
    });
  });
});
