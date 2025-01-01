import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = ({ role }) => {
  const commonLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'View Certificate', path: '/certificate/validate' },
  ];

  const adminLinks = [
    { name: 'Manage Users', path: '/admin/users' },
    { name: 'View Courses', path: '/admin/courses' },
  ];

  const instructorLinks = [
    { name: 'My Lessons', path: '/instructor/lessons' },
    { name: 'Create Course', path: '/instructor/create-course' },
  ];

  const studentLinks = [
    { name: 'My Enrollments', path: '/student/enrollments' },
    { name: 'View Lessons', path: '/student/lessons' },
   
  ];

  const roleBasedLinks = {
    admin: adminLinks,
    instructor: instructorLinks,
    student: studentLinks,
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
