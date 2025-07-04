# Data Migration/ETL Application

A full-stack web application for managing data migration between PostgreSQL databases and Odoo ERP systems, built with React and Node.js.

## 🚀 Features

### Source Management
- Support for multiple data sources:
  - PostgreSQL databases
  - Odoo ERP systems
- Source configuration and testing
- Secure credential storage with AES-256-CBC encryption
- Active/inactive source status tracking

### Data Pipeline Configuration
- Interactive table selection
- Column mapping interface
- Data preview capabilities
- Support for:
  - PostgreSQL table migrations
  - Odoo module data extraction
  - Cross-system data mapping

### Data Operations
- Table discovery and introspection
- Column mapping and selection
- Row data preview (up to 50 rows)
- Bulk data transfer
- Data transformation support

## 🛠️ Tech Stack

### Frontend
- React 18+ with Vite
- TailwindCSS for styling
- React Router v6 for navigation
- Context API for state management

### Backend
- Node.js with Express
- Sequelize ORM
- PostgreSQL database
- XML-RPC for Odoo integration
- Crypto for encryption

## 📁 Project Structure

```
project2/
├── src/
│   ├── pages/
│   │   ├── Home.jsx          # Main dashboard
│   │   ├── Pipeline.jsx      # Data pipeline configuration
│   │   ├── Tables.jsx        # Database table selection
│   │   ├── Columns.jsx       # Column mapping interface
│   │   ├── Rows.jsx          # Row data preview
│   │   └── OdooModules.jsx   # Odoo module management
│   ├── components/
│   │   ├── HomeBox.jsx       # Reusable container
│   │   ├── Navbar.jsx        # Navigation
│   │   ├── Loader.jsx        # Loading animations
│   │   └── Forms/            # Form components
│   └── context/
│       └── Context.js        # Global state management
├── server/
│   ├── index.js              # Express server setup
│   ├── Scripts/
│   │   ├── AllTable.js       # PostgreSQL operations
│   │   ├── odooData.js       # Odoo data fetching
│   │   └── odooColumns.js    # Odoo column operations
│   └── src/
│       └── model/
│           └── user.model.js # Database schemas
```

## 🚦 Getting Started

### Prerequisites
- Node.js 16+
- PostgreSQL 12+
- Odoo server (optional)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd project2
```

2. Install dependencies:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Environment setup:
```bash
# Create .env file in server directory
cp .env.example .env

# Configure your environment variables
SECRET_KEY=your_secret_key
DB_HOST=localhost
DB_PORT=5432
DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
```

4. Start the application:
```bash
# Start backend server
cd server
npm start

# Start frontend development server
cd ..
npm run dev
```

## 🔒 Security Features

- Password encryption using AES-256-CBC
- Secure credential storage
- Session management
- Access control for sensitive operations

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

MIT License - feel free to use and modify for your needs.
