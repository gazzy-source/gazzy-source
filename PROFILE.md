# Maintaining the GazzyLabs profile

The root README appears at https://github.com/gazzy-source. GazzyLabs is the project brand; Gazzy is the personal introduction.

## Layout

Use GitHub's native headings, links, inline code, tables, Mermaid, and collapsible details. The profile has a personal introduction, navigation links, an availability callout, three project highlights, a skills matrix, a simplified architecture diagram, visible metrics, and a contact section.

Each project has an expandable engineering overview. A separate details section explains engineering priorities. Keep the main copy scannable, and put deeper technical material inside details blocks.

The earlier SVG hero and full-width screenshot are not embedded. Existing SVG assets remain available; the refresh still generates the metrics SVG for optional use. The metrics text is visible below Building in public.

## Editing

- Edit the introduction, project descriptions, stack, and contact link directly in README.md.
- Keep both METRICS comment markers below Building in public, outside details blocks. Only the text between them is generated.
- The enquiry link opens a public issue in the NetDash showcase, following that repository's existing contact convention. Replace it with a preferred email or booking URL when available.
- NetDash links to a public showcase, not the private application source.

## Metrics

The workflow runs on script changes, manually from Actions, and daily at 06:23 UTC. GitHub may delay scheduled runs or disable them after extended repository inactivity.

Metrics use public GitHub REST data. The profile repository is excluded. Stars and forks exclude forked repositories. Primary-language counts include archived original repositories and are not proficiency scores. Failures leave the last committed metrics unchanged; the visible date identifies the last successful refresh.

Run locally with Node.js 24: `node --test scripts/metrics.test.mjs`, then `node scripts/refresh.mjs`. An optional GH_TOKEN increases API rate limits. No personal access token is needed in GitHub Actions.

## Design references

Reviewed Anthony Fu (https://github.com/antfu), Sindre Sorhus (https://github.com/sindresorhus), shadcn (https://github.com/shadcn), and Peter Steinberger (https://github.com/steipete). The redesign uses concise introductions and direct project links, with original copy based on Gazzy's public work.
