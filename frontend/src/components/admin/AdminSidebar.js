import React from "react";
import { Link } from "react-router-dom";

const AdminSidebar = () => {
  return (
    <aside className="w-64 bg-gray-100 h-screen p-4">
      <h2 className="font-bold text-lg mb-4">Menu</h2>
      <ul className="space-y-2">
        <li><Link to="/admin/dashboard" className="block p-2 hover:bg-gray-200">Dashboard</Link></li>
        <li><Link to="/admin/users" className="block p-2 hover:bg-gray-200">User Management</Link></li>
        <li><Link to="/admin/admins" className="block p-2 hover:bg-gray-200">Admin Management</Link></li>
        <li><Link to="/admin/analytics" className="block p-2 hover:bg-gray-200">Analytics</Link></li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
