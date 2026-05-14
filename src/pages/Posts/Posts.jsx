import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getUserPosts, createPost, deletePost, updatePost, 
  getPostComments, createComment, deleteComment, updateComment 
} from '../../api.js';
import { UserContext } from '../../contexts/UserContext.jsx';
import AddPostForm from './components/AddPostForm';
import PostSearch from './components/PostSearch';
import PostList from './components/PostList';
import '../Albums/albums.css';

export default function Posts() {
  const { userId } = useParams();
  const { currentUser } = useContext(UserContext);

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const [selectedPostId, setSelectedPostId] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostBody, setEditPostBody] = useState('');

  const [showCommentsFor, setShowCommentsFor] = useState(null);
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentsLoading, setCommentsLoading] = useState(false);

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

  const handleAddPost = async (postData) => {
    const newPost = {
      userId: Number(userId),
      title: postData.title,
      body: postData.body
    };
    try {
      const created = await createPost(newPost);
      setPosts(prev => [...prev, created]);
      setShowAddForm(false);
    } catch {
      setError('Failed to add post');
    }
  };

  const handleDeletePost = async (id) => {
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
  };

  const handleSelectPost = (id) => {
    if (selectedPostId === id) {
      setSelectedPostId(null);
    } else {
      setSelectedPostId(id);
      setEditingPostId(null);
      setShowCommentsFor(null);
    }
  };

  const handleEditPostStart = (post) => {
    setEditingPostId(post.id);
    setSelectedPostId(null);
    setShowCommentsFor(null);
    setEditPostTitle(post.title);
    setEditPostBody(post.body);
  };

  const handleEditPostSave = async (id) => {
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
  };

  const handleEditPostCancel = () => {
    setEditingPostId(null);
  };

  const handleToggleComments = async (postId) => {
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
  };

  const handleAddComment = async (postId, body) => {
    const newComment = {
      postId: postId,
      name: currentUser.name || currentUser.username,
      email: currentUser.email,
      body: body
    };
    try {
      const created = await createComment(newComment);
      setCommentsByPost(prev => ({
        ...prev,
        [postId]: [...(prev[postId] || []), created]
      }));
    } catch {
      setError('Failed to add comment');
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
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
  };

  const handleEditComment = async (postId, commentId, body) => {
    setCommentsByPost(prev => ({
      ...prev,
      [postId]: prev[postId].map(c => c.id === commentId ? { ...c, body: body } : c)
    }));
    try {
      await updateComment(commentId, { body: body });
    } catch {
      setError('Failed to update comment');
      const data = await getPostComments(postId);
      setCommentsByPost(prev => ({ ...prev, [postId]: data }));
    }
  };

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
        <AddPostForm 
          onAdd={handleAddPost} 
          onCancel={() => setShowAddForm(false)} 
        />
      )}

      <PostSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
      />

      {loading && <p style={{ color: '#9ca3af' }}>Loading posts...</p>}
      {error && <div className="error">{error}</div>}

      <PostList 
        posts={filteredPosts}
        currentUser={currentUser}
        selectedPostId={selectedPostId}
        editingPostId={editingPostId}
        onSelect={handleSelectPost}
        onEditStart={handleEditPostStart}
        onEditSave={handleEditPostSave}
        onEditCancel={handleEditPostCancel}
        onDelete={handleDeletePost}
        editTitle={editPostTitle}
        setEditTitle={setEditPostTitle}
        editBody={editPostBody}
        setEditBody={setEditPostBody}
        showCommentsFor={showCommentsFor}
        onToggleComments={handleToggleComments}
        commentsByPost={commentsByPost}
        commentsLoading={commentsLoading}
        onAddComment={handleAddComment}
        onDeleteComment={handleDeleteComment}
        onEditComment={handleEditComment}
      />
      
      {!loading && filteredPosts.length === 0 && (
        <div className="albums-empty">No posts matched your search.</div>
      )}
      
      <Link to="/home" className="back-link">← Back to Home</Link>
    </div>
  );
}