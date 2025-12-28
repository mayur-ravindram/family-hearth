import { useEffect, useState } from 'react';

import { 
  likePost, 
  unlikePost, 
  getComments 
} from '../authedApi';

import { getMediaUrl } from '../utils';
import CommentBox from './CommentBox';
import CommentList from './CommentList';

function PostCard({ post }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [commentsError, setCommentsError] = useState('');

  const fetchComments = async () => {
    setCommentsLoading(true);
    setCommentsError('');
    try {
      const response = await getComments(post.id);
      setComments(response.data);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setCommentsError('Failed to load comments.');
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [post.id]);

  const handleLikeClick = async () => {
    const originalLikedState = isLiked;
    setIsLiked(!originalLikedState);
    setLikeCount(originalLikedState ? likeCount - 1 : likeCount + 1);
    try {
      if (!originalLikedState) {
        await likePost(post.id);
      } else {
        await unlikePost(post.id);
      }
    } catch (error) {
      console.error('Failed to update like:', error);
      setIsLiked(originalLikedState);
      setLikeCount(originalLikedState ? likeCount + 1 : likeCount - 1);
    }
  };

  const handleCommentClick = () => {
    setIsCommentBoxOpen(!isCommentBoxOpen);
  };
  
  const handleCommentPosted = () => {
    setIsCommentBoxOpen(false);
    fetchComments();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-6 w-full max-w-[470px] mx-auto shadow-sm">
      {/* Header */}
      <div className="flex items-center p-3 border-b border-gray-300">
        <div className="h-8 w-8 rounded-full bg-red-300 mr-3 border border-sky-400 overflow-hidden">
          <div className="h-full w-full rounded-full bg-white flex items-center justify-center text-xs font-bold text-gray-600 border border-gray-200">
            <img src={getMediaUrl(post.author.avatarUrl)} alt="Author Avatar" className="h-full w-full rounded-full object-cover" />
          </div>
        </div>
        <p className="text-sm font-semibold text-gray-900">{post.author.firstName} {post.author.lastName}</p>
      </div>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <div className="w-full bg-black flex flex-col items-center">
          {post.media.map(mediaItem => (
            <img
              key={mediaItem.id}
              src={`/api/v1/media/files/${mediaItem.storagePath}`}
              alt="Post media"
              className="w-full h-auto object-contain max-h-[600px]"
            />
          ))}
        </div>
      )}

      {/* Content / Footer */}
      <div className="p-3">

        <div className="mb-2">
          {post.contentJson.text && (
            <p className="text-sm text-gray-800">
              <span className="font-semibold mr-2">{post.author.firstName} posted: </span>
              {post.contentJson.text}
            </p>
          )}
          {/* Action Buttons */}
          <div className="flex mt-3 space-x-4 items-center">
            <button onClick={handleLikeClick} className="focus:outline-none flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill={isLiked ? 'red' : 'none'} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 transition-colors duration-300 ${isLiked ? 'text-red-500' : 'text-gray-700'}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
              </svg>
              <span className="text-sm font-semibold">{likeCount}</span>
            </button>
            <button onClick={handleCommentClick} className="focus:outline-none flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
              <span className="text-sm font-semibold">{comments.length}</span>
            </button>
          </div>
        </div>

        {isCommentBoxOpen && (
          <>
            <CommentBox postId={post.id} onCommentPosted={handleCommentPosted} />
            <CommentList comments={comments} isLoading={commentsLoading} error={commentsError} />
          </>
        )}
        
        <p className="text-[10px] text-gray-500 uppercase tracking-wide mt-3">
          {new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true })}
        </p>
      </div>
    </div>
  );
}

export default PostCard;
