import React from 'react';
import { Home, User, PenTool, Search, LogOut } from 'lucide-react';
import { useAppStore } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setView, currentUser, users, followUser } = useAppStore();

  // Suggest who to follow (users not currently followed by current user)
  const whoToFollow = users.filter(u => u.id !== currentUser.id && !currentUser.following.includes(u.id));

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row max-w-7xl mx-auto">
      {/* Left Sidebar (Desktop) */}
      <nav className="hidden md:flex w-20 xl:w-64 flex-col justify-between h-screen sticky top-0 border-r border-gray-800 p-4">
        <div className="flex flex-col gap-6 items-center xl:items-start">
          <div className="p-3 rounded-full hover:bg-gray-900 cursor-pointer" onClick={() => setView('HOME')}>
             {/* Logo */}
            <svg viewBox="0 0 24 24" className="h-8 w-8 text-white fill-current" aria-hidden="true">
              <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
            </svg>
          </div>
          
          <button 
            onClick={() => setView('HOME')}
            className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors w-full xl:w-auto justify-center xl:justify-start"
          >
            <Home className="w-7 h-7" />
            <span className="text-xl hidden xl:block font-medium">Home</span>
          </button>

          <button 
            onClick={() => setView('PROFILE', currentUser.id)}
            className="flex items-center gap-4 p-3 rounded-full hover:bg-gray-900 transition-colors w-full xl:w-auto justify-center xl:justify-start"
          >
            <User className="w-7 h-7" />
            <span className="text-xl hidden xl:block font-medium">Profile</span>
          </button>

          <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white rounded-full p-4 xl:px-8 xl:py-3 font-bold shadow-lg transition-transform transform hover:scale-105 w-full xl:w-auto flex justify-center items-center">
             <PenTool className="w-6 h-6 xl:hidden" />
             <span className="hidden xl:block">Post</span>
          </button>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-full hover:bg-gray-900 cursor-pointer mt-auto">
          <img src={currentUser.avatar} alt="Me" className="w-10 h-10 rounded-full object-cover" />
          <div className="hidden xl:block overflow-hidden">
            <p className="font-bold truncate">{currentUser.name}</p>
            <p className="text-gray-500 text-sm truncate">@{currentUser.handle}</p>
          </div>
          <LogOut className="w-5 h-5 ml-auto text-gray-500 hidden xl:block" />
        </div>
      </nav>

      {/* Main Feed Area */}
      <main className="flex-1 border-r border-gray-800 min-h-screen mb-16 md:mb-0">
        {children}
      </main>

      {/* Right Sidebar (Desktop) */}
      <aside className="hidden lg:block w-80 p-4 sticky top-0 h-screen overflow-y-auto no-scrollbar">
        <div className="bg-gray-900 rounded-full flex items-center p-3 mb-6 focus-within:bg-black focus-within:ring-1 focus-within:ring-blue-500 border border-transparent focus-within:border-blue-500">
          <Search className="w-5 h-5 text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent outline-none text-white w-full placeholder-gray-500"
          />
        </div>

        <div className="bg-gray-900 rounded-2xl p-4 mb-4">
          <h2 className="font-bold text-xl mb-4">Who to follow</h2>
          {whoToFollow.length === 0 && <p className="text-gray-500 text-sm">No new suggestions.</p>}
          {whoToFollow.map(user => (
            <div key={user.id} className="flex items-center justify-between mb-4 last:mb-0">
              <div className="flex items-center gap-3 cursor-pointer" onClick={() => setView('PROFILE', user.id)}>
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
                <div className="flex flex-col">
                  <span className="font-bold hover:underline">{user.name}</span>
                  <span className="text-gray-500 text-sm">@{user.handle}</span>
                </div>
              </div>
              <button 
                onClick={() => followUser(user.id)}
                className="bg-white text-black px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-200 transition-colors"
              >
                Follow
              </button>
            </div>
          ))}
        </div>
        
         <div className="bg-gray-900 rounded-2xl p-4">
          <h2 className="font-bold text-xl mb-4">Trends for you</h2>
          <div className="space-y-4">
             <div>
                <p className="text-xs text-gray-500">Trending in Tech</p>
                <p className="font-bold">#GeminiAPI</p>
                <p className="text-xs text-gray-500">12.5K posts</p>
             </div>
             <div>
                <p className="text-xs text-gray-500">Trending in Design</p>
                <p className="font-bold">Tailwind CSS</p>
                <p className="text-xs text-gray-500">45.2K posts</p>
             </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 w-full bg-black border-t border-gray-800 flex justify-around p-3 z-50">
        <button onClick={() => setView('HOME')} className="p-2">
           <Home className="w-6 h-6" />
        </button>
        <button className="p-2">
           <Search className="w-6 h-6" />
        </button>
        <button onClick={() => setView('PROFILE', currentUser.id)} className="p-2">
           <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};