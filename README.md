# CINACT Dashboard

A responsive and scalable dashboard application built for educational institution management. Developed a responsive and scalable CINACT Dashboard using Next.js, TypeScript, and Tailwind CSS. Integrated REST APIs for dynamic data management and implemented real-time communication using Socket.IO. Integrated LiveKit for real-time audio/video communication, with a focus on performance, responsive UI, and maintainable architecture.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI, shadcn/ui
- **State Management**: React Hooks, Context API
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with custom Fetch wrapper
- **Real-time**: Socket.IO Client
- **Video/Audio**: LiveKit Client
- **Charts**: Chart.js + react-chartjs-2
- **Date Handling**: date-fns, dayjs, moment
- **Rich Text Editor**: Jodit React
- **PDF Generation**: jsPDF
- **Animation**: GSAP
- **Package Manager**: Yarn 4 (Berry)

## Features

### Role-Based Access Control
- **Super Admin** (`su_admin`): Full system access - dashboard, student management, course management, user management, attendance, finance, events, chats, community, settings
- **Teacher/Tutor** (`tutor`): Teaching dashboard - overview, my courses, attendance, chats, settings
- **Finance** (`finance`): Financial dashboard - overview, student management, finance & payments
- **Viewer** (`viewer`): Limited read-only access

### Core Modules

#### Admin Dashboard
- **Overview**: System statistics and analytics
- **Student Management**: CRUD operations, enrollment management, payment history
- **Course Management**: Courses, modules, classes, assignments, assets
- **User/Teacher Management**: Instructor CRUD, role assignment
- **Attendance Tracking**: Class attendance with QR code support
- **Finance & Payments**: Transaction management, payment stats, manual payments
- **Events**: Event creation, management, member tracking
- **Community**: Posts, announcements, polls, moderation
- **Chats**: Real-time messaging with Socket.IO
- **System Settings**: Profile, password change

#### Teacher Dashboard
- **Overview**: Teaching statistics
- **My Courses**: Course details, classes, students
- **Attendance**: Class attendance marking
- **Chats**: Real-time communication with students
- **Settings**: Profile management

#### Finance Dashboard
- **Overview**: Financial metrics
- **Student Management**: Student enrollment and payment status
- **Finance & Payments**: Transaction processing, payment tracking

### Real-time Features
- **Socket.IO Integration**: Real-time messaging, typing indicators, presence, read receipts
- **LiveKit Integration**: Audio/video calling capabilities
- **Chat System**: Conversations, groups, message status (sent/delivered/read)

### Additional Features
- Responsive design (mobile-first)
- Dark/Light theme support
- Toast notifications (react-hot-toast)
- Data tables with sorting, filtering, pagination
- File upload support
- PDF export
- Rich text editing
- Charts and analytics

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── (admin)/           # Admin dashboard routes
│   ├── (tutor)/           # Teacher dashboard routes
│   ├── (finance)/         # Finance dashboard routes
│   └── (auth)/            # Authentication pages
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── reusable/         # Shared components (Sidebar, Header, etc.)
│   ├── icons/            # Custom icons
│   └── providers/        # Context providers
├── config/               # Application configuration
│   ├── app.config.ts     # API endpoints, app metadata
│   └── menuItems.ts      # Role-based navigation config
├── service/              # API service layer
│   ├── user/             # User/auth services
│   ├── finance/          # Finance services
│   ├── chats/            # Chat services
│   └── tutor/            # Teacher services
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── Fetch.ts          # HTTP client wrapper
│   ├── Socket.ts         # Socket.IO client
│   └── utils.ts          # Helper functions
├── helper/               # Helper utilities
├── types/                # TypeScript type definitions
├── public/               # Static assets
└── middleware.ts         # Auth & role-based routing
```

## Getting Started

### Prerequisites
- Node.js 18+
- Yarn 4+

### Installation

```bash
# Install dependencies
yarn install

# Copy environment file
cp example.env.local .env.local

# Edit .env.local with your configuration
# NEXT_PUBLIC_API_ENDPOINT=http://your-api-url
# NEXT_PUBLIC_SOCKET_URL=http://your-socket-url
```

### Development

```bash
# Start development server with Turbopack
yarn dev

# Or using npm
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
# Production build
yarn build

# Start production server
yarn start
```

### Linting

```bash
yarn lint
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_ENDPOINT` | Backend API base URL | `http://127.0.0.1:4000` |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | Same as API endpoint + `/ws` |

## Default Login Credentials

### Admin
```
e-mail: admin@example.com
password: 12345678
```

### Teacher
```
e-mail: teacher@example.com
password: 12345678
```

### Finance
```
e-mail: finance@example.com
password: 12345678
```

## Docker Support

```bash
# Build image
docker build -t cinact-dashboard .

# Run container
docker run -p 3000:3000 cinact-dashboard

# Or use docker-compose
docker-compose up -d
```

## API Integration

The application uses a custom `Fetch` class (`lib/Fetch.ts`) that supports both Axios and native fetch adapters. All API calls are centralized in the `service/` directory with proper TypeScript typing.

### Authentication Flow
1. Login via `/auth/login` endpoint
2. JWT tokens stored in cookies (`token`, `accessToken`, `refreshToken`)
3. Middleware validates tokens and enforces role-based routing
4. Automatic token validation on protected routes

### Real-time Communication
- Socket.IO connection established via `lib/Socket.ts`
- Events: `message:new`, `message:status`, `typing`, `presence:update`, `call:incoming`, `call:ended`
- Conversation rooms for targeted message delivery

## Deployment

### Vercel (Recommended)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy

### Docker
```dockerfile
# Build
docker build -t cinact-dashboard .

# Run
docker run -d -p 3000:3000 --env-file .env.local cinact-dashboard
```

## Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## License

This project is proprietary software for CINACT educational platform.