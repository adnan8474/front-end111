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
Numeric Excel date values are also supported and will be converted
automatically during parsing.

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

## Usage Instructions

1. Launch the app and navigate to the **Dashboard**.
2. Click **Browse** to select your log file (CSV or XLSX) or drag it onto the upload field.
3. Ensure your file matches the column order in `public/template.csv`.
4. After upload the dashboard will display summary statistics, charts and a full table of records.
5. Use the **Export CSV** button in the Suspicious Operators table to download results.
6. Generate a PDF report using the export controls when reviewing the dashboard.

## Advanced Settings

The dashboard includes an **Advanced Settings** panel where you can configure working hours, toggle the night shift penalty and set the thresholds that mark an operator as suspicious. The results table and charts update automatically whenever these values change.

Exported CSV reports now include a breakdown of scoring factors and the percentage of night-shift tests so you can better understand why an operator was flagged.
