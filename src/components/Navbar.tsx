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
    <nav className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-lg border-b border-st_taupe/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Typography variant="h2" className="font-bold text-st_light_blue">
              SeniorThrive
            </Typography>
            <Typography variant="caption" className="text-st_taupe">
              Community
            </Typography>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-st_black hover:text-st_light_blue transition-colors font-medium"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="text-st_black hover:text-st_light_blue transition-colors font-medium"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="text-st_black hover:text-st_light_blue transition-colors font-medium"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="text-st_black hover:text-st_light_blue transition-colors font-medium"
            >
              Create Community
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <Avatar
                  src={user.user_metadata?.avatar_url}
                  alt="User Avatar"
                  fallback={displayName}
                />
                <Typography variant="body" className="text-st_black">
                  {displayName}
                </Typography>
                <Button variant="outline" size="sm" onClick={signOut}>
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
              className="text-st_black focus:outline-none focus:ring-2 focus:ring-st_light_orange rounded-lg p-1"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
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
        <div className="md:hidden bg-white border-t border-st_taupe/20">
          <div className="px-4 pt-2 pb-3 space-y-2">
            <Link
              to="/"
              className="block px-3 py-2 rounded-lg text-body font-medium text-st_black hover:text-st_light_blue hover:bg-st_light_purple/10"
            >
              Home
            </Link>
            <Link
              to="/create"
              className="block px-3 py-2 rounded-lg text-body font-medium text-st_black hover:text-st_light_blue hover:bg-st_light_purple/10"
            >
              Create Post
            </Link>
            <Link
              to="/communities"
              className="block px-3 py-2 rounded-lg text-body font-medium text-st_black hover:text-st_light_blue hover:bg-st_light_purple/10"
            >
              Communities
            </Link>
            <Link
              to="/community/create"
              className="block px-3 py-2 rounded-lg text-body font-medium text-st_black hover:text-st_light_blue hover:bg-st_light_purple/10"
            >
              Create Community
            </Link>
            <div className="pt-2 border-t border-st_taupe/20">
              {user ? (
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Avatar
                    src={user.user_metadata?.avatar_url}
                    alt="User Avatar"
                    fallback={displayName}
                    size="sm"
                  />
                  <Typography variant="body" className="text-st_black flex-1">
                    {displayName}
                  </Typography>
                  <Button variant="outline" size="sm" onClick={signOut}>
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