import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, profile, signInWithGitHub, signOut, loading } = useAuth();
  const displayName = profile?.username || user?.user_metadata?.user_name || user?.email;

  if (loading) {
    return (
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Typography variant="body" className="text-white font-bold text-lg">
                  ST
                </Typography>
              </div>
              <Typography variant="h3" className="font-bold text-gray-900 text-xl">
                SeniorThrive
              </Typography>
            </div>
            <div className="animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-200">
              <Typography variant="body" className="text-white font-bold text-lg">
                ST
              </Typography>
            </div>
            <Typography variant="h3" className="font-bold text-gray-900 text-xl">
              SeniorThrive
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
            >
              Communities
            </Link>
            {/* Only show Create Community link to moderators */}
            {profile?.is_moderator && (
              <Link
                to="/community/create"
                className="px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Create Community
              </Link>
            )}
            {/* Moderation Dashboard for moderators */}
            {profile?.is_moderator && (
              <Link
                to="/moderation"
                className="px-4 py-2.5 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200 hover:scale-105"
              >
                Moderation
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Link to="/profile" className="flex items-center space-x-3 hover:bg-gray-100 rounded-xl p-3 transition-all duration-200 group">
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    alt="User Avatar"
                    fallback={displayName}
                    size="sm"
                    className="ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all duration-200"
                  />
                  <div className="flex flex-col">
                    <Typography variant="body" className="text-gray-900 font-semibold text-sm">
                      {displayName}
                    </Typography>
                    {profile?.is_moderator && (
                      <Typography variant="caption" className="text-orange-600 font-semibold">
                        Moderator
                      </Typography>
                    )}
                  </div>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut} className="rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGitHub} className="rounded-xl px-6 shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 hover:scale-105">
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-all duration-200"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-3 space-y-1">
            <Link
              to="/"
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
              onClick={() => setMenuOpen(false)}
            >
              Communities
            </Link>
            {profile?.is_moderator && (
              <>
                <Link
                  to="/community/create"
                  className="block px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-xl transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Create Community
                </Link>
                <Link
                  to="/moderation"
                  className="block px-4 py-3 text-sm font-semibold text-orange-600 hover:bg-orange-50 rounded-xl transition-all duration-200"
                  onClick={() => setMenuOpen(false)}
                >
                  Moderation
                </Link>
              </>
            )}
            
            <div className="pt-3 border-t border-gray-100">
              {user ? (
                <div className="space-y-2">
                  <Link
                    to="/profile"
                    className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-100 rounded-xl transition-all duration-200"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      alt="User Avatar"
                      fallback={displayName}
                      size="sm"
                      className="ring-2 ring-blue-100"
                    />
                    <div className="flex flex-col">
                      <Typography variant="body" className="text-gray-900 font-semibold">
                        {displayName}
                      </Typography>
                      {profile?.is_moderator && (
                        <Typography variant="caption" className="text-orange-600 font-semibold">
                          Moderator
                        </Typography>
                      )}
                    </div>
                  </Link>
                  <div className="px-4">
                    <Button variant="ghost" size="sm" onClick={signOut} className="w-full rounded-xl hover:bg-red-50 hover:text-red-600">
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 py-3">
                  <Button variant="primary" size="sm" className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-purple-600" onClick={signInWithGitHub}>
                    Sign In
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};