import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getUserPosts, getPostComments } from '../api.js';

export default function Posts() {
  const { userId } = useParams();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openId, setOpenId] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError('');
      try {
        const data = await getUserPosts(userId);
        if (!cancelled) setPosts(data);
      } catch {
        if (!cancelled) setError('Failed to load posts');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  async function handleToggle(postId) {
    if (openId === postId) {
      setOpenId(null);
      return;
    }
    setOpenId(postId);
    if (commentsByPost[postId]) return;
    try {
      const data = await getPostComments(postId);
      setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
    } catch {
      setError('Failed to load comments');
    }
  }

  return (
    <div className="page">
      <h1>Posts</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      <ul className="list">
        {posts.map((post) => (
          <li key={post.id}>
            <button className="link-button" onClick={() => handleToggle(post.id)}>
              {post.title}
            </button>
            {openId === post.id && (
              <div className="post-detail">
                <p>{post.body}</p>
                <h3>Comments</h3>
                {!commentsByPost[post.id] && <p>Loading comments...</p>}
                {commentsByPost[post.id] && commentsByPost[post.id].length === 0 && (
                  <p>No comments.</p>
                )}
                <ul className="list">
                  {(commentsByPost[post.id] || []).map((c) => (
                    <li key={c.id}>
                      <strong>{c.name}</strong> ({c.email}): {c.body}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
      {!loading && posts.length === 0 && <p>No posts.</p>}
      <Link to="/home">Back to home</Link>
    </div>
  );
}
