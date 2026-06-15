# Kingsway Electrical website

Marketing site for **Kingsway Electrical Contractors Ltd**, a NAPIT-registered
electrician based in Tunbridge Wells. Live at
**[kingsway-electrical.com](https://kingsway-electrical.com)**.

## Stack

- Plain HTML, CSS and a little vanilla JavaScript. No framework, and no build
  step to serve.
- The photo galleries are driven by a single JSON manifest (`gallery.json`)
  rendered client-side by `assets/gallery.js`.
- Deployed to GitHub Pages by GitHub Actions (`.github/workflows/deploy.yml`)
  on every push to `main`.

## Pages and key files

| Path                | Purpose                                             |
| ------------------- | --------------------------------------------------- |
| `index.html`        | Home: hero, services, accreditations, FAQ, contact. |
| `residential.html`  | Domestic gallery.                                   |
| `commercial.html`   | Commercial / industrial gallery.                    |
| `styles.css`        | All styling.                                        |
| `assets/gallery.js` | Gallery and lightbox renderer (reads `gallery.json`). |
| `gallery.json`      | Generated manifest of every gallery photo.          |
| `assets/`           | Logos, accreditation badges, favicons, share image. |

## SEO and discoverability

- Per-page titles, meta descriptions, canonical URLs and Open Graph / Twitter
  cards (`assets/og-image.png`).
- `Electrician` (LocalBusiness) and `FAQPage` structured data on the homepage.
- `sitemap.xml`, `robots.txt` (AI crawlers welcomed) and `llms.txt`.

## Local preview

It is a static site, so serve the folder and open it in a browser:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

Opening `index.html` directly mostly works, but the galleries fetch
`gallery.json` over HTTP, so use a server to see them.

## Galleries

`gallery.json` is generated, not hand-written. The original photos and the build
tooling (`scripts/`, `media-src/`) live locally and are not committed: the
scripts optimise the source images to WebP under `assets/gallery/` and assemble
the manifest. For a small ordering tweak, edit `gallery.json` directly; for a
full rebuild, rerun the local tooling.

## Domain

`CNAME` points the site at `kingsway-electrical.com`; `.nojekyll` disables Jekyll
processing on Pages.

## To do

- Replace the placeholder About copy with Josh's real bio.
