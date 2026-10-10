# Maintaining the GazzyLabs profile

The root README appears at https://github.com/gazzy-source. GazzyLabs is the display brand.

- Edit the introduction, project cards, toolkit, and contact link directly in README.md.
- Keep both METRICS comment markers. Only the content between them is generated.
- The header and metrics graphics are SVGs stored in this repository. No external stats-image host is required.
- The NetDash image comes from its public showcase repository. Its heartbeat history uses sample data, as disclosed in the README.
- The enquiry link opens a public issue in the NetDash showcase, following that repository's existing contact convention. Replace it with a preferred email or booking URL when available.
- The workflow runs on script changes, manually from Actions, and daily at 06:23 UTC. GitHub may delay scheduled runs or disable them after extended repository inactivity.
- Metrics use public GitHub REST data. The profile repository is excluded. Stars and forks exclude forked repositories. Primary-language counts include archived original repositories and are not proficiency scores.
- Failures leave the last committed metrics unchanged. The visible date identifies the last successful refresh.
- Run locally with Node.js 24: `node --test scripts/metrics.test.mjs`, then `node scripts/refresh.mjs`. An optional GH_TOKEN increases API rate limits. No personal access token is needed in GitHub Actions.
