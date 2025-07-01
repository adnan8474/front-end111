# POCTIFY CodeShare Detector

This project is a frontend-only React application to analyse POCT device logs.
It detects potential operator misuse and provides charts and summaries.

## Setup

```bash
npm install
npm run dev
```

Visit `http://localhost:5173` to view the app. Upload a CSV or XLSX file
matching the template in `public/template.csv`.

## Build & Deploy

```bash
npm run build
```

Deploy the contents of `dist/` to Netlify or any static host.
When connecting the repository to Netlify, create a `netlify.toml` file specifying the build command and publish directory:

```toml
[build]
  command = "npm run build"
  publish = "dist"
```


To ensure routing works on Netlify, include the `_redirects` file in the `public/` directory with the following content:
```
/*    /index.html   200
```
This allows React Router to handle client-side routes after deployment.
