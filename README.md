# adeam-assurance Member Search Platform

**adeam-assurance** is a simple, responsive web platform designed to allow users to quickly access and download personalized PDF documents associated with their names. It is intended for organizations that need to distribute individual documents efficiently while maintaining a clean, user-friendly interface.

## 🎯 Purpose

The platform serves as a **centralized access point** for members or clients to retrieve their personalized documents securely. Users can:
- Enter their **full name** in a search bar
- Receive **autocomplete suggestions** while typing to make the search quick and intuitive
- Access and **download the PDF** associated with their name
- Be clearly notified when their name is **not found** with the message: **"Personne non adhérente"**

This approach ensures a **fast, user-friendly experience** for distributing personal documents without the need for manual handling or emailing individual files.

## ✨ Features

- **Minimalist Design**: Clean, mobile-friendly interface
- **Real-time Search**: Autocomplete functionality with instant suggestions
- **Keyboard Navigation**: Full keyboard support (arrow keys, Enter, Escape)
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Clear Feedback**: Visual indicators for found/not found members
- **PDF Downloads**: Direct download functionality for member documents
- **French Interface**: Fully localized for French-speaking users

## 🏗️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL)
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📊 Database Structure

The platform uses a Supabase database table named `members` with the following schema:

| Column        | Type          | Description                      |
|---------------|---------------|----------------------------------|
| `id`          | integer       | Primary key (auto-increment)    |
| `nom`         | text          | Last name (uppercase)            |
| `prenom`      | text          | First name (uppercase)           |
| `pdf_name`    | text          | Name of the corresponding PDF    |
| `created_at`  | timestamptz   | Record creation timestamp        |

### Sample Data
The database includes sample members like BENALI AHMED, ZAHRA FATIMA, and AMRANI YOUSSEF with their corresponding PDF files.

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager
- Supabase account

### Installation Steps

1. **Clone the repository** from your version control system
2. **Install dependencies** using npm install
3. **Set up environment variables** in a .env.local file with your Supabase URL and anonymous key
4. **Set up the database** by running the provided SQL migration in your Supabase dashboard
5. **Start the development server** using npm run dev
6. **Open your browser** and navigate to localhost:5173

## 📱 Usage

### Basic Workflow

1. **Open the landing page**
2. **Type your full name** in the search bar
3. **Select from autocomplete suggestions** or press Enter to search
4. **If a match is found**:
   - The member's full name and PDF filename will appear
   - Click the black download button to download the PDF
5. **If no match is found**:
   - The message "Personne non adhérente" will be displayed

### Keyboard Shortcuts

- **Arrow Keys**: Navigate through autocomplete suggestions
- **Enter**: Select highlighted suggestion or perform search
- **Escape**: Close autocomplete dropdown

## 🚀 Deployment

### Netlify Deployment Configuration

1. **Build the project** using the npm run build command
2. **Configure Netlify settings**:
   - Build command: npm run build
   - Publish directory: dist
   - Node version: 18
3. **Set environment variables** in Netlify dashboard for Supabase connection
4. **Configure redirects** to handle single-page application routing

The project includes a netlify.toml file with proper configuration for seamless deployment.

## 📂 Project Structure

The project follows a clean, organized structure:

- **src/components/**: Contains SearchBar and SearchResult components
- **src/lib/**: Houses Supabase client configuration
- **supabase/migrations/**: Database migration files
- **public/pdfs/**: Directory for storing PDF documents
- **Configuration files**: Include Netlify, TypeScript, and build configurations

## 🎨 Design System

The platform features a minimalist design approach:

- **Colors**: Clean grayscale palette with black accent elements
- **Typography**: Clear, readable fonts with proper visual hierarchy
- **Interactive Elements**: Black buttons with white text and subtle hover effects
- **Layout**: Centered content design with responsive breakpoints for all devices
- **Visual Depth**: Soft shadows and rounded corners for modern aesthetics

## 🔧 Configuration

### Environment Variables

The application requires two essential environment variables:
- **VITE_SUPABASE_URL**: Your Supabase project URL
- **VITE_SUPABASE_ANON_KEY**: Your Supabase anonymous key

### Security Features

- **Row Level Security (RLS)** enabled on the members table for data protection
- **Public read access** policy specifically configured for search functionality
- **Environment-based configuration** to keep sensitive data secure

## 🤝 Contributing

We welcome contributions to improve the platform:

1. Fork the repository
2. Create a feature branch with a descriptive name
3. Make your changes with clear commit messages
4. Push your branch and open a Pull Request
5. Provide a detailed description of your changes

## 📝 License

This project is released under the MIT License, allowing for both personal and commercial use with proper attribution.

## 🐛 Troubleshooting

### Common Issues and Solutions

**Environment Variable Errors**
- Ensure your .env.local file exists and contains the correct Supabase credentials
- Verify that environment variables are prefixed with VITE_ for Vite compatibility

**Database Connection Problems**
- Double-check your Supabase URL and anonymous key for accuracy
- Confirm that Row Level Security policies are properly configured in your Supabase dashboard

**Netlify Build Failures**
- Verify that environment variables are correctly set in the Netlify dashboard
- Ensure your Node.js version is set to 18 or higher in build settings

**Search Functionality Issues**
- Check that the database migration has been successfully applied
- Verify that sample data exists in the members table

## 📞 Support

For technical questions, feature requests, or bug reports, please open an issue in the GitHub repository. We strive to respond promptly and provide helpful assistance.

## 🌟 Future Enhancements

Potential improvements for future versions:
- Advanced search filters and sorting options
- Bulk document upload and management interface
- User authentication and role-based access
- Analytics dashboard for document access tracking
- Multi-language support beyond French

---

**Made with ❤️ for efficient document distribution and member services**