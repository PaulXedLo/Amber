# AmberProjectX

AmberProjectX is a full-featured Instagram-style social media application. Users can share photos, follow others, like posts, comment, and manage their profiles. The project demonstrates modern web development practices using Vue.js (Nuxt 3), Supabase, Drizzle ORM, and TailwindCSS.

## Features

- 📸 Photo sharing and feed
- 👍 Like and comment on posts
- 👥 Follow/unfollow users
- 🔔 Customizable notifications (likes, follows, comments)
- 🛡️ Authentication and user profiles
- 🗂️ RESTful API with Nuxt server routes
- 🗄️ Database schema and migrations with Drizzle ORM
- 🎨 Responsive UI with TailwindCSS

## Tech Stack

- **Frontend:** [Vue.js](https://vuejs.org/) (Nuxt 3)
- **Backend:** [Supabase](https://supabase.com/) (auth, storage, database)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Styling:** [TailwindCSS](https://tailwindcss.com/)
- **State Management:** [Pinia](https://pinia.vuejs.org/)

## Project Structure

This project follows the standard Nuxt 3 directory structure, with some conventions for organization:

- **/assets**: Uncompiled assets (CSS, SASS, fonts)
- **/components**: Vue components by feature/domain (e.g., `auth`, `posts`, `settings`)
- **/composables**: Reusable Vue Composition API functions (e.g., `useFollow`, `useLikes`)
- **/layouts**: Layout components (e.g., `default.vue`, `authpage.vue`)
- **/middleware**: Route middleware
- **/pages**: Application views and routes
- **/plugins**: Nuxt plugins
- **/public**: Static assets (e.g., `favicon.ico`, `robots.txt`)
- **/server**: Server-side API routes, database logic, middleware, and utilities
  - `server/api`: Grouped by resource (e.g., `posts`, `profile`)
  - `server/db`: Drizzle ORM schema, connection, and migrations
- **/stores**: Pinia state management stores
- **/types**: Global TypeScript types and interfaces
- **/utils**: Shared utility functions
- **app.vue**: Main application component
- **nuxt.config.ts**: Nuxt configuration
- **package.json**: Project dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **drizzle.config.ts**: Drizzle Kit config for migrations
- **tailwind.config.js**: Tailwind CSS configuration

## Setup

Follow these steps to get the project running locally:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env
# Edit the .env file and add your Supabase URL, Anon Key, and Database connection string

# 3. Generate database schema changes (if you modify server/db/schema.ts)
npx drizzle-kit generate

# 4. Apply database migrations (syncs your database schema with schema.ts)
npx drizzle-kit migrate

# 5. Run the development server
npm run dev

# Open http://localhost:3000 with your browser to see the result.
```

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License

[MIT](LICENSE)

---

&copy; {{ new Date().getFullYear() }} AMBER. All rights reserved.
