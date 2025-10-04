# 🌍 ChatLingo - Language Exchange Platform

ChatLingo is a modern, real-time language exchange platform that connects language learners worldwide through chat and video calls. Built with React, Node.js, and powered by Stream.io for seamless communication experiences.

## 🚀 Features

### Communication Features
- **Real-time Messaging**: Instant chat powered by Stream Chat SDK and Socket.io
- **Video Calling**: High-quality video calls using Stream Video SDK
- **Global Chat Room**: Community-wide chat for all users to connect
- **Language-Specific Chat Rooms**: Dedicated chat rooms for each learning language
- **Live Message Updates**: Real-time message synchronization without page refresh
- **Typing Indicators**: See when other users are typing in real-time
- **Message Management**: Delete your own messages with instant sync across all users

### User Features
- **User Authentication**: Secure signup/login with JWT tokens
- **User Onboarding**: Comprehensive profile setup with language preferences
- **Smart Friend Recommendations**: AI-powered matching based on language learning goals
- **Friend Request System**: Send, receive, and manage friend requests
- **Multi-language Support**: Support for various native and learning languages
- **Responsive Design**: Mobile-first design with sliding sidebar navigation

### Technical Features
- **Socket.io Integration**: Real-time bidirectional communication
- **Secure Authentication**: JWT-based auth with HTTP-only cookies
- **MongoDB Integration**: Robust data persistence with separate chat collections
- **Stream.io Integration**: Professional-grade chat and video infrastructure
- **Theme Support**: Dark/light mode with persistent preferences
- **Progressive Web App**: Optimized for mobile and desktop experiences

## � Real-Time Messaging Features

### Socket.io Integration
ChatLingo now features advanced real-time messaging capabilities powered by Socket.io:

#### **Global Chat Room** (`/global-chat`)
- Community-wide chat for all users regardless of learning language
- Real-time message synchronization across all connected users
- Instant message delivery without page refresh
- Live typing indicators showing who's currently typing
- Message deletion with real-time sync across all users
- Auto-scroll to latest messages

#### **Language-Specific Chat Rooms** (`/general-chat`)
- Dedicated chat rooms for each learning language (e.g., "Spanish Chat Room", "French Chat Room")
- Only users learning the same language can see and participate in each room
- Language validation - users must set their learning language to access
- Separate Socket.io rooms for isolation (e.g., "spanish-chat", "french-chat")
- Real-time messaging within language groups
- Dynamic room names based on user's learning language

#### **Technical Implementation**
- **Frontend**: Socket.io client connects to backend server
- **Backend**: Socket.io server manages room-based messaging
- **Database**: Separate MongoDB collections for global and language-specific messages
- **Security**: Server-side language validation and user authentication
- **Performance**: Efficient room-based message broadcasting

## �🛠️ Tech Stack

### Frontend

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **DaisyUI** - Beautiful UI components for Tailwind
- **React Query (TanStack Query)** - Server state management
- **Zustand** - Lightweight state management
- **Socket.io Client** - Real-time bidirectional communication
- **Axios** - HTTP client for API requests
- **Stream Chat React** - Chat UI components
- **Stream Video React SDK** - Video calling components
- **React Hot Toast** - Beautiful notifications
- **Lucide React** - Modern icon library

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **Socket.io** - Real-time WebSocket communication server
- **MongoDB** - NoSQL database with separate collections for different chat types
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **Stream Chat** - Chat backend infrastructure
- **Cookie Parser** - HTTP cookie parsing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### External Services
- **Stream.io** - Chat and video infrastructure
- **MongoDB Atlas** - Cloud database hosting
- **Avatar API** - Random avatar generation

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB Atlas account** (or local MongoDB installation)
- **Stream.io account** for chat and video services

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/amansingh4012/ChatLingo.git
cd ChatLingo
```

### 2. Environment Setup

Create environment files for both backend and frontend. See the `.env.example` files for required variables.

**Backend Environment Variables:**
```bash
# Navigate to backend directory
cd backend
# Copy and configure environment file
cp .env.example .env
```

**Frontend Environment Variables:**
```bash
# Navigate to frontend directory
cd ../frontend
# Copy and configure environment file
cp .env.example .env
```

### 3. Install Dependencies

**Option 1: Install all dependencies at once (from root directory)**
```bash
npm run build
```

**Option 2: Install individually**
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 4. Start Development Servers

**Backend Server:**
```bash
cd backend
npm run dev
```
The backend will start on `http://localhost:5001`

**Frontend Server:**
```bash
cd frontend
npm run dev
```
The frontend will start on `http://localhost:5173`

### 5. Production Build

**Build for production:**
```bash
# From root directory
npm run build
```

**Start production server:**
```bash
npm start
```

## 📱 Application Flow

### User Journey
1. **Sign Up/Login** - Create account or login with existing credentials
2. **Onboarding** - Complete profile with:
   - Full name and bio
   - Native language
   - Learning language
   - Location
3. **Home Dashboard** - View friends and discover new language partners
4. **Friend Requests** - Send/receive friend requests
5. **Chat** - Real-time messaging with friends
6. **Video Calls** - High-quality video conversations

