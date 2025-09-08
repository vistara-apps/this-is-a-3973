# EchoMapper 🎵🗺️

**Unlock nature's soundscape: Identify, understand, and map animal vocalizations.**

EchoMapper is a web application that uses AI to analyze animal sounds, providing species identification, call classification, and behavioral insights for conservationists and wildlife enthusiasts.

![EchoMapper Dashboard](https://via.placeholder.com/800x400/1e293b/10b981?text=EchoMapper+Dashboard)

## ✨ Features

### 🤖 AI-Powered Analysis
- **Species Identification**: Accurately identify animal species from audio recordings
- **Call Classification**: Classify vocalizations (territorial, mating, alarm, etc.)
- **Behavioral Insights**: Get human-readable interpretations of animal behavior
- **Confidence Scoring**: Understand the reliability of AI predictions

### 🗺️ Interactive Mapping
- **Geolocation Tagging**: Automatically tag recordings with GPS coordinates
- **Interactive Map**: Visualize recordings on an interactive map
- **Species Filtering**: Filter map markers by species
- **Location Clustering**: Group nearby recordings for better visualization

### 👥 Community Features
- **Crowdsourced Labeling**: Allow users to suggest corrections and improvements
- **Voting System**: Community voting on label accuracy
- **Expert Validation**: Expert review of community contributions
- **Collaborative Learning**: Improve AI models through community input

### 💎 Premium Features
- **Unlimited Analysis**: No monthly limits on audio analysis
- **Advanced Insights**: Deeper behavioral and environmental analysis
- **Offline Capabilities**: Download and analyze recordings offline
- **Priority Integration**: Priority access to conservation databases
- **Export Tools**: Export data for research and analysis

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account
- OpenAI API key
- Stripe account (for payments)

### 1. Clone the Repository
```bash
git clone https://github.com/vistara-apps/this-is-a-3973.git
cd this-is-a-3973
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Copy the environment template and fill in your credentials:
```bash
cp .env.example .env
```

Edit `.env` with your API keys:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key

# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

# Optional: Additional Services
VITE_PINATA_API_KEY=your_pinata_api_key
VITE_NEYNAR_API_KEY=your_neynar_api_key
```

### 4. Database Setup
Run the database schema in your Supabase SQL editor:
```bash
# Copy the contents of database/schema.sql and run in Supabase
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🏗️ Architecture

### Frontend Stack
- **React 18**: Modern React with hooks and context
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful icon library
- **React Leaflet**: Interactive maps
- **Recharts**: Data visualization

### Backend Services
- **Supabase**: Database, authentication, and storage
- **OpenAI**: Audio analysis and AI processing
- **Stripe**: Payment processing and subscriptions

### Key Components
```
src/
├── components/           # Reusable UI components
│   ├── MapWithMarkers.jsx       # Interactive map
│   ├── CrowdsourcedLabeling.jsx # Community features
│   └── ...
├── services/            # API service layers
│   ├── supabase.js      # Database operations
│   ├── openai.js        # AI analysis
│   └── stripe.js        # Payment processing
├── context/             # React context providers
│   └── AppContext.jsx   # Global app state
└── config/              # Configuration
    └── env.js           # Environment variables
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the SQL schema from `database/schema.sql`
3. Enable Row Level Security (RLS)
4. Configure storage bucket for audio files
5. Add your project URL and anon key to `.env`

### OpenAI Setup
1. Get an OpenAI API key from [platform.openai.com](https://platform.openai.com)
2. Ensure you have access to GPT-4 and Whisper models
3. Add your API key to `.env`

### Stripe Setup
1. Create a Stripe account
2. Set up products and pricing for premium subscriptions
3. Add your publishable key to `.env`
4. Configure webhooks for subscription events

## 📊 Data Model

### Core Entities
- **Users**: User profiles and subscription information
- **Recordings**: Audio recordings with metadata
- **Analysis Results**: AI analysis output
- **Labels**: Community-contributed labels and corrections

### Database Schema
```sql
users (id, username, subscription_tier, subscription, created_at)
recordings (id, user_id, audio_url, timestamp, latitude, longitude)
analysis_results (id, recording_id, species, call_type, confidence_score)
labels (id, recording_id, user_id, species_suggestion, votes_up, votes_down)
```

## 🎯 User Flows

### Recording and Analysis
1. User grants microphone permission
2. Records audio or uploads file
3. System gets GPS location
4. Audio is uploaded to storage
5. OpenAI analyzes the audio
6. Results are saved and displayed

### Community Labeling
1. User views analysis result
2. Suggests correction or improvement
3. Other users vote on suggestions
4. High-quality labels improve AI training

### Premium Subscription
1. User hits free tier limit
2. Prompted to upgrade to Premium
3. Stripe checkout process
4. Subscription activated
5. Premium features unlocked

## 🔒 Security

### Authentication
- Supabase Auth with email/password
- Row Level Security (RLS) policies
- JWT token-based sessions

### Data Protection
- User data isolated by RLS policies
- Audio files stored securely in Supabase Storage
- API keys managed through environment variables

### Privacy
- Location data is optional
- Users control their data sharing
- GDPR-compliant data handling

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify
```bash
# Build the project
npm run build

# Deploy dist/ folder to Netlify
```

### Environment Variables
Make sure to set all environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_OPENAI_API_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`

## 🧪 Testing

### Run Tests
```bash
npm run test
```

### Test Coverage
```bash
npm run test:coverage
```

### E2E Tests
```bash
npm run test:e2e
```

## 📈 Performance

### Optimization Features
- Lazy loading of components
- Image optimization
- Audio file compression
- Database query optimization
- CDN for static assets

### Monitoring
- Error tracking with Sentry
- Performance monitoring
- User analytics
- API usage tracking

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Style
- ESLint configuration included
- Prettier for code formatting
- Conventional commits
- TypeScript support (optional)

### Issue Reporting
- Use GitHub Issues
- Include reproduction steps
- Provide environment details
- Add relevant labels

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for powerful AI models
- **Supabase** for backend infrastructure
- **React** and **Vite** communities
- **Wildlife conservation** organizations
- **Open source** contributors

## 📞 Support

### Documentation
- [API Documentation](docs/api.md)
- [Component Guide](docs/components.md)
- [Deployment Guide](docs/deployment.md)

### Community
- [Discord Server](https://discord.gg/echomapper)
- [GitHub Discussions](https://github.com/vistara-apps/this-is-a-3973/discussions)
- [Twitter](https://twitter.com/echomapper)

### Commercial Support
For enterprise support and custom development:
- Email: support@echomapper.com
- Website: [echomapper.com](https://echomapper.com)

---

**Made with ❤️ for wildlife conservation and the open source community.**
