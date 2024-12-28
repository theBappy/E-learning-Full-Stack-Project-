import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(data.user);
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    fetchUser();
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <Sidebar role={user.role} />
      <main>
        <h1>Welcome, {user.name}</h1>
        {/* Add additional dashboard content here */}
      </main>
    </div>
  );
};

export default Dashboard;

