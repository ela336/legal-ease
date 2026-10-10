# LegalEase - Online Lawyer Hiring Platform

LegalEase is a full-stack marketplace that connects clients and businesses with
talented lawyers. Clients browse, hire and pay lawyers online, lawyers publish
and manage their legal services, and an admin oversees users, listings,
transactions and platform analytics.

## Live Links


 **Live site** -> https://legal-ease-eight-sage.vercel.app
 
## Purpose

Traditional legal hiring is mostly limited to law firms and physical
consultations. LegalEase makes legal help easier to reach: users can discover
lawyers, compare fees and availability, and hire securely online, while
emerging lawyers can reach new clients and manage their services in one place.

## How It Works

1. A visitor browses lawyers, filters by specialization, fee and availability, and opens a profile.
2. A **client** registers, sends a hiring request and waits for the lawyer's decision.
3. The **lawyer** reviews requests in their dashboard and accepts or rejects them.
4. Once accepted, the client pays the consultation fee through Stripe and the request shows **Paid**.
5. A client with an accepted hire can comment on the lawyer's profile.
6. The **admin** manages users and roles, moderates lawyer listings, and reviews transactions and analytics.

## Key Features

**Authentication and security**
- Email/password and Google sign-in (Better Auth)
- Role selection at registration: Client or Lawyer (admins are promoted in the database)
- Role-based dashboards for Client, Lawyer and Admin
- JWT-secured API calls, with the user's role checked on the server for every protected route
- Protected dashboard routes that survive page reloads

**Public pages**
- Home page with an animated hero slider, featured lawyers, top legal experts and a legal categories grid
- Browse Lawyers with search, category filter, fee range, availability filter, sorting and pagination
- Skeleton loaders, friendly empty states and error handling
- Lawyer details page with a hire confirmation modal and a comments section
- About, Contact and Privacy Policy pages, plus a footer with quick links, social icons and a newsletter form

**Client dashboard**
- Profile overview and profile update (name and photo)
- Hiring history with pending, accepted and rejected statuses
- Stripe payment after a lawyer accepts, with a disabled "Paid" state
- Comment management (edit and delete)
- Transaction history

**Lawyer dashboard**
- Create, edit and delete legal profiles with imgBB photo upload
- Toggle availability (Available / Busy) and publish or unpublish a profile
- Accept or reject hiring requests
- Earnings and transaction history

**Admin dashboard**
- Manage users: change roles and delete accounts
- Manage lawyer listings: publish, unpublish and delete
- View all transactions
- Analytics with stat cards and charts (users, lawyers, hires, revenue)

**Experience**
- Comments restricted to clients with an accepted hire, verified against the hiring record on the server
- Framer Motion animations (hero fade-in, staggered card reveal, hover effects)
- Responsive layout with a mobile menu and a slide-in dashboard sidebar
- Custom loading page, 404 page, error boundary and toast notifications

##  Technologies Used

- Next.js
- React
- Tailwind CSS
- DaisyUI
- Express.js
- MongoDB
- Better Auth
- JWT
- Vercel











## Test Payments

Payments run in Stripe test mode. Use the card `4242 4242 4242 4242` with any
future expiry date and any 3-digit CVC.

