\# Dev Portfolio Analyzer



Look up any GitHub user and explore their public repos — sort by stars/forks/recency, filter by language, search by name, hide forks. Useful for developers auditing their own portfolio, or recruiters scanning a candidate's public work at a glance.

\## Live Demo

\- Deployed app (via load balancer, run locally): http://localhost:8080

\- Demo video: https://youtu.be/6eAKRHBeuxQ

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

cp .env.example .env   # optionally add a GITHUB\\\_TOKEN to raise the rate limit

npm start

```

Then visit http://localhost:3000



\## Deployment



The app is containerized with Docker and deployed as three separate services simulating Web01, Web02, and Lb01:



\- \*\*web01\*\* and \*\*web02\*\* — two identical containers, each running the Node.js/Express app

\- \*\*lb01\*\* — an HAProxy container that load-balances traffic between web01 and web02 using round-robin



\### Deployment files

\- `Dockerfile` — builds the Node.js app into a container image

\- `docker-compose.yml` — defines and networks all three services together

\- `haproxy/haproxy.cfg` — HAProxy config, round-robin between web01:3000 and web02:3000



\### How to deploy

```bash

docker compose up -d --build

```

This builds the app image, starts `web01`, `web02`, and `lb01`, and exposes the load balancer on port 8080.



\### How to verify

```bash

docker compose ps          # confirm all 3 containers are Up

docker compose logs -f     # watch requests, refresh http://localhost:8080 a few times

\&#x20;                           # to see requests alternate between web01 and web02

```



Visit \*\*http://localhost:8080\*\* — this is the load balancer's address. Every request is routed to either web01 or web02 automatically.



\## Challenges \& Solutions



\*\*GitHub API rate limiting:\*\* While testing, I discovered the app's error handling had a gap — it caught rate-limit errors (HTTP 403) when fetching a user's repos, but not when fetching the user profile itself. I fixed it by adding the same 403 check to the user-lookup request, so both API calls now fail gracefully with a clear message instead of crashing.



\*\*No cloud provider access:\*\* I didn't have a card available for AWS/cloud hosting, so instead of deploying to remote servers, I containerized the app with Docker and simulated Web01, Web02, and Lb01 as three local containers networked together, with HAProxy handling load balancing exactly as it would on real remote servers.



\*\*Terminal/environment setup:\*\* Coming from limited prior command-line experience, navigating folders and running Node.js/Git/Docker commands took some troubleshooting. Once set up, the actual development process was straightforward.



\## Notes

\- Unauthenticated GitHub API requests are capped at 60 requests/hour per IP address. Add a personal access token (https://github.com/settings/tokens, no special scopes needed) to `.env` as `GITHUB\\\_TOKEN` to raise this limit to 5,000/hour.

\- API errors (rate limits, unknown usernames, network failures) are all caught and shown as clear, user-friendly messages instead of crashing.



\## Author

Gatakokabasinga Alda — \[@alda-gatako](https://github.com/alda-gatako)

