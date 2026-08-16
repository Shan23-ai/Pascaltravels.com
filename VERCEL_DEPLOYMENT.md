# Vercel Deployment Guide — Pascal Travels & Tours

## Overview

This guide provides step-by-step instructions for deploying the Pascal Travels & Tours application to Vercel, a modern serverless platform optimized for Node.js and static sites.

## Prerequisites

- Vercel account (free at https://vercel.com)
- GitHub account with the project repository
- Basic command-line knowledge

## Option 1: Deploy via Vercel Dashboard (Easiest)

### Step 1: Connect GitHub Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"New Project"** or **"Add New..."**
3. Select **"Import Git Repository"**
4. Search for `travel-agency-website` (or your repo name)
5. Click **"Import"**

### Step 2: Configure Project
1. **Project Name**: `pascal-travels` (or your preferred name)
2. **Framework**: Select **"Other"** (it will auto-detect)
3. **Root Directory**: Leave as root (or specify if needed)
4. Click **"Deploy"**

The project will automatically:
- Detect `vercel.json` configuration
- Build the application
- Deploy to a live URL

### Step 3: Add Environment Variables (Optional)
If you plan to use real payment providers or database:

1. Go to **Project Settings** → **Environment Variables**
2. Add the following as needed:
   ```
   PESALINK_PROVIDER=pesalink    (or: none, mock)
   WU_MODE=production            (or: mock)
   DB_ENABLED=false              (or: true if using PostgreSQL)
   DATABASE_URL=<your_db_url>    (only if DB_ENABLED=true)
   ```
3. Click **"Save"**

### Step 4: Deploy Complete
Your application is now live! Access it via:
- **Default URL**: `https://<project-name>.vercel.app`
- **Custom Domain**: Configure in **Project Settings** → **Domains**

---

## Option 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
# or
yarn global add vercel
```

### Step 2: Authenticate with Vercel
```bash
vercel login
# Follow the browser prompt to authenticate
```

### Step 3: Deploy from Project Root
```bash
cd /home/shan/vs.code
vercel
```

Follow the prompts:
- **Which scope should contain your project?** → Your workspace
- **Link to existing project?** → No
- **What's your project's name?** → `pascal-travels`
- **In which directory is your code located?** → `.`
- **Want to modify these settings?** → No

### Step 4: Monitor Deployment
```bash
vercel --inspect
# Check logs
vercel logs
# View deployment details
vercel list
```

---

## Option 3: GitHub Actions (Continuous Deployment)

### Step 1: Create Workflow File
Create `.github/workflows/vercel.yml`:
```yaml
name: Vercel Deployment

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        uses: BetaHuhn/deploy-to-vercel-action@v1
        with:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          PRODUCTION: true
```

### Step 2: Add GitHub Secrets
1. Go to **Repository Settings** → **Secrets and variables** → **Actions**
2. Click **"New repository secret"**
3. Add:
   - `VERCEL_TOKEN`: Get from Vercel account settings
   - `VERCEL_ORG_ID`: Found in Vercel project settings
   - `VERCEL_PROJECT_ID`: Found in Vercel project settings

### Step 3: Push to Trigger Deployment
```bash
git push origin main
# Deployment will automatically trigger
```

---

## Project Structure for Vercel

The `vercel.json` configuration handles:
- **Node.js backend** at `/api/*` routes via `www/server/server.js`
- **Static frontend** at `/` routes via files in `www/`
- **Environment variables** for production mode

### Build Output
```
.vercel/
├── output/
│   ├── functions/
│   │   └── api/server.js  (API handler)
│   └── static/            (Frontend files)
```

---

## Testing After Deployment

### Health Check
```bash
curl https://<your-vercel-url>/api/health
# Response: {"status":"ok","time":"2026-08-16T12:00:00.000Z"}
```

### API Endpoints
```bash
# Jobs API
curl https://<your-vercel-url>/api/jobs

# Create Job
curl -X POST https://<your-vercel-url>/api/jobs \
  -H 'Content-Type: application/json' \
  -d '{"title":"Engineer","country":"Kenya","description":"Job desc"}'

# Visa Applications
curl -X POST https://<your-vercel-url>/api/visa-applications \
  -H 'Content-Type: application/json' \
  -d '{
    "fullName":"John Doe",
    "email":"john@example.com",
    "phone":"+254700000000",
    "nationality":"Kenyan",
    "passportNumber":"P123",
    "destinationCountry":"UAE",
    "visaType":"Tourist"
  }'

# Frontend
curl https://<your-vercel-url>/  # Returns index.html
```

---

## Custom Domain Setup

1. In **Vercel Dashboard**, go to **Project Settings** → **Domains**
2. Click **"Add Domain"**
3. Enter your domain (e.g., `pascaltours.com`)
4. Vercel will provide DNS records to add to your domain registrar
5. Wait for DNS propagation (typically 5-30 minutes)

---

## Monitoring & Logs

### Vercel Dashboard
- **Real-time logs**: Deployment page
- **Function invocations**: Analytics tab
- **Error tracking**: Monitoring section

### CLI
```bash
# View live logs
vercel logs

# Check specific deployment
vercel logs <deployment-id>

# Monitor performance
vercel analytics
```

---

## Scaling & Performance

### Auto-Scaling
Vercel automatically scales based on traffic — no configuration needed.

### Caching
Frontend static files are cached with a 365-day max age via Vercel's CDN.

### Regional Deployment
Vercel deploys to 30+ regions. Choose your preferred region during setup:
- Project Settings → **Regions**

---

## Cost Considerations

| Feature | Free Tier | Pro |
|---------|-----------|-----|
| Deployments | Unlimited | Unlimited |
| Serverless Functions | 100 GB-hours/month | 1,000 GB-hours/month |
| Edge Middleware | ✓ | ✓ |
| Custom Domains | ✓ | ✓ |
| Analytics | Included | Included |
| Monthly Cost | $0 | $20 |

**Current app**: Easily fits within Free tier for MVP/demo.

---

## Troubleshooting

### Deployment Failed
1. Check logs: `vercel logs`
2. Verify `vercel.json` syntax
3. Ensure `package.json` exists in `www/server/`
4. Check GitHub Actions workflow (if using)

### 404 on API Routes
- Ensure routes are mapped correctly in `vercel.json`
- Check `www/server/server.js` exports Express app

### Environment Variables Not Loaded
1. Verify in Project Settings → Environment Variables
2. Redeploy after adding variables (changes don't apply retroactively)
3. Check `.env` vs Vercel dashboard configuration

### Build Size Exceeded
- Vercel limit: 250 MB
- Remove `node_modules/` and large files
- Use `.vercelignore` to exclude files:
  ```
  node_modules
  .git
  tests/
  ```

---

## Post-Deployment Checklist

- [ ] Test health endpoint
- [ ] Verify all API routes working
- [ ] Check frontend loads correctly
- [ ] Test form submissions
- [ ] Enable custom domain
- [ ] Set up monitoring
- [ ] Configure backups (for database if used)
- [ ] Add SSL certificate (automatic with custom domain)
- [ ] Monitor logs for errors

---

## Next Steps

1. **Database**: Connect PostgreSQL if using persistent storage
2. **Payment Integration**: Add Pesalink/Western Union credentials
3. **Email Notifications**: Integrate SendGrid for alerts
4. **Analytics**: Enable Vercel Analytics for user insights
5. **CI/CD**: Set up GitHub Actions for automatic deployments

---

## Support & Resources

- **Vercel Docs**: https://vercel.com/docs
- **Node.js Runtime**: https://vercel.com/docs/functions/serverless-functions/runtimes/node-js
- **GitHub Integration**: https://vercel.com/github
- **CLI Reference**: https://vercel.com/docs/cli

---

## Deployment Status

- ✅ Vercel configuration added (`vercel.json`)
- ✅ Project pushed to GitHub
- ✅ Ready for import to Vercel

**Next Action**: Import the GitHub repository into your Vercel account using Option 1 above.
