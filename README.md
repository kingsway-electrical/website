# Kingsway Electrical — website

Static marketing site for Kingsway Electrical, hosted on GitHub Pages.

## Stack

- Plain HTML + CSS (no build step, no framework).
- Deployed automatically to GitHub Pages via GitHub Actions
  (`.github/workflows/deploy.yml`) on every push to `main`.

## Local preview

It's a static site — open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

| Path                         | Purpose                                  |
| ---------------------------- | ---------------------------------------- |
| `index.html`                 | The single-page site.                    |
| `styles.css`                 | Styling.                                 |
| `.github/workflows/deploy.yml` | CI: build + deploy to GitHub Pages.    |
| `.nojekyll`                  | Tells Pages to skip Jekyll processing.   |
| `CNAME`                      | Custom domain (added once chosen).       |

## TODO

- Real company bio, certifications and contact details (placeholders in `index.html`).
- Project photo gallery.
- Custom domain + DNS records.
