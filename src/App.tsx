import { Route, Routes } from "react-router";
import { Home } from "./pages/Home";
import { Navbar } from "./components/Navbar";
import { CreatePostPage } from "./pages/CreatePostPage";
import { PostPage } from "./pages/PostPage";
import { CreateCommunityPage } from "./pages/CreateCommunityPage";
import { CommunitiesPage } from "./pages/CommunitiesPage";
import { CommunityPage } from "./pages/CommunityPage";
import { ModerationPage } from "./pages/ModerationPage";
import { ProfilePage } from "./pages/ProfilePage";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-14">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreatePostPage />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/community/create" element={<CreateCommunityPage />} />
          <Route path="/communities" element={<CommunitiesPage />} />
          <Route path="/community/:id" element={<CommunityPage />} />
          <Route path="/moderation" element={<ModerationPage />} />
          <Route 
            path="/profile" 
            element={
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-20">
                {/* Animated background elements */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-float"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
                  <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
                </div>
                <div className="relative">
                  <ProfilePage />
                </div>
              </div>
            } 
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;