import axios from "axios";

const fetchDashboardData = async (setAvailableCourses, setCompletedCourses, setInProgressCourses, setStats, setUserCertificates, setLoading, setError) => {
  try {
    const [availableRes, segregateRes, certificatesRes] = await Promise.all([
      axios.get("http://localhost:5000/api/course", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get("http://localhost:5000/api/segregate-course/data", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
      axios.get("http://localhost:5000/api/certificate/user-certificates", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }),
    ]);

    setAvailableCourses(availableRes.data.courses || []);
    setCompletedCourses(segregateRes.data.completedCourses || []);
    setInProgressCourses(segregateRes.data.inProgressCourses || []);
    setStats(segregateRes.data.stats || { completedPercentage: 0, inProgressPercentage: 0 });
    setUserCertificates(certificatesRes.data.certificates || []);
    setLoading(false);
  } catch (err) {
    console.error("Error fetching dashboard data:", err);
    setError("Failed to fetch dashboard data");
    setLoading(false);
  }
};

const handleEnroll = async (courseId) => {
  try {
    await axios.post(
      "http://localhost:5000/api/enroll/course-enroll",
      { courseId },
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    alert("Enrolled successfully!");
  } catch (err) {
    console.error("Enrollment failed:", err);
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
    console.error("Progress update failed:", err);
    alert("Failed to update progress");
  }
};

const handleDownload = async (certificateId) => {
  try {
    const response = await axios.get(
      `http://localhost:5000/api/certificate/download/${certificateId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        responseType: "blob",
      }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${certificateId}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("Certificate downloaded successfully!");
  } catch (err) {
    console.error("Error downloading certificate:", err);
    alert("Failed to download certificate.");
  }
};

export { fetchDashboardData, handleEnroll, updateProgress, handleDownload };
