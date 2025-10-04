import { Link, useLocation } from "react-router";
import useAuthUser from "../hooks/useAuthUser";
import { BellIcon, HomeIcon, MessageCircle, MessageSquare, ShipWheelIcon, UsersIcon, X } from "lucide-react";
import { useSidebarStore } from "../store/useSidebarStore";

const Sidebar = ({ isMobile = false }) => {
  const { authUser } = useAuthUser();
  const location = useLocation();
  const currentPath = location.pathname;
  const { closeSidebar } = useSidebarStore();

  // Generate chat room name based on user's learning language
  const getChatRoomName = () => {
    if (authUser?.learningLanguage) {
      return `${authUser.learningLanguage} Chat Room`;
    }
    return "General Chat Room";
  };

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar();
    }
  };

  return (
    <aside className="w-64 bg-base-200 border-r border-base-300 flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-base-300">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5" onClick={handleLinkClick}>
            <ShipWheelIcon className="size-9 text-primary" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              ChatLingo
            </span>
          </Link>
          
          {/* Close button for mobile */}
          {isMobile && (
            <button
              className="btn btn-ghost btn-circle btn-sm lg:hidden"
              onClick={closeSidebar}
            >
              <X className="size-5" />
            </button>
          )}
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/" ? "btn-active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <HomeIcon className="size-5 text-base-content opacity-70" />
          <span>Home</span>
        </Link>

        <Link
          to="/friends"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/friends" ? "btn-active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <UsersIcon className="size-5 text-base-content opacity-70" />
          <span>Friends</span>
        </Link>

        <Link
          to="/general-chat"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/general-chat" ? "btn-active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <MessageCircle className="size-5 text-base-content opacity-70" />
          <span>{getChatRoomName()}</span>
        </Link>

        <Link
          to="/global-chat"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/global-chat" ? "btn-active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <MessageSquare className="size-5 text-base-content opacity-70" />
          <span>Global Chat Room</span>
        </Link>

        <Link
          to="/notifications"
          className={`btn btn-ghost justify-start w-full gap-3 px-3 normal-case ${
            currentPath === "/notifications" ? "btn-active" : ""
          }`}
          onClick={handleLinkClick}
        >
          <BellIcon className="size-5 text-base-content opacity-70" />
          <span>Notifications</span>
        </Link>
      </nav>

      {/* USER PROFILE SECTION */}
      <div className="p-4 border-t border-base-300 mt-auto">
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src={authUser?.profilePic} alt="User Avatar" />
            </div>
          </div>
          <div className="flex-1">
            <p className="font-semibold text-sm">{authUser?.fullName}</p>
            <p className="text-xs text-success flex items-center gap-1">
              <span className="size-2 rounded-full bg-success inline-block" />
              Online
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
export default Sidebar;