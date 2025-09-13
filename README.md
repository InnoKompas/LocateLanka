# LankaLocate 🇱🇰

**The most accurate Sri Lankan GN Division Data API for developers and businesses**

LankaLocate provides comprehensive, up-to-date Geographic Names (GN) division data for Sri Lanka through a modern REST API. Built for developers, trusted by businesses, and designed to power location-based applications with accurate administrative boundary data.

![LankaLocate Banner](https://via.placeholder.com/1200x400/3B82F6/FFFFFF?text=LankaLocate+-+Sri+Lankan+GN+Division+API)

## 🌟 Features

- **🗺️ Comprehensive Data**: 10,000+ verified GN divisions across all 25 districts
- **⚡ Lightning Fast**: Sub-100ms response times with global CDN
- **🔒 Secure**: Enterprise-grade security with API key authentication
- **📊 Developer Dashboard**: Real-time analytics, usage tracking, and API key management
- **🎯 Accurate**: Government-verified data with monthly updates
- **🌐 RESTful API**: Simple JSON responses with comprehensive documentation
- **📱 Modern UI**: Beautiful, responsive dashboard built with React + TypeScript

## 🚀 Quick Start

### For API Users

1. **Sign up** at [lankalocate.lk](https://lankalocate.lk)
2. **Get your API key** from the developer dashboard
3. **Start making requests**:

```javascript
// Get GN divisions by district
const response = await fetch('https://api.lankalocate.lk/v1/divisions?district=Colombo', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  }
});

const data = await response.json();
console.log(data);
```

### For Developers (Local Setup)

1. **Clone the repository**:
```bash
git clone https://github.com/InnoKompas/LocateLanka.git
cd lankalocate
```

2. **Install dependencies**:
```bash
# Install pnpm if you haven't already
npm install -g pnpm

# Install all dependencies
pnpm install
```

3. **Set up environment variables**:
```bash
# Client (.env)
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id

# Server (.env)
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lankalocate
JWT_ACCESS_SECRET=your_JWT_ACCESS_SECRET
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. **Start development servers**:
```bash
# Start both client and server
pnpm dev

# Or start individually
pnpm dev:client  # Frontend (port 5173)
pnpm dev:server  # Backend (port 5000)
```

## 📁 Project Structure

```
lankalocate/
├── client/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── ui/         # Base UI components (Button, Card, Input, etc.)
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── dashboard/  # Dashboard-specific components
│   │   │   └── landing/    # Landing page sections
│   │   ├── pages/          # Application pages
│   │   │   ├── auth/       # Sign in/up pages
│   │   │   └── dashboard/  # Dashboard pages
│   │   ├── hooks/          # Custom React hooks
│   │   ├── services/       # API service layer
│   │   ├── contexts/       # React contexts (Theme, Auth)
│   │   └── utils/          # Utility functions
│   ├── public/             # Static assets
│   └── dist/               # Production build
│
├── server/                 # Node.js + Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # Database models
│   │   ├── middleware/     # Express middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Server utilities
│   └── dist/               # Compiled TypeScript
│
├── docs/                   # Documentation
└── README.md               # This file
```

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **State Management**: React Query + Context API
- **Authentication**: Google OAuth + JWT
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js + TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT + Google OAuth
- **Validation**: Zod
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI

### DevOps & Tools
- **Package Manager**: pnpm
- **Code Quality**: ESLint + Prettier
- **Git Hooks**: Husky
- **Deployment**: Docker + Docker Compose
- **CI/CD**: GitHub Actions

## 🔧 Development

### Prerequisites
- Node.js 18+ 
- pnpm 8+
- MongoDB 6+
- Git

### Available Scripts

```bash
# Development
pnpm dev                    # Start both client and server
pnpm dev:client            # Start frontend only
pnpm dev:server            # Start backend only

# Building
pnpm build                 # Build both client and server
pnpm build:client          # Build frontend only
pnpm build:server          # Build backend only

# Testing
pnpm test                  # Run all tests
pnpm test:client           # Run frontend tests
pnpm test:server           # Run backend tests

# Linting & Formatting
pnpm lint                  # Lint all code
pnpm lint:fix              # Fix linting issues
pnpm format                # Format code with Prettier

# Database
pnpm db:seed               # Seed database with sample data
pnpm db:migrate            # Run database migrations
```

### Code Style

We use ESLint and Prettier for consistent code formatting. The configuration includes:
- TypeScript strict mode
- React best practices
- Tailwind CSS class sorting
- Import organization

### Git Workflow

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Create** a Pull Request

## 🎨 UI Components

LankaLocate includes a comprehensive design system with reusable components:

### Base Components
- `Button` - Various styles and sizes
- `Input` - Form inputs with validation
- `Card` - Content containers
- `Modal` - Dialog overlays
- `Badge` - Status indicators
- `Avatar` - User profile images
- `Tooltip` - Contextual help

### Authentication Components
- `AuthLayout` - Consistent auth page wrapper
- `GoogleAuthButton` - Google OAuth integration
- `SignInPage` - User sign in form
- `SignUpPage` - User registration form

### Dashboard Components
- `DashboardLayout` - Main dashboard wrapper
- `Sidebar` - Navigation sidebar
- `Navbar` - Top navigation bar
- Analytics charts and widgets

### Landing Page Sections
- `HeroSection` - Main landing hero
- `FeaturesSection` - Feature highlights
- `PricingSection` - Pricing plans
- `TestimonialsSection` - Customer reviews

## 🔐 Authentication

LankaLocate supports multiple authentication methods:

### Email/Password Authentication
- Secure password hashing with bcrypt
- JWT tokens for session management
- Password strength validation
- Account verification

### Google OAuth Integration
- One-click sign in/up with Google
- Automatic profile creation
- Secure token exchange
- Profile synchronization

### API Key Management
- Generate up to 2 API keys per account
- Real-time usage tracking
- Key rotation and revocation
- Rate limiting per key

## 📊 API Documentation

### Base URL
```
Production: https://api.lankalocate.lk/v1
Development: http://localhost:5000/api/v1
```

### Authentication
All API requests require an API key:
```bash
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.lankalocate.lk/v1/divisions
```

### Core Endpoints

#### Get All Provinces
```http
GET /v1/provinces
```

#### Get Districts by Province
```http
GET /v1/districts?province=Western
```

#### Get GN Divisions by District
```http
GET /v1/divisions?district=Colombo
```

#### Get GN Division by City
```http
GET /v1/divisions?city=Kandy
```

#### Validate Address
```http
POST /v1/validate
Content-Type: application/json

{
  "gnDivision": "Colombo 01",
  "district": "Colombo",
  "province": "Western"
}
```

### Response Format
All responses follow a consistent JSON structure:
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  },
  "meta": {
    "timestamp": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}
```

## 🚀 Deployment

### Docker Deployment

1. **Build containers**:
```bash
docker-compose build
```

2. **Start services**:
```bash
docker-compose up -d
```

3. **Access application**:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Database: localhost:27017

### Manual Deployment

1. **Build production assets**:
```bash
pnpm build
```

2. **Set production environment variables**
3. **Start production server**:
```bash
pnpm start
```

## 📈 Monitoring & Analytics

### Built-in Analytics
- Real-time API usage tracking
- Request/response monitoring
- Error rate tracking
- Performance metrics

### Dashboard Features
- Usage analytics with charts
- API key management
- Billing and subscription tracking
- Account settings and profile management

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute
- 🐛 **Bug Reports**: Found a bug? Open an issue
- 💡 **Feature Requests**: Have an idea? We'd love to hear it
- 📖 **Documentation**: Help improve our docs
- 🔧 **Code**: Submit pull requests
- 🌍 **Translations**: Help localize LankaLocate

### Development Guidelines
1. Follow the existing code style
2. Write tests for new features
3. Update documentation
4. Ensure all tests pass
5. Keep commits atomic and well-described

### Reporting Issues
When reporting issues, please include:
- Operating system and version
- Node.js version
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **Sri Lankan Government** - For providing official GN division data
- **Open Source Community** - For the amazing tools and libraries
- **Contributors** - Everyone who has contributed to this project
- **Users** - The developers and businesses using LankaLocate

## 📞 Support

### Documentation
- 📚 [API Documentation](https://docs.lankalocate.lk)
- 🎯 [Getting Started Guide](https://docs.lankalocate.lk/getting-started)
- 💡 [Examples](https://docs.lankalocate.lk/examples)

### Community
- 💬 [Discord Community](https://discord.gg/lankalocate)
- 📧 [Email Support](mailto:support@lankalocate.lk)
- 🐛 [GitHub Issues](https://github.com/your-username/lankalocate/issues)

### Commercial Support
- 🏢 **Enterprise Support**: Dedicated support for enterprise customers
- 🎯 **Custom Integration**: Help with custom implementations
- 📊 **Training**: Developer training and workshops

---

<div align="center">

**Made with ❤️ in Sri Lanka 🇱🇰**

[Website](https://lankalocate.lk) • [Documentation](https://docs.lankalocate.lk) • [API Status](https://status.lankalocate.lk)

</div>
