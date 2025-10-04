import { useQuery } from "@tanstack/react-query";
import { getUserFriends } from "../lib/api";
import { Link } from "react-router";
import { HomeIcon, MessageCircleIcon, UsersIcon } from "lucide-react";

import FriendCard from "../components/FriendCard";
import NoFriendsFound from "../components/NoFriendsFound";

const FriendsPage = () => {
  const { data: friends = [], isLoading: loadingFriends } = useQuery({
    queryKey: ["friends"],
    queryFn: getUserFriends,
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="container mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">My Friends</h1>
            <p className="text-base-content opacity-70 mt-2">
              Connect with your language exchange partners
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="btn btn-outline btn-sm">
              <HomeIcon className="mr-2 size-4" />
              Home
            </Link>
            <Link to="/notifications" className="btn btn-outline btn-sm">
              <UsersIcon className="mr-2 size-4" />
              Friend Requests
            </Link>
          </div>
        </div>

        {/* Friends Count */}
        <div className="stats shadow bg-base-200">
          <div className="stat">
            <div className="stat-figure text-primary">
              <UsersIcon className="size-8" />
            </div>
            <div className="stat-title">Total Friends</div>
            <div className="stat-value text-primary">{friends.length}</div>
            <div className="stat-desc">Language exchange partners</div>
          </div>
        </div>

        {/* Friends Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">All Friends</h2>
            {friends.length > 0 && (
              <div className="text-sm text-base-content opacity-70">
                {friends.length} friend{friends.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>

          {loadingFriends ? (
            <div className="flex justify-center py-16">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : friends.length === 0 ? (
            <NoFriendsFound />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {friends.map((friend) => (
                <div key={friend._id} className="relative">
                  <FriendCard friend={friend} />
                  {/* Quick Actions */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="dropdown dropdown-end">
                      <div tabIndex={0} role="button" className="btn btn-ghost btn-xs btn-circle">
                        <MessageCircleIcon className="size-3" />
                      </div>
                      <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-32">
                        <li>
                          <Link to={`/chat/${friend._id}`} className="text-xs">
                            <MessageCircleIcon className="size-3" />
                            Message
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Section */}
        {friends.length > 0 && (
          <div className="card bg-base-200 p-6">
            <h3 className="font-semibold text-lg mb-4">Quick Actions</h3>
            <div className="flex flex-wrap gap-3">
              <Link to="/" className="btn btn-outline btn-sm">
                <HomeIcon className="mr-2 size-4" />
                Find New Friends
              </Link>
              <Link to="/notifications" className="btn btn-outline btn-sm">
                <UsersIcon className="mr-2 size-4" />
                Pending Requests
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FriendsPage;