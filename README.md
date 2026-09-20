CodeHub — Frontend

This is a static frontend site intended to be deployed as a static site.

Quick local build & serve

1. Install Node.js (>=14).
2. From the project root run:

   npm install
   npm run build
   npm start

- `npm run build` copies all necessary files into `dist/`.
- `npm start` serves `dist/` on http://localhost:8080 using `http-server`.

Deploy options

- GitHub Pages: push the `dist/` contents to the `gh-pages` branch or configure GitHub Actions to build and deploy.
- Netlify / Vercel: connect this repo and set `npm run build` as the build command and `dist` as the publish folder.

Files included in build

- `index.html`, `about.html`, subject pages, `style.css`, `app.js`, and the `assets/` folder.

If you want, I can add a GitHub Actions workflow to build and deploy automatically.

Git / GitHub

To add this project to GitHub and enable automated deploys:

1. Initialize git locally (if not already):

```sh
git init
git add -A
git commit -m "Initial commit: CodeHub frontend"
```

2. Create a repository on GitHub (via the website) and copy its SSH or HTTPS URL.

3. Push using the helper script included (make executable first on UNIX):

```sh
# set executable permission (UNIX)
chmod +x scripts/push-to-github.sh
./scripts/push-to-github.sh git@github.com:YOUR_USERNAME/YOUR_REPO.git main
```

Or add remote and push manually:

```sh
git remote add origin <repo-url>
git branch -M main
git push -u origin main
```

Once pushed, the GitHub Actions workflow in `.github/workflows/deploy.yml` will run on push to `main` (or `master`) and deploy the `dist/` folder to GitHub Pages.
