import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getFamilyPosts, getCurrentUserFamily, getCurrentUser } from '../api';
import GenerateInvite from './GenerateInvite';
import UserProfile from './UserProfile';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [family, setFamily] = useState(null);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [nextCursor, setNextCursor] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      let familyData = null;
      const storedFamilyData = localStorage.getItem('family');

      if (storedFamilyData) {
        try {
          familyData = JSON.parse(storedFamilyData);
        } catch (e) {
          console.error("Error parsing stored family data:", e);
          localStorage.removeItem('family');
        }
      }

      if (!familyData || !familyData.id) {
        try {
          console.log("No family data in localStorage, fetching from API...");
          familyData = await getCurrentUserFamily();
          if (familyData && familyData.id) {
            localStorage.setItem('family', JSON.stringify(familyData));
          } else {
            throw new Error("Could not retrieve family information.");
          }
        } catch (error) {
          console.error('Failed to fetch user family:', error);
          navigate('/login');
          return;
        }
      }

      setFamily(familyData);
      fetchPosts(familyData.id);

      let userData = null;
      const storedUserData = localStorage.getItem('user');

      if (storedUserData) {
        try {
          userData = JSON.parse(storedUserData);
        } catch (e) {
          console.error("Error parsing stored user data:", e);
          localStorage.removeItem('user');
        }
      }

      if (!userData || !userData.id) {
        try {
          console.log("No user data in localStorage, fetching from API...");
          userData = await getCurrentUser();
          if (userData && userData.id) {
            localStorage.setItem('user', JSON.stringify(userData));
          } else {
            throw new Error("Could not retrieve user information.");
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          navigate('/login');
          return;
        }
      }
      setUser(userData);
    };

    loadDashboard();

  }, [navigate]);

  const fetchPosts = async (familyId, cursor = null) => {
    try {
      const data = await getFamilyPosts(familyId, cursor);
      if (data && data.posts) {
        setPosts((prevPosts) => (cursor ? [...prevPosts, ...data.posts] : data.posts));
        setNextCursor(data.nextCursor);
      } else {
        setPosts([]);
        setNextCursor(null);
      }
    } catch (error) {
      setError(error.message);
      console.error('Error fetching posts:', error);
    }
  };

  const handleLoadMore = () => {
    if (nextCursor && family) {
      fetchPosts(family.id, nextCursor);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    localStorage.removeItem('family');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user ? user.firstName : '[User]'}!</h1>
        {family && <h2>{family.name}</h2>}
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </div>

      {family && <GenerateInvite familyId={family.id} />}

      {error && <p className="error-message">{error}</p>}

      <div className="post-feed">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post-card">
              <div className="post-header">
                <UserProfile user={post.author} />
                <div className="post-info">
                  <span className="post-author">{user.firstName}</span>
                  <span className="post-time">{new Date(post.createdAt).toLocaleString()}</span>
                </div>
              </div>
              <p className="post-content">{post.contentJson && post.contentJson.text}</p>
              <div className="post-media">
                {post.media && post.media.map((media) => (
                  <img
                    key={media.id}
                    src={`http://localhost:8080/api/v1/media/files/${media.storagePath}`}
                    alt="post media"
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <p>No posts yet. Be the first to share something with your family!</p>
        )}
      </div>

      {nextCursor && <button onClick={handleLoadMore} className="btn-load-more">Load More</button>}
    </div>
  );
}

export default Dashboard;