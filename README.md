\# Dev Portfolio Analyzer



Look up any GitHub user and explore their public repos — sort by stars/forks/recency, filter by language, search by name, hide forks. Useful for developers auditing their own portfolio, or recruiters scanning a candidate's public work at a glance.



\## Live Demo

\- Deployed app (via load balancer): \*coming soon\*

\- Demo video: \*coming soon\*



\## Features

\- Search any GitHub username and view their public profile + repos

\- Sort by most stars, most forks, recently updated, or name (A-Z)

\- Filter by programming language

\- Filter/search repos by name

\- Toggle to hide forked repos

\- Clear error handling for invalid usernames, missing input, and API rate limits



\## APIs Used

\- \[GitHub REST API](https://docs.github.com/en/rest) — public user and repository data. Thanks to GitHub for providing free public API access.



\## Run Locally

```bash

cd server

npm install

cp .env.example .env   # optionally add a GITHUB\_TOKEN to raise the rate limit

npm start

```

Then visit http://localhost:3000



\## Deployment

\*Instructions for deploying to Web01, Web02, and configuring the Lb01 load balancer will be added here once server access is confirmed.\*



\## Challenges \& Solutions



\*\*GitHub API rate limiting:\*\* While testing, I discovered the app's error handling had a gap — it caught rate-limit errors (HTTP 403) when fetching a user's repos, but not when fetching the user profile itself. This showed up as a generic error message instead of a clear "try again later" message. I fixed it by adding the same 403 check to the user-lookup request, so both API calls now fail gracefully with a clear message instead of crashing or confusing the user.



\*\*Terminal/environment setup:\*\* Coming from limited prior command-line experience, navigating folders and running Node.js/Git commands took some troubleshooting (e.g. figuring out how to open a terminal in the correct project folder on Windows). Once set up, the actual development process was straightforward.



\## Notes

\- Unauthenticated GitHub API requests are capped at 60 requests/hour per IP address. Add a personal access token (https://github.com/settings/tokens, no special scopes needed) to `.env` as `GITHUB\_TOKEN` to raise this limit to 5,000/hour.

\- API errors (rate limits, unknown usernames, network failures) are all caught and shown as clear, user-friendly messages instead of crashing.



\## Author

Gatakokabasinga Alda — \[@alda-gatako](https://github.com/alda-gatako)

