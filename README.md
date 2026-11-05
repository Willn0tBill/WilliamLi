# William Li — Portfolio

A personal portfolio showcasing selected websites, digital products, tools, and games by William Li.

**Repository:** https://github.com/Willn0tBill/WilliamLi  
**GitHub Pages URL (after Pages is enabled):** https://willn0tbill.github.io/WilliamLi/

## What's included

- An editorial-style, responsive homepage with original CSS-drawn project artwork.
- Selected projects with links to real, public GitHub repositories.
- Project filters for games, tools, and websites.
- Light and dark themes with an optional saved preference.
- Mobile navigation, keyboard-accessible controls, and reduced-motion support.
- Simple SEO/Open Graph metadata and a custom vector favicon.
- No JavaScript framework, build step, API key, or paid hosting required.

Project preview visuals are **illustrations**, not screenshots or assertions of live game data. The numerical figures appearing in visual mockups are decorative.

## File structure

| File | Purpose |
| --- | --- |
| \`index.html\` | Page content and accessible structure |
| \`styles.css\` | Layout, responsive design, themes, and illustrations |
| \`script.js\` | Appearance toggle, menu, filters, scroll reveals |
| \`favicon.svg\` | Site icon |

## Preview locally

Open \`index.html\` in a browser. No installation is required. For a local development server, run:

\`\`\`bash
python -m http.server 8000
\`\`\`

Then visit \`http://localhost:8000\`.

## Publish for free using GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select **main**, folder **/(root)**, then **Save**.
4. After GitHub completes the deployment, use the **Visit site** button or open https://willn0tbill.github.io/WilliamLi/.

When you push changes to \`main\`, GitHub Pages will redeploy automatically.

## Customization

- Change headings, introduction, project descriptions, and links in \`index.html\`.
- Adjust the color palette through the CSS variables at the top of \`styles.css\`.
- Add another project by copying a \`.project-card\` and setting its \`data-category\` to \`games\`, \`tools\`, or \`websites\`. Update the displayed total in the "All work" filter.
- Replace the illustrated project previews with your own genuine screenshots whenever available.
- The contact area currently links to GitHub and intentionally doesn't publish personal contact details.

## Notes

Fonts are loaded from Google Fonts when online, with system-font fallbacks when offline. The project has no other runtime dependencies. For production, verify project descriptions and URLs as projects evolve.

© William Li.
