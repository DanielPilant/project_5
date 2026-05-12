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

export async function createAlbum(title, userId) {
  const response = await fetch(`${API_URL}/albums`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      userId: Number(userId),
    }),
  });

  if (!response.ok) throw new Error("Failed to create album");

  return await response.json();
}

export async function getUserAlbums(userId) {
  const res = await fetch(`${API_URL}/users/${userId}/albums`);
  if (!res.ok) throw new Error("Failed to fetch albums");
  return res.json();
}

export async function getAlbumPhotos(albumId, page = 1) {
  const response = await fetch(
    `${API_URL}/albums/${albumId}/photos?_page=${page}&_limit=10`,
  );
  if (!response.ok) throw new Error("Failed to load photos");
  return await response.json();
}

export async function deletePhoto(photoId) {
  const response = await fetch(`${API_URL}/photos/${photoId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete photo");
}

export async function updatePhoto(photoId, data) {
  const response = await fetch(`${API_URL}/photos/${photoId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update photo");
  return await response.json();
}

export async function addPhoto(photoData) {
  const response = await fetch(`${API_URL}/photos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(photoData),
  });
  if (!response.ok) throw new Error("Failed to add photo");
  return await response.json();
}
