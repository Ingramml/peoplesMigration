# GitHub Hosting Setup Guide

This guide will walk you through hosting your Phoenix Population Movement Map on GitHub Pages.

## 📋 Prerequisites

1. A GitHub account (create one at https://github.com if you don't have one)
2. Git installed on your computer (check by running `git --version` in terminal)

## 🚀 Step-by-Step Instructions

### Step 1: Initialize Git Repository

Open Terminal and navigate to your project folder, then run:

```bash
cd "/Users/michaelingram/Documents/Website projects/qgis2web_2025_10_21-16_49_50_631239"
git init
```

### Step 2: Add All Files to Git

```bash
git add .
```

### Step 3: Create Your First Commit

```bash
git commit -m "Initial commit: Phoenix Population Movement Map

- Interactive map showing survey activity vs residential locations
- Black arrows indicating movement direction
- Responsive design with layer controls
- District statistics in popups"
```

### Step 4: Create a New Repository on GitHub

1. Go to https://github.com
2. Click the **+** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `phoenix-population-movement-map` (or your preferred name)
   - **Description**: "Interactive web map visualizing population movement patterns across Phoenix City Council Districts"
   - **Visibility**: Choose Public (required for free GitHub Pages hosting)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click **"Create repository"**

### Step 5: Connect Your Local Repository to GitHub

GitHub will show you commands. Use these (replace YOUR-USERNAME and YOUR-REPO-NAME):

```bash
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
git branch -M main
git push -u origin main
```

**Example:**
```bash
git remote add origin https://github.com/michaelingram/phoenix-population-movement-map.git
git branch -M main
git push -u origin main
```

### Step 6: Enable GitHub Pages

1. On your GitHub repository page, click **"Settings"** (top menu)
2. In the left sidebar, click **"Pages"** (under "Code and automation")
3. Under "Build and deployment":
   - **Source**: Select "Deploy from a branch"
   - **Branch**: Select "main" and "/ (root)"
   - Click **"Save"**
4. Wait 1-2 minutes for deployment

### Step 7: Access Your Live Map

Your map will be available at:
```
https://YOUR-USERNAME.github.io/YOUR-REPO-NAME/
```

**Example:**
```
https://michaelingram.github.io/phoenix-population-movement-map/
```

### Step 8: Update README with Your URL

1. Open `README.md` in a text editor
2. Replace `YOUR-USERNAME` and `YOUR-REPO-NAME` with your actual GitHub username and repository name
3. Save the file
4. Commit and push the update:

```bash
git add README.md
git commit -m "Update README with live demo URL"
git push
```

## 🔄 Making Updates Later

Whenever you make changes to your map:

```bash
# 1. Add changed files
git add .

# 2. Commit with a descriptive message
git commit -m "Description of your changes"

# 3. Push to GitHub
git push
```

Your GitHub Pages site will automatically update within 1-2 minutes!

## 🎨 Optional: Custom Domain

If you want to use a custom domain (like `map.yourdomain.com`):

1. In your repository Settings → Pages
2. Under "Custom domain", enter your domain
3. Follow GitHub's instructions to configure DNS

## ✅ Verification Checklist

- [ ] Repository created on GitHub
- [ ] Local repository initialized with `git init`
- [ ] All files committed
- [ ] Remote origin added
- [ ] Files pushed to GitHub
- [ ] GitHub Pages enabled in Settings
- [ ] Live URL working (may take 1-2 minutes)
- [ ] README.md updated with correct URL

## 🛠️ Troubleshooting

### Problem: "git: command not found"
**Solution:** Install Git from https://git-scm.com/downloads

### Problem: Map doesn't load on GitHub Pages
**Solution:**
- Check that all files were committed and pushed
- Verify GitHub Pages is enabled in Settings
- Wait 2-3 minutes for deployment
- Check browser console (F12) for errors

### Problem: "Permission denied (publickey)"
**Solution:**
- Use HTTPS URL instead: `https://github.com/USERNAME/REPO.git`
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### Problem: Map works locally but not on GitHub Pages
**Solution:**
- Ensure all file paths are relative (no absolute paths)
- Check that all referenced files are committed
- Verify file names match exactly (case-sensitive)

## 📚 Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Git Basics Tutorial](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Markdown Guide](https://www.markdownguide.org/) (for editing README)

## 💡 Pro Tips

1. **Branch for experiments**: Create a new branch for testing features:
   ```bash
   git checkout -b feature-timeline-animation
   ```

2. **Keep commits focused**: Each commit should represent one logical change

3. **Write clear commit messages**: Future you will thank you!

4. **Regular backups**: Your code is now safely backed up on GitHub

5. **Share your work**: Share the GitHub Pages URL with colleagues and stakeholders

---

**Need help?** Open an issue on your GitHub repository or consult the GitHub documentation.
