# William Li — Portfolio

A personal portfolio showcasing selected websites, digital products, tools, and games by William Li.

**Repository:** https://github.com/Willn0tBill/WilliamLi  
**GitHub Pages URL (after Pages is enabled):** https://willn0tbill.github.io/WilliamLi/

## Project coverage

The site now lists **10 public repositories**: five featured projects (ProfitLands, SwiftSupply Ops, Troop 710, NationWars, Paw Prints Weekly) and five additional projects (Wtv Innovations, SwiftSupply, New Republic Network, NRE Empire, Li's Trees and Fruits).

Private and local-only projects are intentionally omitted from the public-facing site until suitable public descriptions or permissions are available. Project filters support multiple categories per card.

## What's included

- A refined editorial-style homepage with a real project index and original CSS-drawn project illustrations.
- Selected projects with links to real, public GitHub repositories.
- Project filters for games, tools, websites, and community projects.
- Light and dark themes with an optional saved preference.
- A Support section with working GitHub star/follow links and a ready-to-configure donation button.
- Mobile navigation, keyboard-accessible controls, and reduced-motion support.
- Simple SEO/Open Graph metadata and a custom vector favicon.
- No JavaScript framework, build step, API key, or paid hosting required.

Project previews are **illustrations**, not screenshots. Any visual mockup text is illustrative, not an assertion about live project data.

## File structure

| File | Purpose |
| --- | --- |
| `index.html` | Page content and accessible structure |
| `styles.css` | Base layout, themes, and CSS-drawn project illustrations |
| `polish.css` | Editorial refinement, responsive project links, and support section |
| `script.js` | Appearance toggle, menu, filters, scroll reveals |
| `favicon.svg` | Site icon |

## Preview locally

Open `index.html` in a browser. No installation is required. For a local development server, run:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publish for free using GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main**, folder **/(root)**, then **Save**.
4. After GitHub completes the deployment, use the **Visit site** button or open https://willn0tbill.github.io/WilliamLi/.

When you push changes to `main`, GitHub Pages will redeploy automatically.

## Support and donations

The portfolio's **Support** section is visible at `#support`. Visitors can already follow the GitHub account and star public repositories. Monetary donations are deliberately **not active** until a real HTTPS donation destination is configured.

To activate a monetary donation link:

1. Use a legitimate payment or donations account managed by someone who meets the provider's requirements. Do not publish bank credentials, API keys, or private account information.
2. In `script.js`, set `const DONATION_URL = '';` to the public HTTPS payment page URL.
3. Commit that change. The site automatically shows a **Donate securely** link in the Support panel. The visitor completes payment entirely on the external provider.
4. Test the link yourself before sharing it. If it is empty or malformed, the button stays hidden and the page shows the truthful unavailable state.

The website does not collect or process payments. Do not call the donation link live until it is actually configured.

## Customization

- Change headings, introduction, project descriptions, and links in `index.html`.
- Adjust the color palette through the CSS variables at the top of `styles.css`.
- Add another project by copying a `.project-card` and setting its `data-category` to `games`, `tools`, or `websites`. Update the displayed total in the "All work" filter.
- Replace the illustrated project previews with your own genuine screenshots whenever available.
- The contact area currently links to GitHub and intentionally doesn't publish personal contact details.

## Notes

Fonts are loaded from Google Fonts when online, with system-font fallbacks when offline. The project has no other runtime dependencies. For production, verify project descriptions and URLs as projects evolve.

© William Li.
