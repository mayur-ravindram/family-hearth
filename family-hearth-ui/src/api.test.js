import { describe, it, expect, vi } from 'vitest';
import api, { createPost, getSignedUrl, uploadFile, confirmMedia } from './api';

// Mock the entire api module
vi.mock('./api', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getSignedUrl: vi.fn(),
    uploadFile: vi.fn(),
    confirmMedia: vi.fn(),
    default: {
      post: vi.fn(),
    },
  };
});

describe('createPost', () => {
  it('should call confirmMedia after creating a post with media', async () => {
    // Arrange
    const postData = {
      content: 'Test post',
      file: new File([''], 'test.jpg', { type: 'image/jpeg' }),
    };
    const signedUrlResponse = {
      data: {
        url: 'http://mock-url.com',
        mediaId: 123,
      },
    };
    const postResponse = {
      data: {
        id: 456,
      },
    };

    // Mock the implementations
    getSignedUrl.mockResolvedValue(signedUrlResponse);
    uploadFile.mockResolvedValue({});
    api.post.mockResolvedValue(postResponse);
    confirmMedia.mockResolvedValue({});

    // Act
    await createPost(postData);

    // Assert
    expect(getSignedUrl).toHaveBeenCalledWith({
      fileName: 'test.jpg',
      contentType: 'image/jpeg',
    });
    expect(uploadFile).toHaveBeenCalledWith('http://mock-url.com', postData.file);
    expect(api.post).toHaveBeenCalledWith('/posts', {
      type: 'media',
      contentJson: { content: 'Test post' },
      mediaIds: [123],
    });
    expect(confirmMedia).toHaveBeenCalledWith({
      mediaId: 123,
      postId: 456,
    });
  });
});
