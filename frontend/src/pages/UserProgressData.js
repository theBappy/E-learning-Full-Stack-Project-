import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SegregatedCourseData = () => {
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/segregate-course/data', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCompletedCourses(response.data.completedCourses);
        setInProgressCourses(response.data.inProgressCourses);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <h2>Completed Courses</h2>
        {completedCourses.map(course => (
          <div key={course.courseId._id}>
            <p>{course.courseId.title}</p>
          </div>
        ))}
      </div>

      <div>
        <h2>In Progress</h2>
        {inProgressCourses.map(course => (
          <div key={course.courseId._id}>
            <p>{course.courseId.title}</p>
            <progress value={course.progress} max="100">{course.progress}%</progress>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SegregatedCourseData;
