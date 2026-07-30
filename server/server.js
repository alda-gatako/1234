require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../public')));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // optional, raises rate limit if set

// GET /api/repos?username=someuser
app.get('/api/repos', async (req, res) => {
  const { username } = req.query;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: 'Please provide a GitHub username.' });
  }

  try {
    const headers = { 'User-Agent': 'api-project-app' };
    if (GITHUB_TOKEN) {
      headers['Authorization'] = `token ${GITHUB_TOKEN}`;
    }

    // Check the user exists first, for a clean error message
    const userRes = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, { headers });
    if (userRes.status === 404) {
      return res.status(404).json({ error: `No GitHub user found called "${username}".` });
    }
    if (userRes.status === 403) {
      return res.status(429).json({ error: 'GitHub API rate limit reached. Please try again in a bit, or add a GITHUB_TOKEN to your .env to raise the limit.' });
    }
    if (!userRes.ok) {
      return res.status(userRes.status).json({ error: 'GitHub API error while looking up user.' });
    }
    const userData = await userRes.json();

    // Fetch up to 100 repos, most recently pushed first
    const repoRes = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=pushed`,
      { headers }
    );

    if (repoRes.status === 403) {
      return res.status(429).json({ error: 'GitHub API rate limit reached. Please try again in a bit.' });
    }
    if (!repoRes.ok) {
      return res.status(repoRes.status).json({ error: 'GitHub API error while fetching repos.' });
    }

    const repos = await repoRes.json();

    const cleaned = repos.map(r => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      language: r.language,
      stars: r.stargazers_count,
      forks: r.forks_count,
      updated: r.pushed_at,
      isFork: r.fork
    }));

    res.json({
      user: {
        login: userData.login,
        avatar: userData.avatar_url,
        name: userData.name,
        bio: userData.bio,
        publicRepos: userData.public_repos,
        followers: userData.followers,
        profileUrl: userData.html_url
      },
      repos: cleaned
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong fetching data. Please try again.' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