### Key Pages
- **HomePage** (`/`) - Friends list and user recommendations
- **ChatPage** (`/chat/:id`) - Real-time messaging interface with friends
- **GlobalChatPage** (`/global-chat`) - Community-wide chat room for all users
- **LanguageChatPage** (`/general-chat`) - Language-specific chat rooms (e.g., Spanish Chat Room)
- **CallPage** (`/call/:id`) - Video calling interface
- **FriendsPage** (`/friends`) - Dedicated friends management page
- **NotificationsPage** (`/notifications`) - Friend request management
- **OnboardingPage** (`/onboarding`) - Initial profile setup
- **LoginPage** (`/login`) - User authentication
- **SignUpPage** (`/signup`) - User registration

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
```
POST /signup        # User registration
POST /login         # User authentication
POST /logout        # User logout
POST /onboard       # Complete user onboarding
```

### User Routes (`/api/users`)
```
GET /recommended    # Get recommended users
GET /friends        # Get user's friends
GET /friend-requests # Get incoming friend requests
GET /outgoing-requests # Get outgoing friend requests
POST /friend-request/:id # Send friend request
PUT /friend-request/:id  # Accept friend request
```

### Chat Routes (`/api/chat`)
```
GET /token          # Get Stream chat token
```

### Global Chat Routes (`/api/global-chat`)
```
GET /messages       # Get global chat messages
POST /messages      # Send global chat message
DELETE /messages/:id # Delete own global chat message
```

### Language Chat Routes (`/api/language-chat`)
```
GET /messages       # Get language-specific chat messages
POST /messages      # Send language-specific chat message
DELETE /messages/:id # Delete own language-specific message
```

## 🏗️ Project Structure

```
ChatLingo/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Custom middleware
│   │   ├── lib/           # Utility functions
│   │   └── server.js      # Entry point
│   ├── .env               # Environment variables
│   └── package.json       # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── store/        # State management
│   │   └── constants/    # App constants
│   ├── .env              # Environment variables
│   └── package.json      # Frontend dependencies
├── package.json          # Root package.json
└── README.md            # Project documentation
```

## 🔒 Security Features

- **JWT Authentication** with HTTP-only cookies
- **Password Hashing** using bcryptjs
- **CORS Protection** for cross-origin requests
- **Environment Variables** for sensitive data
- **Input Validation** on both client and server
- **Secure Cookie Settings** for production

## 🌟 Key Components

### Frontend Components
- **Layout** - Main application layout with sliding sidebar navigation
- **Navbar** - Navigation with hamburger menu and theme selector
- **Sidebar** - Sliding navigation with dynamic language chat room names
- **GlobalChatPage** - Community-wide real-time chat interface
- **LanguageChatPage** - Language-specific real-time chat rooms
- **FriendCard** - User card component with language badges
- **CallButton** - Initiates video calls
- **ChatLoader** - Loading states for chat
- **ThemeSelector** - Dark/light mode toggle

### Backend Models
- **User Model** - User schema with authentication methods and language preferences
- **FriendRequest Model** - Friend request management
- **GlobalChat Model** - Global chat message storage with soft deletion
- **LanguageChat Model** - Language-specific chat messages with language filtering

### Custom Hooks
- **useAuthUser** - Authentication state management
- **useLogin/useSignUp/useLogout** - Authentication operations
- **useSidebarStore** - Zustand store for sidebar state management

## 🎨 UI/UX Features

- **Responsive Design** - Works on all device sizes
- **Dark/Light Theme** - User preference with persistence
- **Loading States** - Smooth loading animations
- **Toast Notifications** - User feedback for actions
- **Modern Icons** - Lucide React icon library
- **Beautiful Gradients** - Modern visual design
- **Accessibility** - WCAG compliant components

## 🔧 Configuration

### Stream.io Setup
1. Create a Stream.io account
2. Get your API Key and Secret
3. Add them to your environment variables
4. The app handles user creation and token generation automatically

### MongoDB Setup
1. Create a MongoDB Atlas cluster
2. Get your connection string
3. Add it to your backend environment variables
4. The app handles database connection and schema creation

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions including:
- Local development setup
- Production deployment
- Platform-specific guides (Vercel, Netlify, Heroku, etc.)
- Environment configuration
- Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is created for educational and study purposes. It is a portfolio/learning project to demonstrate web development skills and modern technology implementation. Feel free to use it as a reference for your own learning journey.

## 👨‍💻 Author

**Aman Kumar Singh**
- GitHub: [@amansingh4012](https://github.com/amansingh4012)
- Project Link: [ChatLingo](https://github.com/amansingh4012/ChatLingo)

## 🙏 Acknowledgments

- **Stream.io** for providing excellent chat and video infrastructure
- **MongoDB Atlas** for reliable database hosting
- **Vercel/Netlify** for deployment platforms
- **Avatar Iran** for random avatar generation
- The open-source community for amazing tools and libraries


**Happy Language Learning! 🌍💬**
