import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PostDetail.css';
import CommentSection from './CommentSection';

function PostDetail() {
    const [likes, setLikes] = useState(0);
    const [isLiked, setIsLiked] = useState(false);
    const { postid } = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState('');
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const optionsMenuRef = useRef(null);
    const [showOptions, setShowOptions] = useState(false);
    const [deletionMessage, setDeletionMessage] = useState(''); 
    const userId = '550e8400-e29b-41d4-a716-446655440000';
    const navigate = useNavigate(); 

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

    const toggleComments = () => {
        setShowComments(!showComments);
    };

    const toggleOptions = () => {
        setShowOptions(!showOptions);
    };

    const handleSave = () => {
        fetch(`${process.env.REACT_APP_API}/posts`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              content: updatedContent,
              post_id: postid,
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
              setPost({ ...post, content: updatedContent }); // Update the post content locally
              console.log('Updated post:', data);
            })
            .catch(error => console.error('Error updating post:', error));
    };

    const handleCancel = () => {
        setIsEditing(false);
        setUpdatedContent(post.content); // Revert to original content
    };

    const handleDelete = () => {
        const confirmed = window.confirm('Do you really want to delete this post?');
        if (confirmed) {
            fetch(`${process.env.REACT_APP_API}/posts/${postid}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
                .then(response => {
                    if (response.ok) {
                        setDeletionMessage('Post deleted successfully.'); // Set deletion message
                        setPost(null); // Clear the post data
                    } else {
                        console.error('Error deleting post:', response.statusText);
                    }
                })
                .catch(error => console.error('Error deleting post:', error));
        }
    };

    useEffect(() => {
        fetch(`http://localhost:8080/posts/${postid}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                setPost(data);
                setUpdatedContent(data.content); // Initialize updatedContent with post content
            })
            .catch(error => {
                setError(error);
                navigate('/notfound'); // Redirect to notfound page if post fetch fails
            });
    }, [postid, navigate]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API}/likes/${postid}`)
            .then(response => response.json())
            .then(data => setLikes(data))
            .catch(error => console.error('Error fetching likes:', error));

        fetch(`${process.env.REACT_APP_API}/likes/${postid}/${userId}`)
            .then(response => response.json())
            .then(data => setIsLiked(data))
            .catch(error => console.error('Error checking if post is liked:', error));
    }, [postid, userId]);

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
                    post_id: postid,
                    user_id: userId,
                }),
            })
                .then(response => response.json())
                .then(() => {
                    fetch(`${process.env.REACT_APP_API}/likes/${postid}`)
                        .then(response => response.json())
                        .then(data => setLikes(data))
                        .catch(error => console.error('Error fetching updated likes:', error));
                    setIsLiked(true);
                })
                .catch(error => console.error('Error liking post:', error));
        }
    };

    const removeLike = () => {
        fetch(`${process.env.REACT_APP_API}/likes/${postid}/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(() => {
                fetch(`${process.env.REACT_APP_API}/likes/${postid}`)
                    .then(response => response.json())
                    .then(data => setLikes(data))
                    .catch(error => console.error('Error fetching updated likes:', error));
                setIsLiked(false);
            })
            .catch(error => console.error('Error unliking post:', error));
    };

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (deletionMessage) {
        return <div>{deletionMessage}</div>;
    }

    if (!post) {
        return <div>Loading...</div>;
    }

    return (
        <div className="post-container">
            <div>
                {isEditing ? (
                    <div>
                        <textarea
                            type="text"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                        />
                        <button onClick={handleSave}>Save</button>
                        <button onClick={handleCancel}>Cancel</button>
                    </div>
                ) : (
                    <h1 className="post-heading">{post.content}</h1>
                )}
                <div className="options-container">
                    <button className="options-button" onClick={toggleOptions}>⋮</button>
                    {showOptions && (
                        <div className="options-menu" ref={optionsMenuRef}>
                            <button onClick={() => setIsEditing(true)}>Update</button>
                            <button onClick={handleDelete}>Delete</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="post-details">
                <br /> <br />
                {post.date}
                <br /> <br />
            </div>

            <button className="like-button" onClick={handleLike}>
                {isLiked ? '👎 Unlike' : '👍 Like'}
            </button>
            <span>{likes} {likes === 1 ? 'Like' : 'Likes'}</span>

            <button className="comment-button" onClick={toggleComments}>
                {showComments ? '📖' : '📘'}
            </button>

            {showComments && <CommentSection postId={postid} />}
        </div>
    );
}

export default PostDetail;