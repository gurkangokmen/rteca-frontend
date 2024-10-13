import React, { useState, useEffect, useRef } from 'react';
import './Post.css';
import CommentSection from './CommentSection';

function Post({ content, postId, userId, onDelete, onUpdate, date }) {
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(content);
  const [showComments, setShowComments] = useState(false);
  const optionsMenuRef = useRef(null);

  useEffect(() => {
    setUpdatedContent(content);
  }, [content]);

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
    setIsEditing(true);
  };

  const handleUpdateSubmit = () => {
    fetch(`${process.env.REACT_APP_API}/posts`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: updatedContent,
        post_id: postId,
        date: new Date().toLocaleString('tr-TR', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).replace(',', ''),
      }),
    })
      .then(response => response.json())
      .then(data => {
        setIsEditing(false);
        console.log('Updated post:', data);
        onUpdate(data); // Call the onUpdate function passed as a prop
      })
      .catch(error => console.error('Error updating post:', error));
  };

  const handleDelete = () => {
    const confirmed = window.confirm('Do you really want to delete this post?');
    if (confirmed) {
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
    }
  };

  const toggleComments = () => {
    setShowComments(!showComments);
  };

  const handleShare = () => {
    const postUrl = `http://localhost:3000/posts/${postId}`;
    navigator.clipboard.writeText(postUrl)
      .then(() => {
        alert('Post URL copied to clipboard!');
      })
      .catch(error => console.error('Error copying URL:', error));
  };

  return (
    <div className="post">
      <div className="post-header">
        <button className="options-button" onClick={handleOptionsClick}>⋮</button>
        {showOptions && (
          <div className="options-menu" ref={optionsMenuRef}>
            <button onClick={handleShare}>Share</button>
            <button onClick={handleUpdate}>Update</button>
            <button onClick={handleDelete}>Delete</button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div>
          <textarea
            value={updatedContent}
            onChange={(e) => setUpdatedContent(e.target.value)}
          />
          <div>
            <button onClick={handleUpdateSubmit}>Save</button>
            <button onClick={() => setIsEditing(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <p>{content}</p>
      )}
      <div className="post-footer">
        <button className="like-button" onClick={handleLike}>
          {isLiked ? '👎 Unlike' : '👍 Like'}
        </button>
        <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
        <button className="comment-button" onClick={toggleComments}>
          {showComments ? '📖' : '📘'}
        </button>
        <div className="post-date">{date}</div>
      </div>
      {showComments && <CommentSection postId={postId} />}
    </div>
  );
}

export default Post;