import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const commonLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
  ];

  const adminLinks = [
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'Manage Courses', path: '/admin/courses' },
  ];

  const instructorLinks = [
    { name: 'My Lessons', path: '/instructor/lessons' },
    { name: 'Create Course', path: '/instructor/create-course' },
  ];

  const roleBasedLinks = {
    admin: adminLinks,
    instructor: instructorLinks,
    student: [],
  };

  return (
    <aside className="sidebar">
      <nav>
        <ul>
          {commonLinks.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
          {roleBasedLinks[role]?.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;