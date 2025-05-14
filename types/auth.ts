// SIGN UP DATA
export interface SignUpData {
  email: string;
  password: string;
  username: string;
  name: string;
  age: number;
}
// Login DATA
export interface LogInData {
  email: string;
  password: string;
}
// UPDATE PASSWORD DATA
export interface UpdatePasswordData {
  password: string;
}
// USER PROFILE DATA
export interface UserProfile {
  userId: string | null;
  fullName: string | null;
  isSignedIn: boolean;
  hydrated: boolean;
  isNewUser: boolean;
  profilePic: string | null;
  isPrivate: boolean;
  username: string | null;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  bio: string | null;
  followStatus: Record<string, unknown>;
}
