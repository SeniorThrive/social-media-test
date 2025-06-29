import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/Button";
import { Avatar } from "./ui/Avatar";
import { Typography } from "./ui/Typography";

export const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signInWithGitHub, signOut } = useAuth();
  const displayName = user?.user_metadata?.user_name || user?.email;

  return (
    <nav className="fixed top-0 w-full z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Typography variant="body" className="text-white font-bold text-sm">
                ST
              </Typography>
            </div>
            <Typography variant="h3" className="font-bold text-gray-900">
              SeniorThrive
            </Typography>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  alt="User Avatar"
                  fallback={displayName}
                  size="sm"
                />
                <Typography variant="body" className="text-gray-900 font-medium">
                  {displayName}
                </Typography>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button variant="primary" size="sm" onClick={signInWithGitHub}>
                Sign In
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen((prev) => !prev)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
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
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
              onClick={() => setMenuOpen(false)}
            >
              Create Community
            </Link>
            
            <div className="pt-2 border-t border-gray-200">
              {user ? (
                <div className="flex items-center justify-between px-3 py-2">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={user.user_metadata?.avatar_url}
                      alt="User Avatar"
                      fallback={displayName}
                      size="sm"
                    />
                    <Typography variant="body" className="text-gray-900 font-medium">
                      {displayName}
                    </Typography>
                  </div>
                  <Button variant="ghost" size="sm" onClick={signOut}>
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="px-3 py-2">
                  <Button variant="primary" size="sm" className="w-full" onClick={signInWithGitHub}>
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