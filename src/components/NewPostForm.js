import React, { useState } from 'react';
import './NewPostForm.css';

function NewPostForm({ onPostCreated }) {
  const [newPostContent, setNewPostContent] = useState('');

  const handleNewPostChange = (event) => {
    setNewPostContent(event.target.value);
  };

  const handleNewPostSubmit = (event) => {
    event.preventDefault();
    const newPost = {
      content: newPostContent,
      user_id: '550e8400-e29b-41d4-a716-446655440000', // Updated user_id
    };

    fetch(`${process.env.REACT_APP_API}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPost),
    })
      .then(response => response.json())
      .then(data => {
        onPostCreated(data);
        setNewPostContent('');
      })
      .catch(error => console.error('Error creating post:', error));
  };

  return (
    <form onSubmit={handleNewPostSubmit} className="new-post-form">
      <textarea
        value={newPostContent}
        onChange={handleNewPostChange}
        placeholder="What's on your mind?"
        required
      />
      <button type="submit">Post</button>
    </form>
  );
}

export default NewPostForm;