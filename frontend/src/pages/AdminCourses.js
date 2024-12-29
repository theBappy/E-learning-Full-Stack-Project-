import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminCourses = () => {
  const [courses, setCourses] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [formVisible, setFormVisible] = useState(false); 
  const [currentCourse, setCurrentCourse] = useState(null); 

  // Fetch Courses
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
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    }
  };

  // Handle Delete Course
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
      <button onClick={() => { setFormVisible(true); setCurrentCourse(null); }}>
        Add Course
      </button>
      {formVisible && (
        <div>
          <h3>{currentCourse ? 'Edit Course' : 'Add New Course'}</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const formData = {
                title: e.target.title.value,
                description: e.target.description.value,
                price: e.target.price.value,
                media: e.target.media.value,
              };
              handleFormSubmit(formData);
            }}
          >
            <input
              type="text"
              name="title"
              defaultValue={currentCourse?.title || ''}
              placeholder="Course Title"
              required
            />
            <textarea
              name="description"
              defaultValue={currentCourse?.description || ''}
              placeholder="Course Description"
              required
            ></textarea>
            <input
              type="number"
              name="price"
              defaultValue={currentCourse?.price || ''}
              placeholder="Course Price"
              required
            />
            <input
              type="url"
              name="media"
              defaultValue={currentCourse?.media || ''}
              placeholder="Media URL"
              required
            />
            <button type="submit">
              {currentCourse ? 'Update Course' : 'Add Course'}
            </button>
            <button type="button" onClick={() => setFormVisible(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}

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
                  <button onClick={() => { setFormVisible(true); setCurrentCourse(course); }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(course._id)}>Delete</button>
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
