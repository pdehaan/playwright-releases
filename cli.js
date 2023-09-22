#!/usr/bin/env node

import * as lib from "./lib.js";

const releases = await lib.fetchReleases("microsoft", "playwright");
const browserVersions = await lib.parseBrowserVersions(releases);

console.log(JSON.stringify(browserVersions, null, 2));
