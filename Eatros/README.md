# Eatro

Eatro is a modern, comprehensive food delivery ecosystem built with the latest web technologies. It is designed to connect hungry users with their favorite restaurants while providing efficient tools for restaurant managers and delivery agents.

## 🚀 Features

Eatro offers three distinct portals tailored to different roles in the food delivery lifecycle:

### 👤 User Portal (`/user`)
- **Restaurant Discovery**: Browse a wide variety of restaurants.
- **Seamless Ordering**: Easy-to-use interface for adding items to cart and placing orders.
- **Order Tracking**: Real-time updates on order status.
- **Account Management**: Profile and settings customization.

### 🍽️ Restaurant Portal (`/restaurant`)
- **Dashboard**: Overview of restaurant performance and active orders.
- **Menu Management**: Tools to add, update, or remove menu items.
- **Order Management**: Accept, prepare, and dispatch orders.
- **Settings**: Configure restaurant details and operating hours.

### 🚚 Delivery Agent Portal (`/agent`)
- **Task Dashboard**: View available delivery tasks and earnings.
- **Order Pickup & Delivery**: Step-by-step guidance for fulfilling orders.
- **Earnings Tracker**: Monitor income and performance.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [GSAP](https://gsap.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Components**: [Radix UI](https://www.radix-ui.com/) (Popover)
- **Feedback**: [React Hot Toast](https://react-hot-toast.com/)
- **Carousel**: [Swiper](https://swiperjs.com/)

## 🏁 Getting Started

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/eatro.git
    cd eatro
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    # or
    pnpm install
    # or
    bun install
    ```

3.  **Run the development server:**
    ```bash
    npm run dev
    ```

4.  **Open the app:**
    Visit [http://localhost:3000](http://localhost:3000) in your browser. The landing page acts as a splash screen redirecting to the authentication flow.

## 📂 Project Structure

```bash
Eatro/
├── app/
│   ├── agent/       # Delivery agent features
│   ├── auth/        # Authentication (Login/Signup)
│   ├── restaurant/  # Restaurant management features
│   ├── user/        # Customer features
│   ├── globals.css  # Global styles and Tailwind imports
│   └── page.jsx     # Landing page / Entry point
├── components/      # Shared UI components
├── public/          # Static assets
└── package.json     # Project dependencies and scripts
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
