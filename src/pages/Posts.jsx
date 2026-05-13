import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getUserPosts, createPost, deletePost, updatePost, 
  getPostComments, createComment, deleteComment, updateComment 
} from '../api.js';
import { UserContext } from '../contexts/UserContext.jsx';
import './Albums/albums.css';

export default function Posts() {
  const { userId } = useParams();
  const { currentUser } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentsLoading, setCommentsLoading] = useState(false);

  const [newCommentBody, setNewCommentBody] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentBody, setEditCommentBody] = useState('');

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
    return () => { cancelled = true; };
  }, [userId]);

  async function handleAddPost(e) {
    e.preventDefault();
    if (!newPostTitle.trim() || !newPostBody.trim()) return;
    const newPost = {
      userId: Number(userId),
      title: newPostTitle,
      body: newPostBody
    };
    try {
      const created = await createPost(newPost);
      setPosts(prev => [...prev, created]);
      setNewPostTitle('');
      setNewPostBody('');
      setShowAddForm(false);
    } catch {
      setError('Failed to add post');
    }
  }

  async function handleDeletePost(id) {
    setPosts(prev => prev.filter(p => p.id !== id));
    if (selectedPostId === id) setSelectedPostId(null);
    if (editingPostId === id) setEditingPostId(null);
    try {
      await deletePost(id);
    } catch {
      setError('Failed to delete post');
      const data = await getUserPosts(userId);
      setPosts(data);
    }
  }

  function handleSelectPost(id) {
    if (selectedPostId === id) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(id);
      setEditingPostId(null);
      setShowCommentsFor(null);
    }
  }

  function handleEditPostStart(post) {
    setEditingPostId(post.id);
    setSelectedPostId(null);
    setShowCommentsFor(null);
    setEditPostTitle(post.title);
    setEditPostBody(post.body);
  }

  async function handleEditPostSave(id) {
    if (!editPostTitle.trim() || !editPostBody.trim()) return;
    setPosts(prev => prev.map(p => p.id === id ? { ...p, title: editPostTitle, body: editPostBody } : p));
    setEditingPostId(null);
    try {
      await updatePost(id, { title: editPostTitle, body: editPostBody });
    } catch {
      setError('Failed to update post');
      const data = await getUserPosts(userId);
      setPosts(data);
    }
  }

  async function handleToggleComments(postId) {
    if (showCommentsFor === postId) {
      setShowCommentsFor(null);
      return;
    }
    setShowCommentsFor(postId);
    if (!commentsByPost[postId]) {
      setCommentsLoading(true);
      try {
        const data = await getPostComments(postId);
        setCommentsByPost(prev => ({ ...prev, [postId]: data }));
      } catch {
        setError('Failed to load comments');
      } finally {
        setCommentsLoading(false);
      }
    }
  }

  async function handleAddComment(e, postId) {
    e.preventDefault();
    if (!newCommentBody.trim()) return;
    const newComment = {
      postId: postId,
      name: currentUser.name || currentUser.username,
      email: currentUser.email,
      body: newCommentBody
    };
    try {
      const created = await createComment(newComment);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), created]
      }));
      setNewCommentBody('');
    } catch {
      setError('Failed to add comment');
    }
  }

  async function handleDeleteComment(postId, commentId) {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].filter(c => c.id !== commentId)
    }));
    try {
      await deleteComment(commentId);
    } catch {
      setError('Failed to delete comment');
      const data = await getPostComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: data }));
    }
  }

  function handleEditCommentStart(comment) {
    setEditingCommentId(comment.id);
    setEditCommentBody(comment.body);
  }

  async function handleEditCommentSave(postId, commentId) {
    if (!editCommentBody.trim()) return;
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].map(c => c.id === commentId ? { ...c, body: editCommentBody } : c)
    }));
    setEditingCommentId(null);
    try {
      await updateComment(commentId, { body: editCommentBody });
    } catch {
      setError('Failed to update comment');
      const data = await getPostComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: data }));
    }
  }

  const filteredPosts = posts.filter(post => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return post.title.toLowerCase().includes(query) || post.id.toString() === query;
  });

  return (
    <div className="albums-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h1>Posts - {currentUser?.name || currentUser?.username}</h1>
        <button className="btn btn--primary" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? 'Cancel' : 'Add New Post +'}
        </button>
      </div>

      {showAddForm && (
        <form className="album-form" onSubmit={handleAddPost} style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
          <h4 className="album-form__title">Create New Post</h4>
          <input
            className="albums-search__input"
            type="text"
            value={newPostTitle}
            onChange={(e) => setNewPostTitle(e.target.value)}
            placeholder="Post Title..."
            style={{ width: '100%', maxWidth: '100%', marginBottom: '10px' }}
          />
          <textarea
            className="albums-search__input"
            value={newPostBody}
            onChange={(e) => setNewPostBody(e.target.value)}
            placeholder="Post Content..."
            style={{ width: '100%', maxWidth: '100%', minHeight: '120px', marginBottom: '10px', resize: 'vertical', fontFamily: 'inherit' }}
          />
          <button type="submit" className="btn btn--primary" style={{ alignSelf: 'flex-start' }}>Publish Post</button>
        </form>
      )}

      <div className="albums-search">
        <input
          className="albums-search__input"
          type="text"
          placeholder="Search by Title or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', maxWidth: '400px' }}
        />
      </div>

      {loading && <p style={{ color: '#9ca3af' }}>Loading posts...</p>}
      {error && <div className="error">{error}</div>}

      <ul className="album-list">
        {filteredPosts.map((post, index) => {
          const isSelected = selectedPostId === post.id;
          const isEditingPost = editingPostId === post.id;
          
          return (
            <li key={post.id} className="album-item" style={{ border: (isSelected || isEditingPost) ? '1px solid #6366f1' : '' }}>
              <div className="album-item__content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ flex: 1, fontWeight: (isSelected || isEditingPost) ? '600' : 'normal', color: (isSelected || isEditingPost) ? '#a5b4fc' : '#e5e7eb' }}>
                    <strong style={{ color: '#818cf8', marginRight: '5px' }}>#{index + 1}</strong>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280', marginRight: '5px' }}>(ID: {post.id})</span>
                    {post.title}
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    <button className="btn btn--primary btn--small" onClick={() => handleSelectPost(post.id)}>
                      {isSelected ? 'Collapse' : 'Expand'}
                    </button>
                    <button className="btn btn--ghost btn--small" onClick={() => handleEditPostStart(post)}>Edit</button>
                    <button className="btn btn--small" style={{ backgroundColor: '#dc2626', color: 'white', border: 'none' }} onClick={() => handleDeletePost(post.id)}>Delete</button>
                  </div>
                </div>

                {isSelected && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2d3748' }}>
                    <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '15px', whiteSpace: 'pre-wrap' }}>{post.body}</p>
                    
                    <button className="btn btn--ghost btn--small" onClick={() => handleToggleComments(post.id)}>
                      {showCommentsFor === post.id ? 'Hide Comments' : 'Show Comments'}
                    </button>

                    {showCommentsFor === post.id && (
                      <div style={{ marginTop: '15px', padding: '15px', background: '#0f172a', borderRadius: '8px' }}>
                        <h4 style={{ margin: '0 0 15px 0' }}>Comments</h4>
                        
                        <form onSubmit={(e) => handleAddComment(e, post.id)} style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '15px' }}>
                          <textarea
                            className="albums-search__input"
                            placeholder="Write a comment..."
                            value={newCommentBody}
                            onChange={(e) => setNewCommentBody(e.target.value)}
                            style={{ width: '100%', maxWidth: '100%', minHeight: '60px', margin: 0, resize: 'vertical', fontFamily: 'inherit' }}
                          />
                          <button type="submit" className="btn btn--primary btn--small" style={{ alignSelf: 'flex-start' }}>Send Comment</button>
                        </form>

                        {commentsLoading && <p style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Loading comments...</p>}
                        
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          {(commentsByPost[post.id] || []).map(comment => {
                            const isMyComment = comment.email === currentUser.email;
                            const isEditingThis = editingCommentId === comment.id;

                            return (
                              <li key={comment.id} style={{ padding: '10px', background: '#1f2937', borderRadius: '6px', fontSize: '0.9rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                                  <strong style={{ color: '#818cf8' }}>{comment.name}</strong>
                                  <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>{comment.email}</span>
                                </div>
                                
                                {isEditingThis ? (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                                    <textarea
                                      className="albums-search__input"
                                      value={editCommentBody}
                                      onChange={(e) => setEditCommentBody(e.target.value)}
                                      style={{ width: '100%', maxWidth: '100%', minHeight: '60px', margin: 0, resize: 'vertical', fontFamily: 'inherit' }}
                                    />
                                    <div style={{ display: 'flex', gap: '5px' }}>
                                      <button className="btn btn--primary btn--small" onClick={() => handleEditCommentSave(post.id, comment.id)}>Save</button>
                                      <button className="btn btn--ghost btn--small" onClick={() => setEditingCommentId(null)}>Cancel</button>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <p style={{ margin: '5px 0', color: '#e5e7eb', whiteSpace: 'pre-wrap' }}>{comment.body}</p>
                                    {isMyComment && (
                                      <div style={{ display: 'flex', gap: '5px', marginTop: '8px' }}>
                                        <button className="btn btn--ghost btn--small" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }} onClick={() => handleEditCommentStart(comment)}>Edit</button>
                                        <button className="btn btn--ghost btn--small" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', color: '#fca5a5' }} onClick={() => handleDeleteComment(post.id, comment.id)}>Delete</button>
                                      </div>
                                    )}
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {isEditingPost && (
                  <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #2d3748' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch' }}>
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Edit Title:</label>
                      <input
                        className="albums-search__input"
                        type="text"
                        value={editPostTitle}
                        onChange={(e) => setEditPostTitle(e.target.value)}
                        style={{ width: '100%', maxWidth: '100%' }}
                      />
                      <label style={{ fontSize: '0.85rem', color: '#9ca3af' }}>Edit Content:</label>
                      <textarea
                        className="albums-search__input"
                        value={editPostBody}
                        onChange={(e) => setEditPostBody(e.target.value)}
                        style={{ width: '100%', maxWidth: '100%', minHeight: '120px', resize: 'vertical', fontFamily: 'inherit' }}
                      />
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <button className="btn btn--primary btn--small" onClick={() => handleEditPostSave(post.id)}>Save Changes</button>
                        <button className="btn btn--ghost btn--small" onClick={() => setEditingPostId(null)}>Cancel</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
      
      <Link to="/home" className="back-link">← Back to Home</Link>
    </div>
  );
}