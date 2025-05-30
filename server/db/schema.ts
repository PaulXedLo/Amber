import { is } from "drizzle-orm";
import { primaryKey } from "drizzle-orm/gel-core";
import {
  pgTable,
  uuid,
  text,
  numeric,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";

/* PROFILES TABLE */
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  fullName: text("full_name"),
  username: text("username"),
  email: text("email"),
  bio: text("bio"),
  age: numeric("age"),
  showAge: boolean("showAge").default(false),
  isPrivate: boolean("isPrivate").default(false),
  profilePicture: text("profile_picture"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* POSTS TABLE */
export const posts = pgTable("posts", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => profiles.id),
  contentText: text("content_text"),
  contentImage: text("content_image"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }),
  likesCount: integer("likes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  isPrivate: boolean("is_private").default(false),
  feeling: text("feeling"),
});

/* POST_LIKES TABLE */
export const postLikes = pgTable("post_likes", {
  id: uuid("id").primaryKey(),
  userId: uuid("user_id").references(() => profiles.id),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* FOLLOWERS TABLE */
export const followers = pgTable("followers", {
  id: uuid("id").primaryKey(),
  status: text("status").default("pending"),
  followerId: uuid("follower_id").references(() => profiles.id),
  followingId: uuid("following_id").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* COMMENTS TABLE */
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey(),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => profiles.id),
  content: text("content"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* FOLLOW REQUESTS TABLE */
export const followRequests = pgTable(
  "follow_requests",
  {
    requesterId: uuid("requester_id").references(() => profiles.id),
    targetId: uuid("target_id").references(() => profiles.id),
    status: text("status").default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => {
    return {
      followRequestPkey: primaryKey({
        columns: [table.requesterId, table.targetId],
      }),
    };
  }
);
/* Notifications TABLE */
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  receiverId: uuid("receiverId").references(() => profiles.id),
  senderId: uuid("senderId").references(() => profiles.id),
  postId: uuid("postId").references(() => posts.id, { onDelete: "cascade" }),
  type: text("type"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  isRead: boolean("isRead").default(false),
});

/* Notification preferences TABLE */
export const notificationPreferences = pgTable("notification_preferences", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => profiles.id, { onDelete: "cascade" }),
  likes: boolean("likes").default(true),
  comments: boolean("comments").default(true),
  follows: boolean("follows").default(true),
});
/* REPORTS TABLE */
export const reports = pgTable("reports", {
  userId: uuid("user_id").references(() => profiles.id),
  postId: uuid("post_id").references(() => posts.id, { onDelete: "cascade" }),
});
