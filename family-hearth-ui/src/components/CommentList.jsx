function CommentList({ comments, isLoading, error }) {
  if (isLoading) {
    return <p className="text-sm text-gray-500 mt-2">Loading comments...</p>;
  }

  if (error) {
    return <p className="text-sm text-red-500 mt-2">{error}</p>;
  }

  if (comments.length === 0) {
    return <p className="text-sm text-gray-500 mt-2">No comments yet.</p>;
  }

  return (
    <div className="mt-3 space-y-2">
      {comments.map(comment => (
        <div key={comment.id} className="text-sm">
          <span className="font-semibold mr-2">{comment.author.firstName} {comment.author.lastName}</span>
          <span>{comment.content}</span>
        </div>
      ))}
    </div>
  );
}

export default CommentList;
