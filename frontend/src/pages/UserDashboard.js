import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [courses, setCourses] = useState([]); // Available courses
  const [enrolledCourses, setEnrolledCourses] = useState([]); // User's enrolled courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch available courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/course", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setCourses(response.data.courses);
      } catch (err) {
        setError("Failed to fetch available courses");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Fetch enrolled courses
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/enroll/enrolled-courses", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setEnrolledCourses(response.data.courses);
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/enroll/course-enroll",
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Enrolled successfully!");

      // Refresh the enrolled courses list
      const response = await axios.get("http://localhost:5000/api/enroll/enrolled-courses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEnrolledCourses(response.data.courses);
    } catch (err) {
      console.error("Failed to enroll in course:", err);
      alert("Failed to enroll in course");
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Available Courses</h2>
      <div>
        {courses.length > 0 ? (
          courses.map((course) => (
            <div key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              <p>Instructor: {course.instructor?.name || "N/A"}</p>
              <button onClick={() => handleEnroll(course._id)}>Enroll</button>
            </div>
          ))
        ) : (
          <p>No available courses found.</p>
        )}
      </div>

      <h2>Enrolled Courses</h2>
      <div>
        {enrolledCourses.length > 0 ? (
          enrolledCourses.map((course) => (
            <div key={course._id}>
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              <p>Instructor: {course.instructor?.name || "N/A"}</p>
            </div>
          ))
        ) : (
          <p>You are not enrolled in any courses yet.</p>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

