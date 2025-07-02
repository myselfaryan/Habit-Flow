# HabitFlow

A comprehensive habit and task tracking application that helps you build consistency and achieve your goals through beautiful analytics and intuitive design.

## ✨ Features

### 🎯 Smart Habit Tracking
- Build lasting habits with intelligent tracking
- Visual streak counters and completion rates
- Customizable categories and colors
- Activity heatmaps for progress visualization

### ✅ Advanced Task Management
- Organize tasks with priorities and deadlines
- Subtask support for complex projects
- Smart categorization and filtering
- Real-time progress tracking

### 📊 Powerful Analytics
- Beautiful charts and visualizations
- 12-month progress tracking
- Habit performance insights
- Task completion analytics

### 🎨 Modern Design
- Clean, intuitive interface
- Dark/light theme support
- Responsive design for all devices
- Smooth animations and micro-interactions

## 🚀 Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Real-time)
- **Animations**: Framer Motion
- **Charts**: Recharts
- **3D Graphics**: Three.js, React Three Fiber
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/habitflow.git
   cd habitflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Fill in your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Set up the database**
   - Create a new Supabase project
   - Run the migration file in `supabase/migrations/`
   - Or use the Supabase CLI: `supabase db push`

5. **Start the development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── habits/         # Habit-related components
│   ├── tasks/          # Task-related components
│   ├── landing/        # Landing page components
│   ├── layout/         # Layout components
│   └── ui/             # Base UI components
├── contexts/           # React contexts
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── pages/              # Page components
├── types/              # TypeScript type definitions
└── utils/              # Helper functions
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:

- **habits**: Store habit definitions and settings
- **tasks**: Store task information and metadata
- **habit_entries**: Track daily habit completions
- **subtasks**: Support complex task breakdowns

All tables include Row Level Security (RLS) for data protection.

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Key Features

### Authentication
- Secure email/password authentication via Supabase
- Protected routes and data isolation
- Session management and auto-refresh

### Habit Tracking
- Daily, weekly, and custom frequency support
- Streak calculation and maintenance
- Completion rate analytics
- Visual progress indicators

### Task Management
- Priority levels (High, Medium, Low)
- Due date tracking and overdue detection
- Subtask support for complex projects
- Category-based organization

### Analytics Dashboard
- 7-day and 12-month activity charts
- Habit performance metrics
- Task completion statistics
- Visual progress heatmaps

## 🎨 Design Philosophy

HabitFlow follows modern design principles:

- **Minimalist Interface**: Clean, distraction-free design
- **Consistent Patterns**: Unified component library
- **Responsive Design**: Optimized for all screen sizes
- **Accessibility**: WCAG compliant with proper contrast ratios
- **Performance**: Optimized loading and smooth interactions

## 🔒 Security & Privacy

- Row Level Security (RLS) on all database tables
- Secure authentication with Supabase Auth
- Data encryption in transit and at rest
- No third-party tracking or analytics

## 🚀 Deployment

### Netlify (Recommended)
1. Connect your GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables in Netlify dashboard

### Manual Deployment
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Supabase](https://supabase.com) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for the styling system
- [Lucide](https://lucide.dev) for the beautiful icons
- [Framer Motion](https://framer.com/motion) for smooth animations

## 📞 Support

If you have any questions or need help, please:

1. Check the [Issues](https://github.com/yourusername/habitflow/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide detailed information about your environment and the issue

---

**Built with ❤️ for productivity enthusiasts**
