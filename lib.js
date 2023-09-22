import * as Cheerio from "cheerio";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import { Octokit } from "octokit";

export async function fetchReleases(owner = "", repo = "", auth) {
  const octokit = new Octokit({
    auth,
  });
  const releases = await octokit.request("GET /repos/{owner}/{repo}/releases", {
    owner,
    repo,
    headers: {
      "X-GitHub-Api-Version": "2022-11-28",
    },
  });
  return releases.data;
}

export async function parseBrowserVersions(releases = []) {
  const md = markdownIt().use(markdownItAnchor, {});

  return releases.reduce((acc, r) => {
    const name = r.name;
    const createdAt = new Date(r.created_at);
    const html = md.render(r.body);
    const $ = Cheerio.load(html);
    const browserVersions = $(`
      h2[id='browser-versions'] ~ ul li,
      h3[id='browser-versions'] ~ ul li
    `)
      .map(function () {
        return $(this).text().trim();
      })
      .get();
    acc.push({
      name,
      createdAt,
      browserVersions,
    });
    return acc;
  }, []);
}
