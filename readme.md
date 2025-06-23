# 🐷 PIG - Programs Input Generator

A modern web application for generating various types of input data for computer science problems and competitive programming.

## ✨ Features

- **Number Sequences**: Generate random, sorted, unique, prime, even, or odd number sequences
- **Matrices**: Create matrices with customizable properties (symmetric, diagonal, etc.)
- **Strings**: Generate strings with specific alphabets and properties (palindromes)
- **Graphs**: Create directed/undirected graphs with optional weights and SVG visualization
- **History**: Track and export all generated data
- **User Authentication**: Secure login/register system
- **Export Options**: Multiple export formats (JSON, CSV, TXT, SVG)

## 🚀 Quick Start

### Prerequisites
- Node.js
- PostgreSQL
- Git

## 🏗️ Project Structure

```
PIG-Programs-Input-Generator/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Sequelize models
│   │   ├── routes/         # API routes
│   │   └── database/       # Database setup scripts
├── frontend/
│   ├── assets/            # Icons and static assets
│   ├── css/               # Stylesheets
│   ├── js/                # Client-side JavaScript
│   └── index.html         # Main HTML file
└── package.json
```

## 🛠️ Tech Stack

**Backend:**
- Node.js & Express.js
- PostgreSQL with Sequelize ORM
- JWT Authentication
- bcryptjs for password hashing

**Frontend:**
- Vanilla JavaScript
- CSS3
- SVG graphics for visualizations

**Security:**
- XSS protection
- SQL Injection protection

## 📖 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Generators
- `POST /api/generators/numbers/generate` - Generate number sequences
- `POST /api/generators/matrices/generate` - Generate matrices
- `POST /api/generators/strings/generate` - Generate strings
- `POST /api/generators/graphs/generate` - Generate graphs
- `GET /api/generators/graphs/:id/svg` - Export graph as SVG

### Data Management
- `GET /api/data` - Get user's generation history
- `DELETE /api/data/:id` - Delete specific generated data

## 🎥 Demo

**[🎬 Watch Demo on YouTube](https://www.youtube.com/watch?v=eYo0Ifwd7pQ)**

## 👥 Contributors

This project was developed by:

- **[Preda Andrei - Claudiu]** - [GitHub Profile](https://github.com/MTAxD12)
- **[Adam Vlad - Gabriel]** - [GitHub Profile](https://github.com/adam-vlad)

## 📝 Usage Examples

### Generate Number Sequence
```javascript
// Request
POST /api/generators/numbers/generate
{
  "length": 10,
  "min": 1,
  "max": 100,
  "properties": ["unique", "sorted"]
}

// Response
{
  "id": 1,
  "result": [5, 12, 23, 34, 45, 56, 67, 78, 89, 91]
}
```