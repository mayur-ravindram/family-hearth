import { useState } from 'react';

import { addComment } from '../authedApi';

function CommentBox({ postId, onCommentPosted }) {
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (comment.trim() === '' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment(postId, { content: comment });
      setComment('');
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleCommentSubmit} className="mt-3">
      <div className="flex">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add a comment..."
          className="flex-grow text-sm border-gray-300 rounded-l-md p-2 focus:ring-blue-500 focus:border-blue-500"
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-r-md text-sm font-semibold hover:bg-blue-600 disabled:bg-blue-300"
          disabled={!comment.trim() || isSubmitting}
        >
          {isSubmitting ? 'Posting...' : 'Post'}
        </button>
      </div>
    </form>
  );
}

export default CommentBox;
