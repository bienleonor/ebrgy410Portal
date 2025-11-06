import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <AdminSideBar />
      <div className='flex flex-1'>
          <main className="flex-1 ml-64 w-full bg-gradient-to-b from-pink-500 to-pink-100">
              <Outlet /> {/* Where the current route content goes */}
          </main>
      </div>
    </div>
  );
};

export default AdminLayout;
