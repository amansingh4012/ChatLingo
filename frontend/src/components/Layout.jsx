import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSidebarStore } from "../store/useSidebarStore";
import { useEffect } from "react";

const Layout = ({ children, showSidebar = false }) => {
  const { isOpen, closeSidebar } = useSidebarStore();

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen) {
        const sidebar = document.getElementById('sidebar');
        const toggleBtn = document.getElementById('sidebar-toggle');
        
        if (sidebar && !sidebar.contains(event.target) && !toggleBtn?.contains(event.target)) {
          closeSidebar();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, closeSidebar]);

  // Prevent body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <div className="min-h-screen">
      <div className="flex">
        {/* Sidebar - Hidden by default, only shows when hamburger menu is clicked */}
        {showSidebar && (
          <div 
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${
              isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50"
              onClick={closeSidebar}
            ></div>
            
            {/* Sidebar */}
            <div 
              id="sidebar"
              className={`fixed top-0 left-0 h-full w-64 transform transition-transform duration-300 ease-in-out ${
                isOpen ? 'translate-x-0' : '-translate-x-full'
              }`}
            >
              <Sidebar isMobile={true} />
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          <Navbar showSidebarToggle={showSidebar} />
          <main className="flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </div>
  );
};
export default Layout;