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
  userId: uuid("user_id"),
  postId: uuid("post_id").references(() => posts.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

/* FOLLOWERS TABLE */
export const followers = pgTable("followers", {
  id: uuid("id").primaryKey(),
  followerId: uuid("follower_id").references(() => profiles.id),
  followingId: uuid("following_id").references(() => profiles.id),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
});
