# Dev Portfolio Analyzer

Look up any GitHub user and explore their public repos — sort by stars/forks/recency, filter by language, search by name, hide forks. Useful for developers auditing their own portfolio or recruiters scanning a candidate's public work.

## APIs Used
- [GitHub REST API](https://docs.github.com/en/rest) — public repo/user data. Thanks to GitHub for the free public API.

## Run Locally
```bash
cd server
npm install
cp .env.example .env   # optionally add a GITHUB_TOKEN to raise the rate limit
npm start
```
Visit http://localhost:3000

## Notes
- Unauthenticated GitHub API requests are capped at 60/hour per IP. Add a personal access token (https://github.com/settings/tokens, no scopes needed) to `.env` as `GITHUB_TOKEN` to raise this to 5000/hour.
- API errors (rate limits, unknown users, network failures) are all caught and shown as clear messages instead of crashing.
