import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Tweet, Comment, AppState, ViewState } from './types';

// --- Mock Data ---

const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Alex Developer',
    handle: 'alexdev',
    avatar: 'https://picsum.photos/200/200?random=1',
    bio: 'Frontend enthusiast | React & TypeScript | Coffee lover ☕',
    following: ['u2', 'u3'],
    followers: ['u2'],
    joinedDate: 'Joined September 2021',
  },
  {
    id: 'u2',
    name: 'Sarah Design',
    handle: 'sarah_ux',
    avatar: 'https://picsum.photos/200/200?random=2',
    bio: 'Pixel pusher. Designing for the future. ✨',
    following: ['u1'],
    followers: ['u1', 'u3'],
    joinedDate: 'Joined January 2022',
  },
  {
    id: 'u3',
    name: 'Tech Daily',
    handle: 'techdaily',
    avatar: 'https://picsum.photos/200/200?random=3',
    bio: 'Breaking tech news and reviews.',
    following: ['u2'],
    followers: ['u1'],
    joinedDate: 'Joined March 2023',
  }
];

const MOCK_TWEETS: Tweet[] = [
  {
    id: 't1',
    userId: 'u1',
    content: 'Just deployed my first React app with Gemini integration! 🚀 #coding #AI',
    timestamp: Date.now() - 1000000,
    likes: ['u2'],
    comments: [],
  },
  {
    id: 't2',
    userId: 'u2',
    content: 'Minimalist design is harder than it looks. Sometimes less is really more.',
    timestamp: Date.now() - 500000,
    likes: ['u1', 'u3'],
    comments: [],
  },
  {
    id: 't3',
    userId: 'u3',
    content: 'The new Gemini 2.5 Flash model is incredibly fast for real-time applications.',
    timestamp: Date.now() - 200000,
    likes: [],
    comments: [],
  }
];

// --- Context Setup ---

interface AppContextType {
  currentUser: User;
  users: User[];
  tweets: Tweet[];
  view: ViewState;
  viewProfileId?: string;
  setView: (view: ViewState, profileId?: string) => void;
  postTweet: (content: string) => void;
  deleteTweet: (tweetId: string) => void;
  editTweet: (tweetId: string, content: string) => void;
  likeTweet: (tweetId: string) => void;
  followUser: (targetUserId: string) => void;
  updateProfile: (updatedUser: Partial<User>) => void;
  getUser: (userId: string) => User | undefined;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial state (simulate persistence)
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [tweets, setTweets] = useState<Tweet[]>(MOCK_TWEETS);
  const [view, setViewInternal] = useState<ViewState>('HOME');
  const [viewProfileId, setViewProfileId] = useState<string | undefined>(undefined);

  const setView = (v: ViewState, pid?: string) => {
    setViewInternal(v);
    if (v === 'PROFILE') {
      setViewProfileId(pid || currentUser.id);
    } else {
      setViewProfileId(undefined);
    }
  };

  const getUser = (userId: string) => users.find(u => u.id === userId);

  const postTweet = (content: string) => {
    const newTweet: Tweet = {
      id: `t${Date.now()}`,
      userId: currentUser.id,
      content,
      timestamp: Date.now(),
      likes: [],
      comments: [],
    };
    setTweets([newTweet, ...tweets]);
  };

  const deleteTweet = (tweetId: string) => {
    setTweets(tweets.filter(t => t.id !== tweetId));
  };

  const editTweet = (tweetId: string, content: string) => {
    setTweets(tweets.map(t => (t.id === tweetId ? { ...t, content, isEdited: true } : t)));
  };

  const likeTweet = (tweetId: string) => {
    setTweets(tweets.map(t => {
      if (t.id === tweetId) {
        const isLiked = t.likes.includes(currentUser.id);
        const newLikes = isLiked
          ? t.likes.filter(uid => uid !== currentUser.id)
          : [...t.likes, currentUser.id];
        return { ...t, likes: newLikes };
      }
      return t;
    }));
  };

  const followUser = (targetUserId: string) => {
    if (targetUserId === currentUser.id) return;

    // Update Current User
    const isFollowing = currentUser.following.includes(targetUserId);
    const newFollowing = isFollowing
      ? currentUser.following.filter(id => id !== targetUserId)
      : [...currentUser.following, targetUserId];

    const updatedCurrentUser = { ...currentUser, following: newFollowing };
    setCurrentUser(updatedCurrentUser);

    // Update Users List (to reflect follower count change on other user)
    setUsers(users.map(u => {
      if (u.id === currentUser.id) return updatedCurrentUser;
      if (u.id === targetUserId) {
        const newFollowers = isFollowing
          ? u.followers.filter(id => id !== currentUser.id)
          : [...u.followers, currentUser.id];
        return { ...u, followers: newFollowers };
      }
      return u;
    }));
  };

  const updateProfile = (updatedData: Partial<User>) => {
    const updatedUser = { ...currentUser, ...updatedData };
    setCurrentUser(updatedUser);
    setUsers(users.map(u => u.id === currentUser.id ? updatedUser : u));
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      users,
      tweets,
      view,
      viewProfileId,
      setView,
      postTweet,
      deleteTweet,
      editTweet,
      likeTweet,
      followUser,
      updateProfile,
      getUser
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useAppStore must be used within AppProvider");
  return context;
};