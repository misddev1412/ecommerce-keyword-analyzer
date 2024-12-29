# Project Overview
**Trendyki** is an e-commerce analytics platform aimed at discovering trending keywords from various online marketplaces. By aggregating and analyzing keyword data, Trendyki helps businesses optimize product listings, identify emerging trends, and refine their marketing strategies. This Nuxt 3 application will serve as the frontend for data visualization, leveraging **PrimeVue** for UI components, **Supabase** for data storage and serverless functions, and optionally **Clerk** for user authentication.

---

# Feature Requirements

1. **Core Functionality**  
   - **Keyword Data Aggregation**: Collect keyword information (search volume, ranking, etc.) from multiple e-commerce sources (e.g., Amazon, eBay, Etsy).  
   - **Trend Detection**: Analyze historical data to highlight changes in keyword popularity.  
   - **Recommendations**: Provide insights or suggestions for product listings, categories, or related terms.

2. **Nuxt 3 + PrimeVue**  
   - **Nuxt 3** for building a modern, SSR-friendly Vue.js application.  
   - **PrimeVue** for streamlined UI components (e.g., PrimeDataTable, PrimeChart, PrimeDialog, PrimeToast).

3. **Data Visualization & Dashboards**  
   - Display charts or graphs to show keyword trends over time (using PrimeChart components).  
   - Interactive tables sorted by search volume, competition level, etc.  
   - Filter and search functionality to let users drill down on specific terms or categories.

4. **User Management (Optional)**  
   - **Clerk** integration (or Supabase Auth) for user sign-up, login, and session handling.  
   - Personalize dashboards or saved keyword lists for each user.  
   - Restrict certain features (advanced analytics) to authenticated or premium users.

5. **Database & Serverless Functions**  
   - **Supabase** as the backend to store:
     - Collected keyword data (search volumes, categories, timestamps, etc.).  
     - User preferences, saved searches, or analytics reports.  
   - API routes in Nuxt 3 (under `server/`), or direct calls to Supabase from the client where appropriate.

6. **Scheduled Tasks & Updates**  
   - Potentially use Supabase Edge Functions or external cron jobs to periodically scrape or fetch new keyword data.  
   - Automatically refresh the data and update the trending insights for end users.

7. **UI/UX Enhancements**  
   - **Real-Time Updates**: Optionally use Supabase's real-time capabilities to reflect data changes without manual page refresh.  
   - **Responsive Design**: Ensure the analytics dashboard is accessible on mobile, tablet, and desktop.  
   - **Animations**: Use PrimeVue animations for smooth transitions and interactions.
   - **Icons**: Use Lucide icons.
8. **Multi-Language Support**
   - Support Vietnamese and English.
   - Use i18n for multi-language support.
   - Path locales: `locales/vi.json` and `locales/en.json`
9. **SEO**
   - Use `useHead` to set meta tags for SEO.
   - Path locales: `locales/vi.json` and `locales/en.json`
   - Example: `pages/auth/user-register.vue`
   - Example: `pages/auth/user-login.vue`
---

# Relevant Docs

- **Nuxt 3**  
  [Nuxt 3 Documentation](https://nuxt.com/docs/getting-started/introduction)  
  Understand how to set up pages, server routes, and environment variables.

- **PrimeVue**  
  [PrimeVue Documentation](https://primevue.org/introduction)  
  Learn how to install PrimeVue in Nuxt 3, work with layout grids, theming, and create modern UI components.

- **Supabase**  
  [Supabase Docs](https://supabase.com/docs)  
  Learn about setting up Postgres tables, real-time features, edge functions, and integrating with Nuxt server routes.

- **Clerk**  
  [Clerk Docs](https://clerk.com/docs)  
  For implementing user authentication, managing sign-ups, and controlling access to personalized features.

---

# Current File Structure  (You HAVE TO follow this structure below)
├─ .nuxt/
├─ node_modules/
├─ plugins/
│  ├─ supabaseClient.ts
│  └─ primevue.ts
├─ prisma/
│  └─ schema.prisma
├─ public/
├─ pages/
│  ├─ index.vue
├─ layouts/
│  ├─ default.vue
├─ components/
│  ├─ HelloWorld.vue
├─ requirements/
│  └─ frontend_instructions.md
├─ server/
│  ├─ plugins/
│  │  └─ prisma.ts
│  └─ tsconfig.json
├─ stores/
├─ utils/
├─ assets/
├─ .env
├─ .gitignore
├─ app.vue
├─ LICENSE
├─ nuxt.config.ts
├─ package.json
├─ README.md
├─ tailwind.config.js
├─ tsconfig.json
└─ yarn.lock

# Rules
- All new components should be placed in the `components` folder.
- All new pages should be placed in the `pages` folder.
- All new layouts should be placed in the `layouts` folder.
- All new plugins should be placed in the `plugins` folder.
- All new server routes should be placed in the `server` folder.
- All new environment variables should be placed in the `.env` file.
- All new utils should be placed in the `utils` folder.
- All new stores should be placed in the `stores` folder.
- All new assets should be placed in the `assets` folder.
- All new prisma models should be placed in the `prisma` folder.
- Prisma schema file should be placed in the `prisma` folder example: `prisma/users.prisma`