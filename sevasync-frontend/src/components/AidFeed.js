import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AidFeed = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [error, setError] = useState(null);

    const fetchPosts = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/posts');
            setPosts(res.data);
            setError(null);
        } catch (err) {
            setError("Unable to connect to server");
        }
    };

    useEffect(() => {
        fetchPosts();
        const interval = setInterval(fetchPosts, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="feed-container">
            <h2>Community Activity</h2>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {posts.map(post => (
                <div
                    key={post._id}
                    onClick={() => setSelectedPost(post)}
                    style={cardStyle(post)}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontWeight: 'bold', color: post.isEmergency ? 'red' : '#333' }}>
                            {post.isEmergency ? '🚨 EMERGENCY' : post.category}
                        </span>
                        <small>{new Date(post.createdAt).toLocaleString()}</small>
                    </div>

                    <h3>{post.title}</h3>
                    <p>{post.description.slice(0, 80)}...</p>
                </div>
            ))}

            {/* ✅ MODAL */}
            {selectedPost && (
                <div style={overlayStyle}>

                    <div style={modalStyle}>

                        {/* 🔴 FIXED CLOSE BUTTON */}
                        <button
                            onClick={() => setSelectedPost(null)}
                            style={closeButtonStyle}
                        >
                            ×
                        </button>

                        <h2>{selectedPost.title}</h2>

                        <p style={{ fontWeight: 'bold', marginTop: '5px' }}>
                            {selectedPost.isEmergency ? '🚨 EMERGENCY' : selectedPost.category}
                        </p>

                        <p style={{ marginTop: '10px' }}>
                            {selectedPost.description}
                        </p>

                        {selectedPost.image && (
                            <img
                                src={`http://localhost:5000/uploads/posts/${selectedPost.image}`}
                                alt="Evidence"
                                style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
                            />
                        )}

                        <p style={{ marginTop: '10px' }}>
                            📅 {new Date(selectedPost.createdAt).toLocaleString()}
                        </p>

                        <p>
                            Status: <b>{selectedPost.status}</b>
                        </p>

                    </div>
                </div>
            )}
        </div>
    );
};

/* 🔹 CARD STYLE */
const cardStyle = (post) => ({
    border: post.isEmergency ? '2px solid red' : '1px solid #ddd',
    padding: '15px',
    borderRadius: '10px',
    marginBottom: '15px',
    background: post.isEmergency ? '#fff5f5' : 'white',
    cursor: 'pointer',
    transition: '0.2s',
});

/* 🔹 OVERLAY */
const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999
};

/* 🔹 MODAL BOX */
const modalStyle = {
    background: 'white',
    padding: '25px',
    borderRadius: '12px',
    width: '90%',
    maxWidth: '520px',
    position: 'relative',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
};

/* 🔴 FIXED CLOSE BUTTON */
const closeButtonStyle = {
    position: 'absolute',
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#e5e7eb',
    color: '#111',
    fontSize: '18px',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
};

export default AidFeed;