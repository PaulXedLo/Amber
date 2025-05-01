# AmberProjectX

AmberProjectX aims to replicate the core functionalities of Instagram, providing users with a platform to share photos, follow other users, like posts, and manage their profiles. This project serves as a practical application of modern web development technologies, focusing on Vue.js with Nuxt 3 for the frontend, Supabase for the backend and database, and Drizzle ORM for database interactions.

This is a full Instagram-style social media app It is my second big project and focuses on Vue instead of React. Using Nuxt3, DrizzleORM, Supabase, TailwindCSS. RESTful APIs, database schema design, authentication, file uploads, full user interaction (likes, follow, posts)

## Project Structure

This project follows the standard Nuxt 3 directory structure, with some conventions for organization:

- **/assets**: Uncompiled assets like CSS, SASS files, or fonts.
- **/components**: Vue components organized by feature/domain (e.g., `components/auth`, `components/posts`, `components/settings`, `components/ui`). Global components or base UI elements might reside directly within or in `components/ui`.
- **/composables**: Reusable Vue Composition API functions (e.g., `useFollow`, `useLikes`).
- **/layouts**: Layout components for different page structures (e.g., `default.vue`, `authpage.vue`).
- **/middleware**: Route middleware.
- **/pages**: Application views and routes. File structure maps directly to URL paths.
- **/plugins**: Nuxt plugins.
- **/public**: Static assets directly served from the root (e.g., `favicon.ico`, `robots.txt`, videos).
- **/server**: Server-side API routes (`server/api`), database logic (`server/db`), server middleware (`server/middleware`), and utilities (`server/utils`).
  - `server/api`: Grouped by resource (e.g., `posts`, `profile`).
  - `server/db`: Contains Drizzle ORM schema (`schema.ts`), database connection (`index.ts`), and migrations (`migrations/`).
- **/stores**: Pinia state management stores, typically grouped by feature (e.g., `auth.ts`, `posts.ts`, `profile/`).
- **/types**: Global TypeScript type definitions and interfaces.
- **/utils**: Utility functions shared across the client-side application.
- **app.vue**: Main application component.
- **nuxt.config.ts**: Nuxt configuration file.
- **package.json**: Project dependencies and scripts.
- **tsconfig.json**: TypeScript configuration.
- **drizzle.config.ts**: Drizzle Kit configuration for migrations.
- **tailwind.config.js**: Tailwind CSS configuration.

## Setup

Follow these steps to get the project running locally:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Copy the example environment file
cp .env.example .env
# Edit the .env file and add your Supabase URL, Anon Key, and Database connection string

# 3. Generate database schema changes (Run this if you modify server/db/schema.ts)
# npx drizzle-kit generate

# 4. Apply database migrations (Syncs your database schema with schema.ts)
# npx drizzle-kit migrate

# 5. Run the development server
npm run dev

# Open http://localhost:3000 with your browser to see the result.
```
