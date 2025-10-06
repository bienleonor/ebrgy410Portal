import { Outlet } from 'react-router-dom';
import AdminSideBar from './AdminSideBar';

const AdminLayout = () => {
  return (
    <div className='flex'>
      <AdminSideBar />
      <div className="">
          <main className="ml-64 w-full min-h-screen">
              <Outlet /> {/* Where the current route content goes */}
          </main>
      </div>
    </div>
  );
};

export default AdminLayout;
