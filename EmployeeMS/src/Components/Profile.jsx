import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (!stored) {
      navigate("/login");
      return;
    }

    const { id } = JSON.parse(stored);

    axios
      .get(`http://localhost:3000/auth/admin/${id}`)
      .then((res) => {
        if (res.data.Status) {
          setAdmin(res.data.Result);
        } else {
          setError(res.data.Error);
        }
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [navigate]);

  if (loading) return <div className="p-3">Loading profile...</div>;
  if (error) return <div className="p-3 text-danger">{error}</div>;

  return (
    <div className="d-flex justify-content-center align-items-center mt-4">
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h4 className="text-center text-primary mb-3">Admin Profile</h4>

        {/* PROFILE IMAGE */}
        <div className="text-center mb-3">
          <img
            src={
              admin.image
                ? `http://localhost:3000/images/${admin.image}`
                : "https://via.placeholder.com/120"
            }
            alt="Admin"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* DETAILS */}
        <p><strong>ID:</strong> {admin.id}</p>
        <p><strong>Name:</strong> {admin.name}</p>
        <p><strong>Email:</strong> {admin.email}</p>
        <p><strong>Role:</strong> {admin.role}</p>
        <p><strong>Department:</strong> {admin.department || "N/A"}</p>
        <p>
          <strong>Created By:</strong>{" "}
          {admin.created_by_name
            ? `${admin.created_by_name} (${admin.created_by_email})`
            : "System"}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(admin.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
};

export default Profile;
