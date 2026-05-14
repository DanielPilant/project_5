const API_URL = "http://localhost:3000";

export async function getUsers() {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
}

export async function getUserByUsername(username) {
  const res = await fetch(
    `${API_URL}/users?username=${encodeURIComponent(username)}`,
  );
  if (!res.ok) throw new Error("Failed to fetch user");
  const users = await res.json();
  return users[0] || null;
}

export async function createUser(user) {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error("Failed to create user");
  return res.json();
}

export async function getUserTodos(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/todos`);
  if (!res.ok) throw new Error("Failed to fetch todos");
  return res.json();
}

export async function updateTodo(todoId, patch) {
  const res = await fetch(`${API_URL}/todos/${todoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update todo");
  return res.json();
}

export async function createTodo(todo) {
  const res = await fetch(`${API_URL}/todos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(todo),
  });
  if (!res.ok) throw new Error("Failed to create todo");
  return res.json();
}

export async function deleteTodo(todoId) {
  const res = await fetch(`${API_URL}/todos/${todoId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete todo");
  return res.json();
}

export async function getUserPosts(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/posts`);
  if (!res.ok) throw new Error("Failed to fetch posts");
  return res.json();
}

export async function getPostComments(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`);
  if (!res.ok) throw new Error("Failed to fetch comments");
  return res.json();
}

export async function createPost(post) {
  const res = await fetch(`${API_URL}/posts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
  if (!res.ok) throw new Error("Failed to create post");
  return res.json();
}

export async function deletePost(postId) {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete post");
  return res.json();
}

export async function updatePost(postId, patch) {
  const res = await fetch(`${API_URL}/posts/${postId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update post");
  return res.json();
}

export async function createComment(comment) {
  const res = await fetch(`${API_URL}/comments`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!res.ok) throw new Error("Failed to create comment");
  return res.json();
}

export async function deleteComment(commentId) {
  const res = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete comment");
  return res.json();
}

export async function updateComment(commentId, patch) {
  const res = await fetch(`${API_URL}/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error("Failed to update comment");
  return res.json();
}

export async function getUserAlbums(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/albums`);
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function createAlbum(title, userId) {
  const res = await fetch(`${API_URL}/albums`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: title,
      userId: Number(userId),
    }),
  });
  if (!res.ok) throw new Error("Failed to create album");
  return res.json();
}

export async function getAlbumPhotos(albumId, page = 1) {
  const res = await fetch(
    `${API_URL}/albums/${albumId}/photos?_page=${page}&_limit=10`,
  );
  if (!res.ok) throw new Error("Failed to load photos");
  return res.json();
}

export async function addPhoto(photoData) {
  const res = await fetch(`${API_URL}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photoData),
  });
  if (!res.ok) throw new Error("Failed to add photo");
  return res.json();
}

export async function updatePhoto(photoId, data) {
  const res = await fetch(`${API_URL}/photos/${photoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update photo");
  return res.json();
}

export async function deletePhoto(photoId) {
  const res = await fetch(`${API_URL}/photos/${photoId}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete photo");
}
