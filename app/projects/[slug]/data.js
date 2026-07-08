// Shared project data — used by both the server component (generateMetadata)
// and the client component (interactive detail view). Kept as plain data
// with no React/client-only imports so it can be safely imported from
// a Server Component.

const projects = {
  "navicore-software": {
    name: "Navicore Software",
    tagline: "The software company I founded — custom engineering, direct delivery, no middlemen.",
    img: "/projects/navicore-software.png",
    live: "https://software.navicore.co",
    code: null,
    overview:
      "Navicore Software builds custom mobile apps, web platforms, backend systems, and automation solutions for clients in Bangladesh and internationally. Every project is handled directly by me from architecture to deployment — no middlemen, no handoffs. I also founded and lead engineering for RailMate Bangladesh, a live Android railway companion app built for over 10 million potential passengers.",
    features: [
      "Custom mobile app development with React Native and Expo for Android and iOS",
      "Web platform engineering with Next.js — SSR, SSG, and App Router patterns",
      "Backend API development with Node.js, Express, and Supabase",
      "RailMate Bangladesh — live railway companion app with real-time schedule data",
      "Direct client delivery: architecture, development, and deployment handled by one engineer",
      "International client delivery alongside domestic Bangladeshi projects",
    ],
    tech: {
      frontend: ["React Native", "Next.js", "React", "Expo"],
      backend: ["Node.js", "Express", "Python"],
      database: ["Supabase (PostgreSQL)", "MongoDB"],
      auth: ["JWT", "Supabase Auth"],
    },
    challenges: [
      "Delivering production-grade systems solo while maintaining direct communication with each client",
      "Building RailMate Bangladesh to handle real-time schedule data reliably for a high-potential user base",
      "Scaling service quality across multiple active client engagements simultaneously",
    ],
    solutions: [
      "Defined strict project scopes upfront; documented architecture decisions so handoff or future maintenance is unambiguous",
      "RailMate uses a background sync service to pull and cache schedule data, keeping the app fast even on low-bandwidth connections",
      "Sequenced project timelines to avoid context-switching between active builds; each project has a dedicated focus period",
    ],
    future: [
      "Expand RailMate Bangladesh to cover all BD Railway routes and add live delay tracking",
      "Grow Navicore's client base in Southeast Asia and the UK",
      "Launch a second product under Navicore targeting Bangladeshi SMB operations",
    ],
  },
  "devfolio-analyzer": {
    name: "DevFolio Analyzer",
    tagline: "GitHub profile intelligence — deterministically scored, AI-augmented, and structured.",
    img: "/projects/devfolio-analyzer.png",
    live: "https://devfolioanalyzer.vercel.app/",
    code: "https://github.com/najmulcodes/devfolio-analyzer",
    overview:
      "Connects the GitHub REST API with Anthropic Claude to evaluate developer profiles across contribution consistency, repository quality, tech breadth, and documentation depth. Scoring is deterministic and decoupled from the AI layer — a stable numeric score is computed first, then Claude generates qualitative feedback on top of it. This ensures the dashboard renders correctly regardless of model response variance. Authenticated users get a persistent analysis history; guest mode allows instant evaluation without signup.",
    features: [
      "GitHub profile ingestion via REST API — repositories, stars, forks, commit cadence, language breakdown",
      "Deterministic scoring (0–100) across contribution consistency, tech breadth, documentation quality, and profile completeness",
      "Claude API integration constrained by a structured system prompt — AI output is schema-validated before reaching the frontend",
      "Guest mode for instant analysis without authentication",
      "Persistent analysis history per authenticated user, stored in MongoDB",
      "Interactive dashboard with KPI cards, score trends, and improvement recommendations",
    ],
    tech: {
      frontend: ["React 18", "React Router", "Recharts"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcryptjs"],
    },
    challenges: [
      "LLM output inconsistency — Claude responses varied in structure when prompts were underspecified, breaking frontend render logic",
      "GitHub API rate limits — unauthenticated requests cap at 60/hr, causing failures for users with large profiles",
      "Scoring subjectivity — defining what makes a 'strong' profile required iterating on evaluation criteria with real test accounts",
    ],
    solutions: [
      "Enforced a strict JSON schema in the system prompt with fallback defaults for missing fields; added a validation layer before the response reaches the frontend",
      "Implemented optional GitHub OAuth token pass-through for authenticated calls (5,000 req/hr), with per-user token caching in session",
      "Separated deterministic scoring logic from the AI layer entirely — the score is computed server-side first; Claude only sees the structured data, not raw API output",
    ],
    future: [
      "Repository-level language and contribution breakdown per project",
      "Side-by-side profile comparison against role-specific baselines (junior/mid/senior)",
      "Webhook-triggered re-analysis on new GitHub pushes",
    ],
  },

  livecollab: {
    name: "LiveCollab",
    tagline: "Shared Kanban state across all connected clients — no polling, no refresh.",
    img: "/projects/livecollab.png",
    live: "https://livecollab-rho.vercel.app/",
    code: "https://github.com/najmulcodes/livecollab-client",
    overview:
      "Board operations — card moves, column reorders, member presence — propagate via Socket.IO events scoped per workspace room. Drag-and-drop is optimistically applied locally on the originating client and reconciled against the server's authoritative state on broadcast; other clients update silently without re-fetch. Workspace access is enforced at socket handshake: JWT is verified and membership is checked against MongoDB before any room join is admitted. Zustand manages local board state with selector-based subscriptions to prevent unnecessary re-renders on unrelated updates.",
    features: [
      "Bidirectional Socket.IO events for card movement, creation, deletion, and column reorder — all reflected live across sessions",
      "Optimistic local state with server reconciliation on conflict — last server-confirmed state wins",
      "Live presence indicators — per-user status visible to all workspace members in real time",
      "Invite-code workspace onboarding — no email verification required to join a team",
      "Timestamped activity log persisted to MongoDB — full audit trail of board actions",
      "JWT auth at socket handshake level — room access is gated before any event is processed",
    ],
    tech: {
      frontend: ["React 18", "Vite", "Tailwind CSS", "Zustand", "React Query", "@dnd-kit"],
      backend: ["Node.js", "Express", "Socket.IO"],
      database: ["MongoDB", "Mongoose"],
      auth: ["JWT", "bcrypt"],
    },
    challenges: [
      "Race conditions on simultaneous drag events from multiple clients targeting the same card position",
      "Socket room authentication — ensuring users can only emit and receive events for workspaces they belong to",
      "Zustand store hydration on socket reconnect — stale local state after a dropped connection",
    ],
    solutions: [
      "Server processes drag events sequentially per workspace; broadcasts the authoritative position to all clients including the originator, who discards their optimistic state if it differs",
      "JWT is verified on every socket handshake; room join is gated behind a workspace membership check against MongoDB before the socket is admitted to the room",
      "On reconnect, the client fetches a full board snapshot via REST then re-subscribes to socket events — socket events only handle deltas after initial hydration",
    ],
    future: [
      "Card assignment with per-user task filtering across workspaces",
      "Rich-text card descriptions with inline comment threads and @mentions",
      "Redis pub/sub adapter for horizontal Socket.IO scaling across multiple Node instances",
    ],
  },

  "petcare-system": {
    name: "Whisker Dairy — PetCare System",
    tagline: "Health tracking and time-based reminder system for managing pet care.",
    img: "/projects/petcare.png",
    live: "https://whiskerdairy.vercel.app//",
    code: "https://github.com/najmulcodes/petcare",
    overview:
      "A full-stack system that converts pet health data into actionable states and automated reminders using scheduling logic and notification workflows. Pet records (vaccines, medications, feeding times) are classified server-side into overdue, due-today, and upcoming states. The frontend dashboard aggregates these states per pet and surfaces them as prioritized action items. Browser push notifications are delivered via the Web Push API and Service Workers, with timezone-aware scheduling to ensure reminders fire at the correct local time.",
    features: [
      "Health classification engine — server-side state resolution into overdue, due-today, and upcoming categories per pet record",
      "Time-based reminder system for vaccines, medication schedules, and feeding times with configurable intervals",
      "Browser push notifications via Service Workers and Web Push API with timezone-aware scheduling",
      "Pet profile management with image upload support via Supabase Storage",
      "Dashboard aggregation view showing health status across all registered pets at a glance",
      "REST API backend with Supabase as the persistent data layer; JWT-based auth for user isolation",
    ],
    tech: {
      frontend: ["React", "Tailwind CSS", "Vite"],
      backend: ["Node.js", "Express.js", "Supabase"],
      database: ["Supabase (PostgreSQL)"],
      auth: ["JWT", "Supabase Auth"],
    },
    challenges: [
      "Timezone accuracy — push notification scheduling had to account for the user's local timezone rather than the server's UTC offset",
      "Service Worker lifecycle — the SW needed to handle push events even when the browser tab was closed or backgrounded",
      "State classification correctness — health states (overdue vs due-today) depended on precise date comparisons that needed to be consistent between server and client",
    ],
    solutions: [
      "Stored all schedule times as UTC in the database; the client sends its timezone offset at registration, and the server computes the correct UTC delivery time for each push subscription",
      "Implemented a persistent SW registration pattern that re-subscribes on app load; tested background push delivery across Chrome and Firefox",
      "Centralized date comparison logic into a shared utility module used by both the API routes and the frontend display layer — single source of truth for state resolution",
    ],
    future: [
      "Vet appointment scheduling with calendar integration and reminder escalation",
      "Multi-pet household support with shared access for family members",
      "Health history export as a PDF report for vet visits",
    ],
  },

  "microtask-platform": {
    name: "MicroTask Platform",
    tagline: "Three-sided task marketplace with server-enforced lifecycle and Stripe disbursement.",
    img: "/projects/microtask.png",
    live: "https://microtask-client-iota.vercel.app",
    code: "https://github.com/najmulcodes/microtask-client",
    overview:
      "Worker, Buyer, and Admin each operate in a role-scoped dashboard with context-appropriate data fetching and navigation. Task status transitions — draft → published → submitted → approved/rejected → paid — are validated server-side on every mutation; the client cannot skip states by crafting direct API calls. Stripe payment credits are triggered by webhook confirmation, not client callback, preventing double-credit on network retries. JWT payloads carry the user role; all API routes validate the claim before processing.",
    features: [
      "Full task lifecycle enforced at the API layer — status transitions validated server-side, not client-driven",
      "Stripe webhook-based payment confirmation — worker balances credited only after event verification",
      "Separate dashboard UX per role: Worker, Buyer, Admin — each with role-scoped data fetching",
      "Submission approval workflow with optional rejection reason returned to the worker",
      "Admin dispute resolution panel with override capability on approved/rejected outcomes",
      "Idempotency key check on webhook handler — already-processed events are logged and skipped",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Preventing double payment on network retry when Stripe webhooks arrive out of order",
      "Keeping three separate frontend experiences maintainable without significant code duplication",
      "Role changes needing to reflect immediately without forcing re-login",
    ],
    solutions: [
      "Stripe webhook handler checks an idempotency key before processing; already-handled events are logged and exited early",
      "Dashboard layouts share a common shell component; only the data-fetching hooks and route guards differ per role",
      "On role change, a silent token refresh endpoint issues a new JWT with the updated role claim; the frontend swaps the stored token without redirecting",
    ],
    future: [
      "Escrow model — Buyer funds locked on task post, released on worker approval",
      "Worker reputation scoring based on approval rate and dispute history",
      "Task category browsing with skill-tag and budget-range filtering",
    ],
  },

  "badar-uddin-welfare": {
    name: "Badar Uddin Welfare",
    tagline: "Production charity system — live deployment for a real Bangladeshi NGO.",
    img: "/projects/badaruddin.png",
    live: "https://badaruddinwelfareorg.vercel.app/",
    code: "https://github.com/najmulcodes/badaruddinwelfare-client",
    overview:
      "Deployed for active organizational use by the Badar Uddin Bepari Welfare Organization in Feni, Bangladesh. Handles the full donation lifecycle: member requests, three-tier admin review (superAdmin / admin / member), fund disbursement tracking, and beneficiary records. All role checks are enforced at the API route level — frontend guards are UI only. Cloudinary manages signed document uploads (receipts, ID files), keeping sensitive assets off the application server. OTP email verification via Brevo gates new registrations. The entire UI is in Bengali (Hind Siliguri), requiring deliberate font loading and spacing decisions.",
    features: [
      "Three-tier RBAC enforced server-side: superAdmin → admin → member with scoped API permissions",
      "Donation request workflow with status transitions: pending → under review → approved/rejected",
      "Cloudinary signed upload presets for receipts and supporting documents",
      "OTP email verification at registration via Brevo API to reduce fraudulent accounts",
      "Full Bengali-language UI with Hind Siliguri font loading and consistent rendering across Android browsers",
      "Admin dashboard with fund summary, pending actions queue, and member activity log",
    ],
    tech: {
      frontend: ["React", "Vite"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Brevo sender verification required multiple iterations due to SPF/DKIM setup on a shared hosting environment",
      "Bengali font rendering inconsistency across Android browsers — some weights failed to load correctly",
      "Role enforcement needed to be airtight at the API layer — frontend-only guards are insufficient for a live organization",
    ],
    solutions: [
      "Configured a verified Brevo sender domain with full SPF and DKIM records; OTP emails now pass spam filters consistently",
      "Standardized on Hind Siliguri with explicit font-weight declarations and a CSS fallback stack that degrades cleanly on older devices",
      "All protected routes validate the decoded JWT role server-side before processing the request; frontend route guards handle UX only",
    ],
    future: [
      "Annual fund report generation as a downloadable PDF",
      "SMS notification fallback for beneficiaries without email access",
      "Audit log export for organizational accountability and external reporting",
    ],
  },

  "care.xyz": {
    name: "Care.xyz",
    tagline: "Caregiver booking with cascading location filters and middleware-level route protection.",
    img: "/projects/carexyz.png",
    live: "https://care-xyz-baby-sitting-elderly-care.vercel.app",
    code: "https://github.com/najmulcodes/Care.xyz---Baby-Sitting-Elderly-Care-Service-Platform",
    overview:
      "Service marketplace for booking childcare and elderly care providers across Bangladesh. Location filtering cascades across three administrative tiers — division → district → upazila — loading each tier's options lazily on parent selection. This avoids the performance cost of exposing thousands of upazila records on initial load while keeping the UX responsive. Route protection runs in Next.js middleware before page render; unauthenticated users never receive protected HTML. Pricing adjusts dynamically per service type and care duration.",
    features: [
      "Cascading location filter: Division → District → Upazila with lazy-loaded option sets per tier",
      "Dynamic pricing engine — base rate modified by service type, care duration, and location",
      "Firebase Authentication with Google OAuth and email/password providers",
      "Next.js middleware-based route protection — redirect at the edge before page HTML is served",
      "Service listings with availability status and caregiver profile pages",
    ],
    tech: {
      frontend: ["Next.js 14", "React"],
      backend: ["Firebase"],
      database: ["Firestore"],
      auth: ["Firebase Auth"],
    },
    challenges: [
      "Loading all upazila options upfront caused a 3–4 second render delay on low-end Android devices",
      "Firebase auth state hydration on hard refresh caused a flash of the unauthenticated layout before the redirect fired client-side",
    ],
    solutions: [
      "Switched to on-demand fetching per filter level — district options load only once a division is selected; each tier's dataset is small enough for a single fast fetch without pagination",
      "Auth state is read from a cookie set on login; Next.js middleware checks the cookie server-side before rendering, eliminating the client-side auth flash entirely",
    ],
    future: [
      "Real-time availability calendar per caregiver with booking slot management",
      "In-app messaging between booker and caregiver before booking confirmation",
      "Review and rating system accessible post-booking completion",
    ],
  },

  gatherly: {
    name: "Gatherly",
    tagline: "Community discovery platform with server-rendered listings and multi-provider auth.",
    img: "/projects/gatherly.png",
    live: "https://gatherly-navy.vercel.app/",
    code: "https://github.com/najmulcodes/gatherly",
    overview:
      "Built on Next.js 14 App Router with a deliberate Server/Client Component boundary: community and event listing pages render server-side for fast initial load, while auth-gated interactions (join buttons, create form, manage table) are isolated to Client Components to avoid shipping unnecessary JS for static content. NextAuth.js handles credential and Google OAuth flows, session persistence, and CSRF protection. The mobile-first layout was designed around 360px as the baseline viewport — the majority of the Bangladesh audience accesses the web on mid-range Android devices.",
    features: [
      "NextAuth.js with credentials provider and Google OAuth — session persisted via JWT strategy",
      "Server Component rendering for community and event listing pages — fast TTFB without client JS overhead",
      "Full-text search across community names, tags, and descriptions",
      "Mobile-first responsive layout — 360px viewport as design baseline",
      "Protected community creation form and manage-communities table behind NextAuth session guard",
      "Middleware-level route protection for /add-club and /manage-clubs routes",
    ],
    tech: {
      frontend: ["Next.js 14 (App Router)", "NextAuth.js v4", "Custom CSS"],
      backend: ["NextAuth Credentials + Google OAuth"],
      database: ["localStorage (demo)"],
      auth: ["NextAuth.js", "JWT sessions"],
    },
    challenges: [
      "NextAuth.js session not available in Server Components without explicit server-side session fetching",
      "localStorage used for some state — unavailable during SSR, causing hydration mismatches on initial render",
    ],
    solutions: [
      "Used getServerSession from next-auth/next in auth-gated Server Components; Client Components use the useSession hook — both patterns are consistent across the codebase",
      "Wrapped all localStorage reads in a useEffect with an isMounted guard; longer term this would move to cookie-based or database-backed storage",
    ],
    future: [
      "Replace localStorage with a Prisma + PostgreSQL backend for persistent community data",
      "Real-time RSVP counts with Socket.IO for live event attendance tracking",
      "Push notifications for upcoming gatherings in joined communities",
    ],
  },

  clubsphere: {
    name: "ClubSphere",
    tagline: "Club management with resource-level ownership enforcement and approval workflows.",
    img: "/projects/clubsphere.png",
    live: "https://clubsphere-client1.netlify.app/",
    code: "https://github.com/najmulcodes/clubsphere-client",
    overview:
      "Handles club membership and event logistics for organizations with multiple clubs under one platform. Membership requests go through an admin approval step before access is granted. Event operations are enforced at the resource level, not just role level — a club admin can only modify events they created, preventing cross-club interference. Ownership is stored as a denormalized creator ID on each event document, making the authorization check a single field comparison on read rather than a collection join.",
    features: [
      "Multi-step membership approval — request → admin review → grant/deny with optional reason",
      "Resource-level ownership enforcement: event mutations check creator ID server-side, not just user role",
      "Club-scoped event listings — members only see events from their joined clubs",
      "JWT auth with protected frontend routes and matching server-side API guards",
      "Denormalized creator ID on event documents — authorization check is O(1), no join required",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: ["JWT"],
    },
    challenges: [
      "Resource ownership checks required joining membership and event collections on every protected mutation, adding query complexity and latency",
    ],
    solutions: [
      "Denormalized the creator ID into the event document at write time; ownership check on mutation is a single field comparison — trades a small write overhead for significantly faster read-time authorization",
    ],
    future: [
      "Event attendance tracking with QR code check-in for physical events",
      "Club analytics dashboard — member growth over time and event attendance rate",
    ],
  },

  bookhub: {
    name: "BookHub",
    tagline: "Book catalog with optimistic UI updates and consistent REST API design.",
    img: "/projects/bookhub.png",
    live: "https://bookhub-heaven.surge.sh",
    code: "https://github.com/najmulcodes/bookhub-client",
    overview:
      "Built as a deliberate exercise in REST API fundamentals before adding complexity in later projects. Every endpoint returns a consistent response envelope (status, data, message); error responses include machine-readable codes alongside human-readable messages; all mutations return the updated resource rather than a generic success flag. Optimistic updates on the frontend keep the UI responsive — edits appear immediately and roll back cleanly from a pre-mutation snapshot if the API call fails.",
    features: [
      "Consistent API response envelope across all endpoints — predictable shape for every frontend consumer",
      "Optimistic UI updates with snapshot-based rollback on failure — no re-fetch, no stale data flash",
      "Search and filter by title, author, and genre",
      "Cover image management via URL-based storage",
      "Machine-readable error codes on all failure responses — frontend can differentiate error types without string parsing",
    ],
    tech: {
      frontend: ["React"],
      backend: ["Node.js", "Express"],
      database: ["MongoDB"],
      auth: [],
    },
    challenges: [
      "Ensuring rollback logic was reliable — a failed optimistic update that doesn't revert cleanly leaves the UI in a broken state that's difficult to recover from without a page reload",
    ],
    solutions: [
      "Stored pre-mutation state in a local variable before applying the optimistic update; the catch block restores from that snapshot rather than re-fetching — faster recovery and avoids a flash of stale server data",
    ],
    future: [
      "User authentication with personal reading lists and progress tracking",
      "ISBN lookup via Open Library API to auto-fill book metadata on add",
    ],
  },
};

export { projects };
