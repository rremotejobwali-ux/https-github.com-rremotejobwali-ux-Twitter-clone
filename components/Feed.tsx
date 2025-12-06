import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Tweet } from '../types';
import { MessageCircle, Heart, Repeat2, Share, MoreHorizontal, Trash2, Edit2, Sparkles, X } from 'lucide-react';
import { generateTweetContent } from '../services/geminiService';

// --- Sub-component: Tweet Composer ---
const TweetComposer = () => {
  const { currentUser, postTweet } = useAppStore();
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [showAiInput, setShowAiInput] = useState(false);

  const handleSubmit = () => {
    if (!content.trim()) return;
    postTweet(content);
    setContent('');
  };

  const handleMagicTweet = async () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);
    const generated = await generateTweetContent(aiPrompt);
    setContent(generated);
    setIsGenerating(false);
    setShowAiInput(false);
    setAiPrompt('');
  };

  return (
    <div className="p-4 border-b border-gray-800">
      <div className="flex gap-4">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-full object-cover" 
        />
        <div className="flex-1">
          {showAiInput ? (
            <div className="bg-gray-900 p-3 rounded-lg mb-2 relative">
               <button onClick={() => setShowAiInput(false)} className="absolute top-2 right-2 text-gray-500 hover:text-white">
                 <X className="w-4 h-4" />
               </button>
               <input 
                 type="text"
                 value={aiPrompt}
                 onChange={(e) => setAiPrompt(e.target.value)}
                 placeholder="What should this tweet be about?"
                 className="w-full bg-transparent text-sm text-white outline-none mb-2"
                 autoFocus
               />
               <button 
                onClick={handleMagicTweet}
                disabled={isGenerating}
                className="text-xs bg-purple-600 text-white px-3 py-1 rounded-full flex items-center gap-1 disabled:opacity-50"
               >
                 {isGenerating ? 'Thinking...' : <><Sparkles className="w-3 h-3" /> Generate</>}
               </button>
            </div>
          ) : null}
          
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What is happening?!" 
            className="w-full bg-transparent text-xl outline-none resize-none min-h-[50px] text-white placeholder-gray-600"
          />
          <div className="flex justify-between items-center mt-3 border-t border-gray-800 pt-3">
             <div className="flex gap-3 text-blue-500">
               <button 
                 onClick={() => setShowAiInput(!showAiInput)} 
                 className="p-1.5 rounded-full hover:bg-blue-500/10 text-purple-400 tooltip"
                 title="AI Magic"
               >
                 <Sparkles className="w-5 h-5" />
               </button>
             </div>
             <button 
               onClick={handleSubmit}
               disabled={!content.trim()}
               className="bg-blue-500 text-white px-5 py-2 rounded-full font-bold hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
             >
               Post
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-component: Tweet Item ---
const TweetItem = ({ tweet }: { tweet: Tweet }) => {
  const { getUser, currentUser, deleteTweet, editTweet, likeTweet, setView } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(tweet.content);
  
  const author = getUser(tweet.userId);
  if (!author) return null;

  const isLiked = tweet.likes.includes(currentUser.id);
  const isOwner = currentUser.id === tweet.userId;

  const handleSaveEdit = () => {
    editTweet(tweet.id, editContent);
    setIsEditing(false);
  };

  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h`;
    return `${Math.floor(hours / 24)}d`;
  };

  return (
    <article className="p-4 border-b border-gray-800 hover:bg-white/5 transition-colors cursor-pointer">
       <div className="flex gap-4">
         <img 
            src={author.avatar} 
            alt={author.name} 
            className="w-10 h-10 rounded-full object-cover hover:opacity-80" 
            onClick={(e) => { e.stopPropagation(); setView('PROFILE', author.id); }}
         />
         <div className="flex-1 min-w-0">
           {/* Header */}
           <div className="flex justify-between items-start">
             <div className="flex items-center gap-2 truncate">
               <span 
                 className="font-bold hover:underline"
                 onClick={(e) => { e.stopPropagation(); setView('PROFILE', author.id); }}
               >
                 {author.name}
               </span>
               <span className="text-gray-500 text-sm">@{author.handle}</span>
               <span className="text-gray-500 text-sm">· {timeAgo(tweet.timestamp)}</span>
               {tweet.isEdited && <span className="text-gray-600 text-xs italic ml-1"> (edited)</span>}
             </div>
             {isOwner && (
               <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); setIsEditing(!isEditing); }}
                    className="text-gray-500 hover:text-blue-500 p-1"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); deleteTweet(tweet.id); }}
                    className="text-gray-500 hover:text-red-500 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
               </div>
             )}
           </div>

           {/* Content */}
           {isEditing ? (
             <div className="mt-2" onClick={(e) => e.stopPropagation()}>
               <textarea 
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
                 className="w-full bg-black border border-gray-700 rounded p-2 text-white"
               />
               <div className="flex justify-end gap-2 mt-2">
                 <button onClick={() => setIsEditing(false)} className="text-sm text-gray-400">Cancel</button>
                 <button onClick={handleSaveEdit} className="text-sm bg-blue-500 px-3 py-1 rounded-full">Save</button>
               </div>
             </div>
           ) : (
             <p className="mt-1 text-white whitespace-pre-wrap leading-normal">
               {tweet.content}
             </p>
           )}

           {/* Actions */}
           <div className="flex justify-between mt-3 max-w-md text-gray-500">
             <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
               <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                  <MessageCircle className="w-4 h-4" />
               </div>
               <span className="text-sm">{tweet.comments.length || ''}</span>
             </button>
             <button className="flex items-center gap-2 hover:text-green-500 transition-colors group">
               <div className="p-2 rounded-full group-hover:bg-green-500/10">
                 <Repeat2 className="w-4 h-4" />
               </div>
               <span className="text-sm"></span>
             </button>
             <button 
               onClick={(e) => { e.stopPropagation(); likeTweet(tweet.id); }}
               className={`flex items-center gap-2 transition-colors group ${isLiked ? 'text-pink-600' : 'hover:text-pink-600'}`}
             >
               <div className="p-2 rounded-full group-hover:bg-pink-600/10">
                 <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
               </div>
               <span className="text-sm">{tweet.likes.length || ''}</span>
             </button>
             <button className="flex items-center gap-2 hover:text-blue-500 transition-colors group">
                <div className="p-2 rounded-full group-hover:bg-blue-500/10">
                  <Share className="w-4 h-4" />
                </div>
             </button>
           </div>
         </div>
       </div>
    </article>
  );
};

// --- Main Feed Component ---
export const Feed = () => {
  const { tweets } = useAppStore();

  return (
    <div className="w-full">
      <div className="sticky top-0 bg-black/80 backdrop-blur-md z-10 border-b border-gray-800 p-4">
        <h1 className="text-xl font-bold">Home</h1>
      </div>
      <TweetComposer />
      <div className="pb-20 md:pb-0">
        {tweets.map(tweet => (
           <TweetItem key={tweet.id} tweet={tweet} />
        ))}
        {tweets.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No tweets yet. Be the first to post!
          </div>
        )}
      </div>
    </div>
  );
};