# Proppy - Property Expense Tracker

Proppy is a full-stack application for tracking and managing property-related expenses, built with React frontend and Django REST Framework backend.

## Features

- User authentication and authorization
- Property expense tracking and management
- Categorization of expenses (utilities, maintenance, taxes, etc.)
- Dashboard with expense analytics and reports
- Document storage for receipts and invoices
- Multi-property support

## Prerequisites

- Node.js (v16 or higher)
- Python (3.8 or higher)
- pip (Python package manager)
- npm or yarn (Node.js package manager)

## Getting Started

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd proppy_backend
   ```

2. **Create and activate a virtual environment**:
   ```bash
   # On macOS/Linux
   python -m venv .venv
   source .venv/bin/activate

   # On Windows
   # python -m venv .venv
   # .venv\Scripts\activate
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Apply database migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Create a superuser (admin) account**:
   ```bash
   python manage.py createsuperuser
   ```

6. **Run the development server**:
   ```bash
   python manage.py runserver
   ```
   The backend will be available at `http://127.0.0.1:8000/`

### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd proppy_frontend
   ```

2. **Install Node.js dependencies**:
   ```bash
   npm install
   # or
   # yarn install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   # or
   # yarn dev
   ```
   The frontend will be available at `http://localhost:5173`

## Environment Configuration

### Backend
Create a `.env` file in the `proppy_backend` directory with the following variables:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
MEDIA_ROOT=media
MEDIA_URL=/media/
```

## Available Commands

### Backend
- `python manage.py runserver` - Start the development server
- `python manage.py makemigrations` - Create new migrations
- `python manage.py migrate` - Apply database migrations
- `python manage.py createsuperuser` - Create admin user

### Frontend
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Project Structure

```
proppy/
├── proppy_backend/         # Backend (Django)
│   ├── core/              # Core functionality
│   ├── dashboard/         # Dashboard functionality
│   ├── properties/        # Property management
│   ├── expenses/          # Expense tracking
│   ├── users/             # User management
│   ├── manage.py          # Django management script
│   └── requirements.txt   # Python dependencies
└── proppy_frontend/       # Frontend (React + Vite)
    ├── public/           # Static files
    ├── src/              # Source code
    │   ├── components/   # Reusable components
    │   ├── pages/        # Page components
    │   ├── services/     # API services
    │   └── App.jsx       # Main component
    ├── package.json      # Frontend dependencies
    └── vite.config.js    # Vite configuration
```

## Troubleshooting

- **Port already in use**: If you get a port in use error, either close the conflicting process or change the port in the respective configuration.
- **Module not found**: Make sure all dependencies are installed by running `npm install` or `pip install -r requirements.txt`.
- **CORS errors**: Ensure the frontend URL is included in `CORS_ALLOWED_ORIGINS` in the backend settings.
- **Media files not serving**: Make sure the `media` directory exists and has proper write permissions.

## Contributing

1. Fork the repository
2. Create a new branch for your feature
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.