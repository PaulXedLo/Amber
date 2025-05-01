export interface SignUpData {
  email: string;
  password: string;
  username: string;
  name: string;
  age: number;
}

export interface UserProfile {
  userId: any;
  fullName: any;
  isSignedIn: any;
  hydrated: any;
  isNewUser: any;
  profilePic: any;
  isPrivate: any;
  username: any;
  followersCount: any;
  followingCount: any;
  postsCount: any;
  bio: any;
  followStatus: any;
}
