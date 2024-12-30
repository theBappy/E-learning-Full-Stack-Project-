import React, { useState, useEffect } from "react";
import axios from "axios";

const UserDashboard = () => {
  const [courses, setCourses] = useState([]); // Available courses
  const [enrolledCourses, setEnrolledCourses] = useState([]); // Enrolled courses
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const [availableRes, enrolledRes] = await Promise.all([
          axios.get("http://localhost:5000/api/course", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
          axios.get("http://localhost:5000/api/enroll/enrolled-courses", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          }),
        ]);

        setCourses(availableRes.data.courses);
        setEnrolledCourses(enrolledRes.data.courses);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch courses");
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/enroll/course-enroll",
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Enrolled successfully!");
    } catch (err) {
      alert("Failed to enroll in course");
    }
  };

  const updateProgress = async (courseId, progress) => {
    try {
      await axios.patch(
        "http://localhost:5000/api/enroll/progress-courses",
        { courseId, progress },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      alert("Progress updated successfully!");
    } catch (err) {
      alert("Failed to update progress");
    }
  };

  if (loading) return <p>Loading courses...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Available Courses</h2>
      <div>
        {courses.map((course) => (
          <div key={course._id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <p>Price: ${course.price}</p>
            <p>Instructor: {course.instructor?.name || "N/A"}</p>
            <button onClick={() => handleEnroll(course._id)}>Enroll</button>
          </div>
        ))}
      </div>

      <h2>Enrolled Courses</h2>
      <div>
        {enrolledCourses.map((course) => (
          <div key={course._id}>
            <h3>{course.courseId?.title || "Untitled Course"}</h3>
            <p>{course.courseId?.description || "No description available"}</p>
            <p>Instructor: {course.courseId?.instructor?.name || "N/A"}</p>
            <p>Progress: {course.progress}%</p>
            <button
              onClick={() =>
                updateProgress(course.courseId._id, prompt("Enter new progress:"))
              }
            >
              Update Progress
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;


