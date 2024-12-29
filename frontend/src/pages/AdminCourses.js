import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/course', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setCourses(response.data.courses || []); 
        setLoading(false);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to fetch courses');
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle Form Submit for Add/Edit
  const handleFormSubmit = async (courseData) => {
    try {
      if (currentCourse) {
        // Update Course
        await axios.put(
          `http://localhost:5000/api/course/update-course/${currentCourse._id}`,
          courseData,
          { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        );
        alert('Course updated successfully');
      } else {
        // Add New Course
        await axios.post('http://localhost:5000/api/course/create-course', courseData, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Course added successfully');
      }
      setFormVisible(false);
      setCurrentCourse(null);
      fetchCourses(); // Refresh course list
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await axios.delete(`http://localhost:5000/api/course/delete-course/${courseId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        alert('Course deleted successfully');
        setCourses((prevCourses) => prevCourses.filter((course) => course._id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
        alert('Failed to delete course');
      }
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Manage Courses</h2>
      {courses.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Instructor</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course._id}>
                <td>{course.title}</td>
                <td>{course.description}</td>
                <td>{course.instructor?.name || 'N/A'}</td>
                <td>{course.status}</td>
                <td>
                  <button onClick={() => handleDelete(course._id)}>Delete</button>
                  {/* Add Edit Button */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses found.</p>
      )}
    </div>
  );
};

export default AdminCourses;
