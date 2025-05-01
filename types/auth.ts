export interface SignUpData {
  email: string;
  password: string;
  username: string;
  name: string;
  age: number;
}

export interface UserProfile {
  userId: string | null;
  fullName: string | null;
  isSignedIn: boolean;
  hydrated: boolean;
  isNewUser: boolean;
  profilePic: string | null;
  isPrivate: boolean | null;
  username: string | null;
  followersCount: any;
  followingCount: any;
  postsCount: any;
  bio: string | null;
  followStatus: Record<string, "followed" | "unfollowed" | "pending">;
}
