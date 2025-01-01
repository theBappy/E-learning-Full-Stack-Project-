import React, { useState } from "react";
import axios from "axios";

const CertificateValidation = () => {
  const [certificateId, setCertificateId] = useState("");
  const [validationResult, setValidationResult] = useState(null);
  const [error, setError] = useState("");

  const handleValidate = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/certificate/validate/${certificateId}`,
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      setValidationResult(response.data.certificate);
      setError("");
    } catch (err) {
      setError("Invalid certificate ID or certificate not found");
      setValidationResult(null);
    }
  };

  return (
    <div>
      <h2>Validate Certificate</h2>
      <input
        type="text"
        placeholder="Enter Certificate ID"
        value={certificateId}
        onChange={(e) => setCertificateId(e.target.value)}
      />
      <button onClick={handleValidate}>Validate</button>

      {validationResult && (
        <div>
          <h3>Certificate Details</h3>
          <p>Certificate ID: {validationResult.certificateId}</p>
          <p>User Name: {validationResult.userName}</p>
          <p>Email: {validationResult.userEmail}</p>
          <p>Course: {validationResult.courseTitle}</p>
          <p>Issued On: {new Date(validationResult.issueDate).toDateString()}</p>
        </div>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default CertificateValidation;
