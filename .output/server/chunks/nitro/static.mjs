import { createError } from 'h3';
import { withLeadingSlash, withoutTrailingSlash, parseURL } from 'ufo';
import { promises } from 'fs';
import { resolve, dirname } from 'pathe';
import { fileURLToPath } from 'url';

const assets = {
  "/200.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"aa8-7EWMgI8XehZxCvO/c8zm/w2gvMg\"",
    "mtime": "2021-10-27T20:07:59.779Z",
    "path": "../public/200.html"
  },
  "/deepworks-logo.png": {
    "type": "image/png",
    "etag": "\"1bbc-mNXqJrNTx1AhevcrBKUZMEg+K/g\"",
    "mtime": "2021-10-27T20:07:57.018Z",
    "path": "../public/deepworks-logo.png"
  },
  "/favicon.ico": {
    "type": "image/vnd.microsoft.icon",
    "etag": "\"3c2e-Vq7PaRPg9UV95MCj2CEXYlDnTJs\"",
    "mtime": "2021-10-27T20:07:57.017Z",
    "path": "../public/favicon.ico"
  },
  "/index.html": {
    "type": "text/html; charset=utf-8",
    "etag": "\"aa8-7EWMgI8XehZxCvO/c8zm/w2gvMg\"",
    "mtime": "2021-10-27T20:07:59.757Z",
    "path": "../public/index.html"
  },
  "/seabg.mp4": {
    "type": "video/mp4",
    "etag": "\"1a4da93-86R5MLjmTW6ZEfgJAOA1nQdQTH0\"",
    "mtime": "2021-10-27T20:07:57.013Z",
    "path": "../public/seabg.mp4"
  },
  "/_nuxt/1f1e7f7.js": {
    "type": "application/javascript",
    "etag": "\"1615b-5P4AE8+opxZ+HBx9goTtCtKvMrU\"",
    "mtime": "2021-10-27T20:07:57.021Z",
    "path": "../public/_nuxt/1f1e7f7.js"
  },
  "/_nuxt/29032a1.js": {
    "type": "application/javascript",
    "etag": "\"711-BKDWDq1MLq24jFQsCbIygr0ayeU\"",
    "mtime": "2021-10-27T20:07:57.020Z",
    "path": "../public/_nuxt/29032a1.js"
  },
  "/_nuxt/84b3964.js": {
    "type": "application/javascript",
    "etag": "\"931-hwA4E6P9tqVoa2QHgwIUd9AhtWE\"",
    "mtime": "2021-10-27T20:07:57.020Z",
    "path": "../public/_nuxt/84b3964.js"
  },
  "/_nuxt/a892443.js": {
    "type": "application/javascript",
    "etag": "\"3503f-QFg+zX8j0Pp38deodHlmtw8QmXA\"",
    "mtime": "2021-10-27T20:07:57.020Z",
    "path": "../public/_nuxt/a892443.js"
  },
  "/_nuxt/f3e51f9.js": {
    "type": "application/javascript",
    "etag": "\"7e-BKh/a0+7KwsnITOtHLRCb4T/dMA\"",
    "mtime": "2021-10-27T20:07:57.019Z",
    "path": "../public/_nuxt/f3e51f9.js"
  }
};

const mainDir = dirname(fileURLToPath(globalThis.entryURL));

function readAsset (id) {
  return promises.readFile(resolve(mainDir, getAsset(id).path))
}

function getAsset (id) {
  return assets[id]
}

const METHODS = ["HEAD", "GET"];
const PUBLIC_PATH = "/_nuxt/";
const TWO_DAYS = 2 * 60 * 60 * 24;
const STATIC_ASSETS_BASE = "/site/_nuxt/static" + "/" + "1635365277";
async function serveStatic(req, res) {
  if (!METHODS.includes(req.method)) {
    return;
  }
  let id = withLeadingSlash(withoutTrailingSlash(parseURL(req.url).pathname));
  let asset = getAsset(id);
  if (!asset) {
    const _id = id + "/index.html";
    const _asset = getAsset(_id);
    if (_asset) {
      asset = _asset;
      id = _id;
    }
  }
  if (!asset) {
    if (id.startsWith(PUBLIC_PATH) && !id.startsWith(STATIC_ASSETS_BASE)) {
      throw createError({
        statusMessage: "Cannot find static asset " + id,
        statusCode: 404
      });
    }
    return;
  }
  const ifNotMatch = req.headers["if-none-match"] === asset.etag;
  if (ifNotMatch) {
    res.statusCode = 304;
    return res.end("Not Modified (etag)");
  }
  const ifModifiedSinceH = req.headers["if-modified-since"];
  if (ifModifiedSinceH && asset.mtime) {
    if (new Date(ifModifiedSinceH) >= new Date(asset.mtime)) {
      res.statusCode = 304;
      return res.end("Not Modified (mtime)");
    }
  }
  if (asset.type) {
    res.setHeader("Content-Type", asset.type);
  }
  if (asset.etag) {
    res.setHeader("ETag", asset.etag);
  }
  if (asset.mtime) {
    res.setHeader("Last-Modified", asset.mtime);
  }
  if (id.startsWith(PUBLIC_PATH)) {
    res.setHeader("Cache-Control", `max-age=${TWO_DAYS}, immutable`);
  }
  const contents = await readAsset(id);
  return res.end(contents);
}

export { serveStatic as default };
