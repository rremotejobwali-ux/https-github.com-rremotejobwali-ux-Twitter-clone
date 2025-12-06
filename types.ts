export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  following: string[]; // Array of User IDs
  followers: string[]; // Array of User IDs
  joinedDate: string;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
}

export interface Tweet {
  id: string;
  userId: string;
  content: string;
  timestamp: number;
  likes: string[]; // Array of User IDs who liked
  comments: Comment[];
  isEdited?: boolean;
}

export type ViewState = 'HOME' | 'PROFILE';

export interface AppState {
  currentUser: User;
  users: User[];
  tweets: Tweet[];
  view: ViewState;
  viewProfileId?: string; // If view is PROFILE, which user?
}