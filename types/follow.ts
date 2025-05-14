export interface FollowStatus {
  status: "followed" | "requested" | "unfollowed" | "pending";
  targetUserId: string;
  followerId: string;
  createdAt: string;
}

export interface FollowAPIResponse {
  success: boolean;
  status?: "pending" | "followed" | "unfollowed" | "pending";
  error?: Error;
}
export interface FollowUserPayload {
  targetUserId: string;
  isPrivate: boolean;
  profile: any;
}
