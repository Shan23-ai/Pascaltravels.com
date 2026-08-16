# Pascal Travels & Tours — Deployment Guide

## Quick Start (Local Development)

### Prerequisites
- Node.js 20+
- npm or yarn

### Install & Run
```bash
cd www/server
npm install
npm start
```

The app will be available at `http://localhost:3000`

## Docker Deployment

### Build Image
```bash
docker build -t pascal-travels:latest .
```

### Run Container
```bash
docker run -d \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e PESALINK_PROVIDER=none \
  -e WU_MODE=mock \
  --name pascal-travels \
  pascal-travels:latest
```

### Using Docker Compose
```bash
docker-compose up -d
```

## Azure Deployment

### Option 1: Azure Container Instances (Simple)
```bash
# Build and push to Azure Container Registry
az acr build --registry <your-registry> --image pascal-travels:latest .

# Run the container
az container create \
  --resource-group <your-rg> \
  --name pascal-travels \
  --image <your-registry>.azurecr.io/pascal-travels:latest \
  --ports 3000 \
  --environment-variables NODE_ENV=production PORT=3000
```

### Option 2: Azure App Service (Recommended for Production)
```bash
# Create App Service
az appservice plan create \
  --name pascal-plan \
  --resource-group <your-rg> \
  --sku B1 \
  --is-linux

az webapp create \
  --name pascal-travels \
  --plan pascal-plan \
  --resource-group <your-rg> \
  --runtime "node|20-lts"

# Deploy from GitHub
az webapp deployment source config-zip \
  --name pascal-travels \
  --resource-group <your-rg> \
  --src deployment.zip
```

## Environment Variables

Required for production:
```
NODE_ENV=production
PORT=3000
PESALINK_PROVIDER=none|pesalink  # or actual provider
WU_MODE=mock|production           # Western Union mode
DB_ENABLED=false|true             # Enable PostgreSQL
DATABASE_URL=postgresql://...     # If DB_ENABLED=true
```

## Database Setup (Optional)

To enable PostgreSQL:
1. Set `DB_ENABLED=true`
2. Provide `DATABASE_URL` pointing to your PostgreSQL instance
3. Run migrations: `npm run init-db`

## Health Check

All deployments expose a health endpoint:
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{"status":"ok","time":"2026-08-16T12:00:00.000Z"}
```

## Monitoring & Logs

### Local
```bash
npm run dev  # Runs with nodemon for auto-reload
```

### Docker
```bash
docker logs -f pascal-travels
```

### Azure App Service
```bash
az webapp log tail --name pascal-travels --resource-group <your-rg>
```

## Security Checklist

- [ ] Set secure environment variables in production
- [ ] Configure CORS origins properly
- [ ] Enable HTTPS/TLS
- [ ] Set up database backups
- [ ] Configure firewall/network rules
- [ ] Enable Application Insights monitoring
- [ ] Set up rate limiting if needed
- [ ] Configure secrets in Key Vault

## Troubleshooting

### Port already in use
```bash
# Kill process on port 3000
lsof -ti :3000 | xargs kill -9
```

### Database connection issues
```bash
# Verify connection string
echo $DATABASE_URL
# Test connection
psql $DATABASE_URL -c "SELECT version();"
```

### Container won't start
```bash
# Check logs
docker logs <container-id>
# Check image
docker inspect <image-id>
```

## Support
For issues or questions, refer to the README.md or contact the development team.
