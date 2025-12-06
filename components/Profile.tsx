import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import { ArrowLeft, Calendar, Link, MapPin, Sparkles } from 'lucide-react';
import { enhanceBio } from '../services/geminiService';
import { Tweet } from '../types';

// We need to import TweetItem recursively, but to avoid circular deps in this simple setup
// I'll duplicate the minimalist TweetItem rendering logic or better yet, move TweetItem to a shared file
// For "handful of files" constraint, I will just render a simple list here or copy logic.
// Simulating clean architecture: Re-defining a simple list view for profile.

const ProfileTweetItem = ({ tweet }: { tweet: Tweet }) => {
   // Minimal version for profile view
   return (
     <div className="p-4 border-b border-gray-800">
        <p className="text-gray-400 text-xs mb-1">{new Date(tweet.timestamp).toLocaleDateString()}</p>
        <p className="text-white">{tweet.content}</p>
     </div>
   )
}

export const Profile = () => {
  const { viewProfileId, getUser, currentUser, tweets, updateProfile, setView, followUser } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [isEnhancing, setIsEnhancing] = useState(false);

  const profileUser = viewProfileId ? getUser(viewProfileId) : null;

  useEffect(() => {
    if (profileUser) {
      setEditName(profileUser.name);
      setEditBio(profileUser.bio);
    }
  }, [profileUser, isEditing]);

  if (!profileUser) return <div>User not found</div>;

  const userTweets = tweets.filter(t => t.userId === profileUser.id);
  const isMe = currentUser.id === profileUser.id;
  const isFollowing = currentUser.following.includes(profileUser.id);

  const handleSaveProfile = () => {
    updateProfile({ name: editName, bio: editBio });
    setIsEditing(false);
  };

  const handleEnhanceBio = async () => {
     setIsEnhancing(true);
     const newBio = await enhanceBio(editBio);
     setEditBio(newBio);
     setIsEnhancing(false);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 p-2 flex items-center gap-4">
        <button onClick={() => setView('HOME')} className="p-2 hover:bg-gray-800 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
           <h1 className="text-xl font-bold leading-5">{profileUser.name}</h1>
           <span className="text-sm text-gray-500">{userTweets.length} posts</span>
        </div>
      </div>

      {/* Hero / Banner Area (Gray placeholder) */}
      <div className="h-48 bg-gray-800 w-full relative">
         <div className="absolute -bottom-16 left-4 border-4 border-black rounded-full p-1 bg-black">
           <img src={profileUser.avatar} alt={profileUser.name} className="w-32 h-32 rounded-full object-cover" />
         </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-end p-4 h-16">
        {isMe ? (
          <button 
            onClick={() => setIsEditing(true)}
            className="border border-gray-500 font-bold px-4 py-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            Edit profile
          </button>
        ) : (
          <button 
            onClick={() => followUser(profileUser.id)}
            className={`font-bold px-6 py-1.5 rounded-full transition-colors ${
               isFollowing 
               ? 'border border-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-500/10' 
               : 'bg-white text-black hover:bg-gray-200'
            }`}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        )}
      </div>

      {/* Profile Info */}
      <div className="px-4 mt-2">
         <h2 className="text-2xl font-bold text-white">{profileUser.name}</h2>
         <p className="text-gray-500 text-sm">@{profileUser.handle}</p>
         
         <p className="mt-4 text-white whitespace-pre-wrap">{profileUser.bio}</p>

         <div className="flex gap-4 mt-4 text-gray-500 text-sm">
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> Earth</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {profileUser.joinedDate}</span>
         </div>

         <div className="flex gap-4 mt-4 text-sm mb-6">
            <span className="text-white font-bold">{profileUser.following.length} <span className="text-gray-500 font-normal">Following</span></span>
            <span className="text-white font-bold">{profileUser.followers.length} <span className="text-gray-500 font-normal">Followers</span></span>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer font-bold border-b-4 border-blue-500 text-white">Posts</div>
        <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer text-gray-500">Replies</div>
        <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer text-gray-500">Media</div>
        <div className="flex-1 text-center p-4 hover:bg-white/5 cursor-pointer text-gray-500">Likes</div>
      </div>

      {/* Tweet List */}
      <div>
         {userTweets.length > 0 ? (
           userTweets.map(tweet => (
             <ProfileTweetItem key={tweet.id} tweet={tweet} />
           ))
         ) : (
           <div className="p-8 text-center text-gray-500">
             User has no tweets.
           </div>
         )}
      </div>

      {/* Edit Modal Overlay */}
      {isEditing && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex justify-center items-center z-50 px-4">
           <div className="bg-black w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-gray-800">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <button onClick={() => setIsEditing(false)}><X className="w-6 h-6" /></button>
                  <h2 className="font-bold text-xl">Edit Profile</h2>
                </div>
                <button onClick={handleSaveProfile} className="bg-white text-black px-4 py-1.5 rounded-full font-bold">Save</button>
              </div>

              <div className="space-y-6">
                 <div>
                    <label className="block text-sm text-gray-500 mb-1">Name</label>
                    <input 
                      type="text" 
                      value={editName} 
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full bg-transparent border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none" 
                    />
                 </div>
                 <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-sm text-gray-500">Bio</label>
                      <button 
                        onClick={handleEnhanceBio}
                        disabled={isEnhancing}
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                         <Sparkles className="w-3 h-3" />
                         {isEnhancing ? 'Writing...' : 'AI Enhance'}
                      </button>
                    </div>
                    <textarea 
                      value={editBio} 
                      onChange={(e) => setEditBio(e.target.value)}
                      className="w-full bg-transparent border border-gray-700 rounded p-2 text-white focus:border-blue-500 outline-none h-24 resize-none" 
                    />
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Simple X icon for modal since I cannot import it from Lucide easily inside the component def
const X = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
)
