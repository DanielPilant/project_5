import PostItem from './PostItem';

export default function PostList({ 
  posts, currentUser,
  selectedPostId, editingPostId, 
  onSelect, onEditStart, onEditSave, onEditCancel, onDelete,
  editTitle, setEditTitle, editBody, setEditBody,
  showCommentsFor, onToggleComments, commentsByPost, commentsLoading,
  onAddComment, onDeleteComment, onEditComment
}) {
  return (
    <ul className="album-list">
      {posts.map((post, index) => (
        <PostItem 
          key={post.id}
          post={post}
          index={index}
          currentUser={currentUser}
          isSelected={selectedPostId === post.id}
          isEditing={editingPostId === post.id}
          onSelect={onSelect}
          onEditStart={onEditStart}
          onEditSave={onEditSave}
          onEditCancel={onEditCancel}
          onDelete={onDelete}
          editTitle={editTitle}
          setEditTitle={setEditTitle}
          editBody={editBody}
          setEditBody={setEditBody}
          showComments={showCommentsFor === post.id}
          onToggleComments={onToggleComments}
          comments={commentsByPost[post.id]}
          commentsLoading={commentsLoading}
          onAddComment={onAddComment}
          onDeleteComment={onDeleteComment}
          onEditComment={onEditComment}
        />
      ))}
    </ul>
  );
}