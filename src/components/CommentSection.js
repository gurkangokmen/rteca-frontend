import React, { useState, useEffect } from 'react';
import './CommentSection.css';

function CommentSection({ postId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API}/comments/${postId}`)
      .then(response => response.json())
      .then(data => setComments(data.reverse()))
      .catch(error => console.error('Error fetching comments:', error));
  }, [postId]);

  const handleAddComment = () => {
    fetch(`${process.env.REACT_APP_API}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        post_id: postId,
        content: newComment,
        date : new Date().toLocaleString('tr-TR', {
          day: '2-digit',
          month: 'short',
          year: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }).replace(',', ''),
        user_id: '550e8400-e29b-41d4-a716-446655440000',
      }),
    })
      .then(response => response.json())
      .then(data => {
        const newCommentData = {
          id: data.id,
          content: data.content,
          date: data.date,
          post_id: data.post_id,
          user_id: data.user_id,
        };
        setComments([...comments, newCommentData]);
        setNewComment('');
      })
      .catch(error => console.error('Error adding comment:', error));
  };

  return (
    <div className="comment-section">
      <div className="comments">
        {comments.map(comment => (
          <div key={comment.id} className="comment">
            <p>{comment.content}</p>
          </div>
        ))}
      </div>
      <div className="add-comment">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
        />
        <button onClick={handleAddComment}>Post Comment</button>
      </div>
    </div>
  );
}

export default CommentSection;