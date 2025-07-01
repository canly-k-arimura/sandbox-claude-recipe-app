# Recipe Share App

A full-stack web application for sharing and discovering recipes built with React and Node.js.

## Features

- 🔐 User authentication (register, login, logout)
- 🍽️ Recipe management (create, read, update, delete)
- 🔍 Search and filter recipes by category, difficulty, and keywords
- ⭐ Recipe rating and review system
- 📱 Responsive design for mobile and desktop
- 👤 User profiles with personal recipe collections

## Technology Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state management
- **React Hook Form** - Form handling
- **Yup** - Form validation
- **Axios** - HTTP client
- **React Toastify** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (with Mongoose ODM)
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## Project Structure

```
recipe-app/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Zustand stores
│   │   └── utils/         # Utility functions
│   └── package.json
├── server/                # Node.js backend
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Docker and Docker Compose (recommended)
- OR MongoDB (local installation or MongoDB Atlas)
- Yarn or npm

### 🐳 Quick Start with Docker (Recommended)

The easiest way to run this application is using Docker:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-app
   ```

2. **Start with Docker**
   ```bash
   # Start only MongoDB (if you want to run client/server locally)
   ./scripts/docker-setup.sh mongodb
   
   # OR start the full development environment
   ./scripts/docker-setup.sh dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - MongoDB: localhost:27017
   - Mongo Express (Database UI): http://localhost:8081

4. **Seed sample data**
   ```bash
   ./scripts/docker-setup.sh seed
   ```

#### Docker Commands
```bash
./scripts/docker-setup.sh mongodb    # Start only MongoDB + Mongo Express
./scripts/docker-setup.sh dev        # Start full development stack
./scripts/docker-setup.sh stop       # Stop all containers
./scripts/docker-setup.sh status     # Show container status
./scripts/docker-setup.sh logs       # Show logs
./scripts/docker-setup.sh seed       # Add sample data
./scripts/docker-setup.sh cleanup    # Clean up all resources
```

### 💻 Manual Installation (Alternative)

If you prefer to run without Docker:

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recipe-app
   ```

2. **Install backend dependencies**
   ```bash
   cd server
   yarn install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../client
   yarn install
   ```

4. **Environment Setup**
   
   Create `.env` file in the server directory:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/recipe-app
   JWT_SECRET=your_jwt_secret_key_here
   NODE_ENV=development
   ```

   Create `.env` file in the client directory:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

### Running the Application

1. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

2. **Start the backend server**
   ```bash
   cd server
   yarn dev
   ```

3. **Start the frontend development server**
   ```bash
   cd client
   yarn dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Recipes
- `GET /api/recipes` - Get all recipes (with pagination and filters)
- `GET /api/recipes/:id` - Get single recipe
- `POST /api/recipes` - Create new recipe (auth required)
- `PUT /api/recipes/:id` - Update recipe (auth required, owner only)
- `DELETE /api/recipes/:id` - Delete recipe (auth required, owner only)
- `POST /api/recipes/:id/rating` - Add/update recipe rating (auth required)
- `GET /api/recipes/user/my-recipes` - Get current user's recipes (auth required)

## Database Schema

### User Model
- username (String, required, unique)
- email (String, required, unique)
- password (String, required, hashed)
- avatar (String, optional)
- bio (String, optional)
- favoriteRecipes (Array of Recipe IDs)

### Recipe Model
- title (String, required)
- description (String, required)
- ingredients (Array of ingredient objects)
- instructions (Array of instruction objects)
- prepTime (Number, required)
- cookTime (Number, required)
- servings (Number, required)
- difficulty (Enum: Easy/Medium/Hard)
- category (Enum: various categories)
- tags (Array of strings)
- image (String, optional)
- author (User ID, required)
- ratings (Array of rating objects)
- averageRating (Number)
- ratingCount (Number)

## Features to Implement

- [ ] Image upload functionality
- [ ] Email verification
- [ ] Password reset functionality
- [ ] Recipe favorites system
- [ ] Advanced search with filters
- [ ] Recipe collections/categories
- [ ] Social features (follow users, comments)
- [ ] Recipe printing functionality
- [ ] Nutritional information
- [ ] Recipe scaling (adjust serving sizes)

## 🔧 Development Setup

### Git Setup
```bash
# Initialize Git repository and create initial commit
./scripts/git-setup.sh

# Or manually:
git init
git add .
git commit -m "Initial commit"
```

### Environment Files
Create these environment files (examples provided):
```bash
# Server environment
cp .env.docker server/.env
# Edit server/.env with your settings

# Client environment  
# client/.env is already configured
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Workflow
```bash
# Start development environment
./scripts/docker-setup.sh mongodb  # MongoDB only
# OR
./scripts/docker-setup.sh dev      # Full stack

# Run tests (when implemented)
cd server && yarn test
cd client && yarn test

# Check code style
cd server && yarn lint
cd client && yarn lint
```

## License

This project is licensed under the MIT License.