# William Li — Portfolio

A modern static portfolio showcasing public websites, software, games, and project case studies by William Li.

**Live:** https://willn0tbill.github.io/WilliamLi/
**Repository:** https://github.com/Willn0tBill/WilliamLi

## Current features

- Ten public projects with **real website screenshots**, not generated mockups.
- Five **interactive featured project flip cards**: hover on desktop; tap or press Enter on touch/keyboard; Escape or Back to preview closes. Each reverse face has a description, tech tags, and Website/GitHub/Case Study links. The remaining public projects stay in a simpler archive.
- Seven detailed case studies: ProfitLands, SwiftSupply Ops, Troop 710, NationWars, Paw Prints Weekly, SwiftSupply, and Wtv Innovations.
- Dedicated **Website**, **GitHub**, and **Case study** links where available.
- Searchable project directory with category filters, an accessible result count, and an empty-state message.
- Mobile navigation, light/dark mode, reduced-motion support, skip links, SEO metadata, sitemap, and 404 page.
- A separate **Contact** page for drafting a public GitHub issue and copying an inquiry.
- A **Support My Work** section; monetary donations remain disabled until a verified provider URL is supplied.

## Verified screenshots

Images captured from public sites in November 2026 are stored under `assets/screenshots/`: `profitlands.jpg`, `swiftsupplyops.jpg`, `troop710.jpg`, `nationwars.jpg`, `ppw.jpg`, `wtvi.jpg`, `swiftsupply.jpg`, `nrn.jpg`, `nre.jpg`, and `li-fruits.jpg`.

These are real browser captures. They do **not** assert that all game modes or outside services have been independently verified. SwiftSupply Ops displays only its public sign-in page, not internal business information. The Troop 710 site contains illustrative stock imagery within its genuine webpage screenshot.

## Case study pages

- [ProfitLands](case-studies/profitlands.html)
- [SwiftSupply Ops](case-studies/swiftsupply-ops.html)
- [Troop 710](case-studies/troop710.html)
- [NationWars](case-studies/nationwars.html)
- [Paw Prints Weekly](case-studies/paw-prints-weekly.html)
- [SwiftSupply](case-studies/swiftsupply.html)
- [Wtv Innovations](case-studies/wtv-innovations.html)

Each page includes a real screenshot, project challenge, implementation approach, features, technologies, and a clear status/limitations note. The three other public projects appear in the archive with screenshot, Website, and GitHub links.

## Contact and inquiries

`contact.html` provides a project-brief form implemented in `contact.js` without a backend or personal email address. It requires no account to draft. The **Review on GitHub** button prepares a **public GitHub issue draft** at this repository; the visitor must sign into GitHub, review it, and submit it themselves. Clicking the website button alone does **not** send a message. The **Copy inquiry** button provides a clipboard alternative.

The form explicitly warns against publishing addresses, personal contact information, customer records, passwords, and confidential details in GitHub issues. It stores no visitor messages or personal data. This is **not** a private contact method; add a private channel only when the owner intentionally approves one.

## Files

| Path | Purpose |
| --- | --- |
| `index.html` | Homepage and portfolio directory |
| `styles.css`, `polish.css`, `script.js` | Shared styling and interactions |
| `flip-cards.css` | 3D featured cards with mobile, keyboard, and reduced-motion styles |
| `assets/screenshots/` | Real project screenshots |
| `case-studies/*.html`, `case-studies/case.css` | Seven detailed case studies |
| `contact.html`, `contact.css`, `contact.js` | Inquiry drafting and privacy-aware UX |
| `brand-mark-v4.svg`, `favicon.svg` | Branding |
| `404.html`, `robots.txt`, `sitemap.xml` | Error page and discoverability |

## Run and publish

Open `index.html` in a browser or run `python -m http.server 8000` in the repository, then open `http://localhost:8000`.

On GitHub, publish from **Settings → Pages → Deploy from a branch → main → /(root)**. The expected URL is https://willn0tbill.github.io/WilliamLi/. Commits may precede live deployment.

## Donations

The Support section links to public GitHub projects and the profile. Monetary donations intentionally remain off until an appropriate verified external HTTPS page is available. Set `const DONATION_URL = '';` in `script.js` to the selected public payment page only after account eligibility and owner approval. Never place credentials or banking details in public code.

## Quality and privacy notes

- Real public screenshots captured and stored, with no authenticated internal screens captured.
- Browser smoke tests run for desktop and mobile layouts. A 390px viewport overflow caused by decorative background artwork was found and fixed.
- Search and category filters tested, including a Troop 710 query and the Games filter.
- GitHub issue URL creation and the feedback text were tested without creating an actual issue.
- JavaScript syntax checked, and GitHub Pages paths/links must be kept current as public projects evolve.

© William Li.
