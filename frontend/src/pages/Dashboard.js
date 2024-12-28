import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login'); // Redirect if not logged in
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        navigate('/login'); // Redirect on error
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div className="dashboard">
      <header>
        <h1>Welcome, {user.name || 'User'}</h1>
      </header>
      <aside>
        <nav>
          <ul>
            <li>Profile</li>
            <li>Courses</li>
            {user.role === 'instructor' && <li>Manage Courses</li>}
            {user.role === 'admin' && <li>Admin Panel</li>}
          </ul>
        </nav>
      </aside>
      <main>
        <h2>Dashboard Content</h2>
      </main>
    </div>
  );
};

export default Dashboard;

