# Push to New GitHub Repository: Pascaltravels.com

## Step 1: Create Repository on GitHub (Web UI)

1. Go to https://github.com/new
2. Enter repository name: **Pascaltravels.com**
3. Select **Public** (or Private if preferred)
4. Click **Create repository**

You'll be redirected to your new repo page showing:
```
https://github.com/YOUR_USERNAME/Pascaltravels.com
```

## Step 2: Push Your Code

After creating the repo, run these commands in your terminal:

### Option A: If Starting Fresh (Clean Push)

```bash
cd /home/shan/vs.code

# Remove old remote (if it exists)
git remote remove origin

# Add new remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/Pascaltravels.com.git

# Push all branches and tags
git branch -M main
git push -u origin main
```

### Option B: If You Have SSH Key Set Up

```bash
cd /home/shan/vs.code

git remote remove origin
git remote add origin git@github.com:YOUR_USERNAME/Pascaltravels.com.git
git branch -M main
git push -u origin main
```

### Option C: Using GitHub CLI (If Authenticated)

```bash
cd /home/shan/vs.code

# If not authenticated yet:
gh auth login

# Then create and push:
gh repo create Pascaltravels.com --public --source=. --remote=origin --push
```

## Step 3: Verify

After pushing, verify at:
```
https://github.com/YOUR_USERNAME/Pascaltravels.com
```

You should see:
- ✅ All code files pushed
- ✅ Commit history preserved
- ✅ .gitignore respected (node_modules excluded)
- ✅ README.md and documentation visible

## Important Notes

- **Replace `YOUR_USERNAME`** with your actual GitHub username
- **HTTPS**: Uses username + personal access token (or OAuth prompt)
- **SSH**: Uses your SSH key (more secure, no password needed)
- **GitHub CLI**: Easiest if authenticated (`gh auth login`)

## If You Get Authentication Errors

### HTTPS with Personal Access Token (PAT):
1. Go to https://github.com/settings/tokens
2. Click **Generate new token (classic)**
3. Select scopes: `repo` (full control)
4. Copy token
5. When prompted for password, paste the token

### SSH Setup:
1. Generate key: `ssh-keygen -t ed25519 -C "your_email@example.com"`
2. Add to GitHub: https://github.com/settings/keys
3. Use SSH URL format: `git@github.com:USERNAME/repo.git`

## After Push: Next Steps

1. **Update local repo config** (if needed):
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your_email@example.com"
   ```

2. **Deploy to Vercel** (already configured):
   - Go to https://vercel.com/new
   - Import from `github.com/YOUR_USERNAME/Pascaltravels.com`
   - Deploy button will auto-detect vercel.json

3. **Repository Setup** (optional):
   - Add custom domain: Settings → GitHub Pages (if needed)
   - Configure branch protection rules
   - Set up CI/CD workflows

---

**Questions?** Let me know which option you want to use, and I'll help!
