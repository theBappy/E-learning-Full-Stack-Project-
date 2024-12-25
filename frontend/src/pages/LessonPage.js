import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LessonPage = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [lesson, setLesson] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`/api/lesson/enrolled/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setLesson(response.data);
            } catch (err) {
                setError('Failed to load lesson. Make sure you are enrolled.');
            }
        };

        fetchLesson();
    }, [id]);

    if (error) return <div className="error">{error}</div>;

    return (
        <div className="lesson-page">
            {lesson ? (
                <>
                    <h1>{lesson.title}</h1>
                    <p>{lesson.description}</p>
                    <video
                        controls
                        src={lesson.videoUrl} // Video URL fetched from the backend
                        className="video-player"
                    />
                    <button onClick={() => navigate(-1)} className="back-btn">
                        Back to Course
                    </button>
                </>
            ) : (
                <p>Loading lesson...</p>
            )}
        </div>
    );
};

export default LessonPage;
