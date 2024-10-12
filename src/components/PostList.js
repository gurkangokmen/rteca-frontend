import React, { useState, useEffect } from 'react';
import Post from './Post';
import NewPostForm from './NewPostForm';
import './PostList.css';

function PostList() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/posts`)
      .then(response => response.json())
      .then(data => setPosts(data.reverse()))
      .catch(error => console.error('Error fetching posts:', error));
  }, []);

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleUpdatePost = (updatedPost) => {
    setPosts(posts.map(post => post.id === updatedPost.id ? updatedPost : post));
  };

  const handlePostCreated = (newPost) => {
    if (newPost) {
      setPosts((prevPosts) => [newPost, ...prevPosts]);
    } else {
      console.error('Invalid post data:', newPost);
    }
  };

  return (
    <div className="post-list">
      <NewPostForm onPostCreated={handlePostCreated} />
      {posts.map(post => (
        <Post
          key={post.id}
          postId={post.id}
          content={post.content}
          userId={post.user_id}
          date={post.date}
          onDelete={handleDeletePost}
          onUpdate={handleUpdatePost}
        />
      ))}
    </div>
  );
}

export default PostList;