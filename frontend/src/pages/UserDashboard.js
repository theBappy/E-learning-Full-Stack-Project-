import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { fetchDashboardData, handleEnroll, updateProgress, handleDownload } from "../components/UserDashboardHandler";
import '../styles/UserDashboard.css';  

ChartJS.register(ArcElement, Tooltip, Legend);

const UserDashboard = () => {
  const [availableCourses, setAvailableCourses] = useState([]);
  const [completedCourses, setCompletedCourses] = useState([]);
  const [inProgressCourses, setInProgressCourses] = useState([]);
  const [userCertificates, setUserCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ completedPercentage: 0, inProgressPercentage: 0 });
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData(setAvailableCourses, setCompletedCourses, setInProgressCourses, setStats, setUserCertificates, setLoading, setError);
  }, []);

  const chartData = {
    labels: ["Completed Courses", "In-Progress Courses"],
    datasets: [
      {
        label: "Course Progress",
        data: [stats.completedPercentage, stats.inProgressPercentage],
        backgroundColor: ["#4CAF50", "#FFC107"],
        hoverOffset: 4,
      },
    ],
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="section available-courses">
        <h2>Available Courses</h2>
        <div>
          {availableCourses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p>{course.description}</p>
              <p>Price: ${course.price}</p>
              <p>Instructor: {course.instructor?.name || "N/A"}</p>
              <button onClick={() => handleEnroll(course._id)}>Enroll</button>
            </div>
          ))}
        </div>
      </div>

      <div className="section course-progress">
        <h2>Course Progress Overview</h2>
        <div className="pie-chart">
          <Pie data={chartData} />
        </div>
      </div>

      <div className="section in-progress-courses">
        <h2>In-Progress Courses</h2>
        <div>
          {inProgressCourses.map((course) => (
            <div key={course._id} className="course-card">
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

      <div className="section completed-courses">
        <h2>Completed Courses</h2>
        <div>
          {completedCourses.map((course) => (
            <div key={course._id} className="course-card">
              <h3>{course.courseId?.title || "Untitled Course"}</h3>
              <p>{course.courseId?.description || "No description available"}</p>
              <p>Instructor: {course.courseId?.instructor?.name || "N/A"}</p>
              <p>Completion Date: {new Date(course.updatedAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="section user-certificates">
        <h2>User Certificates</h2>
        <div>
          {userCertificates.length > 0 ? (
            userCertificates.map((certificate) => (
              <div key={certificate._id} className="certificate-card">
                <h3>Certificate for: {certificate.courseId?.title || "Untitled Course"}</h3>
                <p>Issued On: {new Date(certificate.issueDate).toLocaleDateString()}</p>
                <p>Certificate ID: {certificate.certificateId}</p>
                <button onClick={() => navigator.clipboard.writeText(certificate.certificateId)}>
                  Copy Certificate ID
                </button>
                <button onClick={() => handleDownload(certificate._id)}>
                  Download Certificate
                </button>
              </div>
            ))
          ) : (
            <p>No certificates earned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;














































// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { Pie } from "react-chartjs-2";
// import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// ChartJS.register(ArcElement, Tooltip, Legend);

// const UserDashboard = () => {
//   const [availableCourses, setAvailableCourses] = useState([]);
//   const [completedCourses, setCompletedCourses] = useState([]);
//   const [inProgressCourses, setInProgressCourses] = useState([]);
//   const [userCertificates, setUserCertificates] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [stats, setStats] = useState({ completedPercentage: 0, inProgressPercentage: 0 });
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchDashboardData = async () => {
//       try {
//         const [availableRes, segregateRes, certificatesRes] = await Promise.all([
//           axios.get("http://localhost:5000/api/course", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           }),
//           axios.get("http://localhost:5000/api/segregate-course/data", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           }),
//           axios.get("http://localhost:5000/api/certificate/user-certificates", {
//             headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
//           }),
//         ]);

//         setAvailableCourses(availableRes.data.courses || []);
//         setCompletedCourses(segregateRes.data.completedCourses || []);
//         setInProgressCourses(segregateRes.data.inProgressCourses || []);
//         setStats(segregateRes.data.stats || { completedPercentage: 0, inProgressPercentage: 0 });
//         setUserCertificates(certificatesRes.data.certificates || []);
//         setLoading(false);
//       } catch (err) {
//         console.error("Error fetching dashboard data:", err);
//         setError("Failed to fetch dashboard data");
//         setLoading(false);
//       }
//     };

//     fetchDashboardData();
//   }, []);

//   const chartData = {
//     labels: ["Completed Courses", "In-Progress Courses"],
//     datasets: [
//       {
//         label: "Course Progress",
//         data: [stats.completedPercentage, stats.inProgressPercentage],
//         backgroundColor: ["#4CAF50", "#FFC107"],
//         hoverOffset: 4,
//       },
//     ],
//   };

//   const handleEnroll = async (courseId) => {
//     try {
//       await axios.post(
//         "http://localhost:5000/api/enroll/course-enroll",
//         { courseId },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       alert("Enrolled successfully!");
//     } catch (err) {
//       console.error("Enrollment failed:", err);
//       alert("Failed to enroll in course");
//     }
//   };

//   const updateProgress = async (courseId, progress) => {
//     try {
//       await axios.patch(
//         "http://localhost:5000/api/enroll/progress-courses",
//         { courseId, progress },
//         { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
//       );
//       alert("Progress updated successfully!");
//     } catch (err) {
//       console.error("Progress update failed:", err);
//       alert("Failed to update progress");
//     }
//   };

//   const handleDownload = async (certificateId) => {
//     try {
//       const response = await axios.get(
//         `http://localhost:5000/api/certificate/download/${certificateId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//           responseType: "blob",
//         }
//       );

      
//       const url = window.URL.createObjectURL(new Blob([response.data]));
//       const link = document.createElement("a");
//       link.href = url;
//       link.setAttribute("download", `${certificateId}.pdf`); 
//       document.body.appendChild(link);
//       link.click();
//       link.remove(); 

//       alert("Certificate downloaded successfully!");
//     } catch (err) {
//       console.error("Error downloading certificate:", err);
//       alert("Failed to download certificate.");
//     }
//   };

//   if (loading) return <p>Loading dashboard...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div>
//       <h2>Available Courses</h2>
//       <div>
//         {availableCourses.map((course) => (
//           <div key={course._id}>
//             <h3>{course.title}</h3>
//             <p>{course.description}</p>
//             <p>Price: ${course.price}</p>
//             <p>Instructor: {course.instructor?.name || "N/A"}</p>
//             <button onClick={() => handleEnroll(course._id)}>Enroll</button>
//           </div>
//         ))}
//       </div>

//       <div>
//         <h2>Course Progress Overview</h2>
//         <Pie data={chartData} />
//       </div>

//       <h2>In-Progress Courses</h2>
//       <div>
//         {inProgressCourses.map((course) => (
//           <div key={course._id}>
//             <h3>{course.courseId?.title || "Untitled Course"}</h3>
//             <p>{course.courseId?.description || "No description available"}</p>
//             <p>Instructor: {course.courseId?.instructor?.name || "N/A"}</p>
//             <p>Progress: {course.progress}%</p>
//             <button
//               onClick={() =>
//                 updateProgress(course.courseId._id, prompt("Enter new progress:"))
//               }
//             >
//               Update Progress
//             </button>
//           </div>
//         ))}
//       </div>

//       <h2>Completed Courses</h2>
//       <div>
//         {completedCourses.map((course) => (
//           <div key={course._id}>
//             <h3>{course.courseId?.title || "Untitled Course"}</h3>
//             <p>{course.courseId?.description || "No description available"}</p>
//             <p>Instructor: {course.courseId?.instructor?.name || "N/A"}</p>
//             <p>Completion Date: {new Date(course.updatedAt).toLocaleDateString()}</p>
//           </div>
//         ))}
//       </div>

//       <h2>User Certificates</h2>
//       <div>
//         {userCertificates.length > 0 ? (
//           userCertificates.map((certificate) => (
//             <div key={certificate._id}>
//               <h3>Certificate for: {certificate.courseId?.title || "Untitled Course"}</h3>
//               <p>Issued On: {new Date(certificate.issueDate).toLocaleDateString()}</p>
//               <p>Certificate ID: {certificate.certificateId}</p>
//               <button onClick={() => navigator.clipboard.writeText(certificate.certificateId)}>
//                 Copy Certificate ID
//               </button>
//               <button onClick={() => handleDownload(certificate._id)}>
//                 Download Certificate
//               </button>
//             </div>
//           ))
//         ) : (
//           <p>No certificates earned yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;

