# Pascal Travels & Tours

A comprehensive travel, visa, and recruitment platform built with Node.js/Express and vanilla JavaScript.

## Features

### 🏢 Agency Portal
- Agent registration and onboarding
- Candidate management dashboard
- Commission tracking
- Referral code generation
- Agency profile management

### 🧳 Travel Services
- Travel package showcase
- Booking system (in-memory or PostgreSQL)
- Payment integration (PesaLink, Western Union, Stripe-ready)
- Booking status tracking

### 📋 Visa Services
- Online visa application submission
- Application tracking by email/ID
- Multi-country visa type support
- Document upload framework

### 💼 Job Board
- Job listings by country/region
- Quick apply functionality
- Applicant tracking
- Specialization filtering

### 💰 Payments
- **PesaLink Integration** — Bank transfer with manual DIB details
- **Western Union** — Mock mode for development, production-ready
- **Stripe** — Framework ready (configure in config.js)
- Idempotent payment requests
- Transaction audit trail

### 👥 Recruitment
- Referral system with unique codes
- Agent-based candidate submissions
- Commission calculation
- Reward tracking

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (optional; in-memory default)
- **Frontend**: Vanilla HTML, CSS, JavaScript
- **Security**: Helmet, JWT-ready, Bcrypt
- **Logging**: Morgan
- **Containerization**: Docker, Docker Compose
- **Mobile**: Capacitor (Android app support)

## Project Structure

```
pascal-travels/
├── www/                          # Static frontend
│   ├── index.html               # Homepage
│   ├── jobs.html                # Job listings
│   ├── visa-application.html    # Visa form
│   ├── apply.html               # Quick apply
│   ├── agent-register.html      # Agent onboarding
│   ├── agent-login.html         # Agent dashboard
│   ├── app.js                   # Main app logic
│   ├── style.css                # Global styles
│   └── server/                  # Express backend
│       ├── server.js            # Main server
│       ├── config.js            # Configuration
│       ├── store.js             # Data abstraction
│       └── routes/              # API endpoints
│           ├── jobs.js
│           ├── visa.js
│           ├── agents.js
│           ├── payments.js
│           ├── referrals.js
│           ├── webhooks.js
│           └── applications.js
├── Dockerfile                    # Container image
├── docker-compose.yml           # Local dev environment
└── DEPLOYMENT.md                # Deployment guide
```

## Quick Start

### Local Development
```bash
cd www/server
npm install
npm start
```

Open `http://localhost:3000`

### Docker
```bash
docker-compose up -d
```

## API Endpoints

### Jobs
- `GET /api/jobs` — List active jobs
- `GET /api/jobs/:id` — Get job details
- `POST /api/jobs` — Create job (admin)
- `POST /api/jobs/:id/apply` — Apply to job

### Visa Applications
- `POST /api/visa-applications` — Submit visa application
- `GET /api/visa-applications` — List applications (admin)

### Agent Management
- `POST /api/agents/register` — Register agency
- `GET /api/agents` — List agents (admin)
- `POST /api/agents/:id/login` — Agent login
- `POST /api/agents/:id/candidates` — Submit candidate

### Payments
- `POST /api/payments` — Create payment
- `GET /api/payments/:id` — Get payment status
- `POST /api/webhooks/pesalink` — PesaLink webhook
- `POST /api/webhooks/westernunion` — WU webhook

### Referrals
- `POST /api/referrals/generate` — Generate code
- `GET /api/referrals/validate/:code` — Validate code
- `POST /api/referrals/apply` — Apply referral
- `GET /api/referrals/stats` — Agent stats

### Health & Tracking
- `GET /api/health` — Health check
- `GET /api/track-application` — Track by email/ID

## Configuration

Create `.env` in `www/server/`:
```env
NODE_ENV=production
PORT=3000
PESALINK_PROVIDER=none
WU_MODE=mock
DB_ENABLED=false
# DATABASE_URL=postgresql://user:pass@localhost:5432/pascal
```

See `www/server/config.js` for all available options.

## Database (Optional)

To use PostgreSQL instead of in-memory storage:

1. Set `DB_ENABLED=true` in `.env`
2. Provide `DATABASE_URL`
3. Run migrations:
   ```bash
   npm run init-db
   ```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for:
- Local Docker setup
- Azure Container Instances
- Azure App Service
- GitHub Actions CI/CD

## Security Notes

This is a demo application. For production use:
- [ ] Enable HTTPS/TLS
- [ ] Use environment secrets for credentials
- [ ] Implement proper authentication (JWT)
- [ ] Add rate limiting
- [ ] Configure CORS properly
- [ ] Set up database backups
- [ ] Enable Application Insights
- [ ] Use Azure Key Vault for secrets

## Payment Integration

### PesaLink (Kenya)
- DIB (Direct Internet Banking) details provided to user
- Manual confirmation by admin
- No real bank integration in demo mode

### Western Union
- Mock mode for testing (default)
- Production mode requires WU API credentials
- Transaction verification via MTCN

### Stripe (Framework Ready)
- Configure API keys in `config.js`
- Uncomment Stripe routes in `server.js`
- Add Stripe webhook handlers

## Mobile App (Capacitor)

To build Android app:
```bash
npm run cap:init
npm run cap:add:android
npm run cap:sync
npm run cap:open:android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License — See LICENSE file for details

## Support

For issues, feature requests, or questions:
- 📧 Email: support@pascaltours.com
- 🐛 GitHub Issues: [Report Bug](https://github.com/your-repo/issues)
- 📖 Docs: [Wiki](https://github.com/your-repo/wiki)

## Roadmap

- [ ] Real payment provider integration (Stripe, MPesa)
- [ ] Email notifications (sendgrid)
- [ ] SMS alerts (Twilio)
- [ ] Admin dashboard with charts
- [ ] Mobile app (iOS via Capacitor)
- [ ] Multi-language support
- [ ] Advanced analytics
- [ ] AI-powered agent matching

---

**Pascal Travels & Tours** — Making travel and recruitment seamless, one journey at a time. ✈️
