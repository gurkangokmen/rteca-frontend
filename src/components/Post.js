import React, { useState, useEffect, useRef } from 'react';
import './Post.css';



function Post({ content, postId, userId, onDelete }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsMenuRef = useRef(null);

  const handleLike = () => {
    if (isLiked) {
      removeLike();
    } else {
      fetch(`${process.env.REACT_APP_API}/likes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          post_id: postId,
          user_id: userId,
        }),
      })
        .then(response => response.json())
        .then(() => {
          fetch(`${process.env.REACT_APP_API}/likes/${postId}`)
            .then(response => response.json())
            .then(data => setLikes(data))
            .catch(error => console.error('Error fetching updated likes:', error));
          setIsLiked(true);
        })
        .catch(error => console.error('Error liking post:', error));
    }
  };

  const removeLike = () => {
    fetch(`${process.env.REACT_APP_API}/likes/${postId}/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => response.json())
      .then(() => {
        fetch(`${process.env.REACT_APP_API}/likes/${postId}`)
          .then(response => response.json())
          .then(data => setLikes(data))
          .catch(error => console.error('Error fetching updated likes:', error));
        setIsLiked(false);
      })
      .catch(error => console.error('Error unliking post:', error));
  };

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/likes/${postId}`)
      .then(response => response.json())
      .then(data => setLikes(data))
      .catch(error => console.error('Error fetching likes:', error));

    fetch(`${process.env.REACT_APP_API}/likes/${postId}/${userId}`)
      .then(response => response.json())
      .then(data => setIsLiked(data))
      .catch(error => console.error('Error checking if post is liked:', error));
  }, [postId, userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionsClick = () => {
    setShowOptions(!showOptions);
  };

  const handleUpdate = () => {
    // Implement update functionality
    console.log('Update post:', postId);
  };

  const handleDelete = () => {
    fetch(`${process.env.REACT_APP_API}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (response.ok) {
          onDelete(postId);
        } else {
          console.error('Error deleting post:', response.statusText);
        }
      })
      .catch(error => console.error('Error deleting post:', error));
  };

  return (
    <div className="post">
      <div className="post-header">
        <button className="options-button" onClick={handleOptionsClick}>⋮</button>
        {showOptions && (
          <div className="options-menu" ref={optionsMenuRef}>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      <p>{content}</p>
      <div className="post-footer">
        <button className="like-button" onClick={handleLike}>
          {isLiked ? 'Unlike' : 'Like'}
        </button>
        <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
      </div>
    </div>
  );
}

export default Post;