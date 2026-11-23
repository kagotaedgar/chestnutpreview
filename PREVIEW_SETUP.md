# GitHub Pages preview setup

This package adds preview-only deployment configuration. The Chestnut website source/design/content is unchanged.

1. Upload the extracted project files to the root of your GitHub repository (replace the existing README if asked; retain all project files).
2. In GitHub, open **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push/commit the files to the `main` branch. The workflow builds the existing site, runs its QA checker, adjusts root paths dynamically for the repository preview path, and deploys the generated `dist` folder.
4. Check **Actions** for the workflow's green check. Preview URL: `https://kagotaedgar.github.io/<repository-name>/`.

This workflow is for temporary GitHub Pages preview only. The normal `node build.mjs` output remains unchanged for Cloudflare Pages and the Chestnut custom domain.
