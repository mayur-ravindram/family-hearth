import { useParams } from 'react-router-dom';

function PostPage() {
  const { postId } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold mb-6">Post Details</h1>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg">
        <p>Post ID: {postId}</p>
      </div>
    </div>
  );
}

export default PostPage;

