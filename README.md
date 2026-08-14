# 🏠 Tharel Homes & Apartments Ltd

> A modern real estate & hospitality platform for property buyers, realtors, hotel operators, and administrators.

---

## 🔍 What It Is About

**Tharel Homes** is an enterprise real estate and short-let accommodation platform designed to connect property buyers, sales agents, hotel/apartment managers, and system administrators into one seamless digital marketplace.

---

## 👥 Who It Is For

- 🏠 **Property Buyers**: Individuals looking to buy, rent, or book short-let properties with direct WhatsApp agent contact, inspection scheduling, and saved favorites.
- 🏢 **Realtors**: Real estate agents and agencies managing property listings, tracking client leads, and managing subscription tiers.
- 🏨 **Hotel & Short-Let Operators**: Hospitality managers overseeing room availability, suite inventories, guest reservations, and check-in status.
- ⚡ **Administrators**: Platform managers overseeing user accounts, moderating listings, and handling customer inquiries.

---

## ⚙️ How The Platform Works

1. **Multi-Role Registration & Onboarding**: Users sign up and select their role (Buyer, Realtor, Hotel Operator). Tailored onboarding questionnaires personalize their experience.
2. **Property & Short-Let Discovery**: Buyers search verified properties with filters (price, location, type, amenities) and view rich photo galleries.
3. **Direct Contact & Inspections**: Buyers can message listing owners directly on WhatsApp or schedule physical or virtual property inspection tours.
4. **Listing & Reservation Management**:
   - **Realtors** publish and update property listings with media upload support.
   - **Hotel Operators** manage room suites, accept guest reservations, and update booking statuses.
5. **Role-Based Portals**: Dedicated dashboards for Buyers, Realtors, Hotel Managers, and System Admins to manage their activities.

---

## 🛠️ Tech Stack

- **Next.js 16** (App Router) & **React 19**
- **Custom CSS** & **Tailwind CSS v4**
- **Lucide React** (Icons)
- **Lenis** (Smooth Scrolling)
- **PWA Ready** (Progressive Web App support)

---

## 📁 Folder Structure

```
tharel-homes/
├── public/                   # Static assets, icons & PWA manifest
├── src/                      # Next.js App Router Source Code
│   ├── app/                  # Pages & Routes
│   │   ├── about/            # About Us page
│   │   ├── contact/          # Contact page with inquiry form
│   │   ├── dashboard/        # Role-based dashboards (admin, buyer, hotel, realtor)
│   │   ├── login/            # Authentication login page
│   │   ├── onboarding/       # Role-tailored onboarding questionnaires
│   │   ├── properties/       # Property catalog & detail views
│   │   ├── services/         # Platform services
│   │   ├── signup/           # Multi-role user registration
│   │   ├── layout.js         # Root layout with providers & smooth scroll
│   │   └── page.js           # Homepage
│   ├── components/           # UI components (Hero, Navbar, PropertyCard, PwaInstallPrompt, etc.)
│   └── lib/                  # Application utilities & data services
├── package.json              # Project dependencies & scripts
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)

### Setup & Run
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License

Developed for **The 10th Homes & Apartments Ltd**.