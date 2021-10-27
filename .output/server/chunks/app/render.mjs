import require$$0 from 'unenv/runtime/npm/consola';
import destr from 'destr';
import defu from 'defu';

const _runtimeConfig = {"public":{"_app":{"basePath":"/site/","assetsPath":"/site/_nuxt/","cdnURL":null}},"private":{}};
for (const type of ["private", "public"]) {
  for (const key in _runtimeConfig[type]) {
    _runtimeConfig[type][key] = destr(process.env[key] || _runtimeConfig[type][key]);
  }
}
const privateConfig = deepFreeze(defu(_runtimeConfig.private, _runtimeConfig.public));
const publicConfig = deepFreeze(_runtimeConfig.public);
function deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      deepFreeze(value);
    }
  }
  return Object.freeze(object);
}

const IS_JS_RE = /\.[cm]?js(\?[^.]+)?$/;
const IS_MODULE_RE = /\.mjs(\?[^.]+)?$/;
const HAS_EXT_RE = /[^./]+\.[^./]+$/;
const IS_CSS_RE = /\.(css|postcss|sass|scss|less|stylus|styl)(\?[^.]+)?$/;
function isJS(file) {
  return IS_JS_RE.test(file) || !HAS_EXT_RE.test(file);
}
function isModule(file) {
  return IS_MODULE_RE.test(file) || !HAS_EXT_RE.test(file);
}
function isCSS(file) {
  return IS_CSS_RE.test(file);
}
function getExtension(file) {
  const withoutQuery = file.replace(/\?.*/, "");
  return withoutQuery.split(".").pop() || "";
}
function ensureTrailingSlash(path) {
  if (path === "") {
    return path;
  }
  return path.replace(/([^/])$/, "$1/");
}
function getPreloadType(ext) {
  if (ext === "js" || ext === "cjs" || ext === "mjs") {
    return "script";
  } else if (ext === "css") {
    return "style";
  } else if (/jpe?g|png|svg|gif|webp|ico/.test(ext)) {
    return "image";
  } else if (/woff2?|ttf|otf|eot/.test(ext)) {
    return "font";
  } else {
    return void 0;
  }
}

function createRendererContext({ clientManifest, publicPath, basedir, shouldPrefetch, shouldPreload }) {
  const manifest = normalizeClientManifest(clientManifest);
  const manifestEntries = Object.entries(manifest);
  return {
    shouldPrefetch: shouldPrefetch || (() => true),
    shouldPreload: shouldPreload || ((_file, asType) => ["module", "script", "style"].includes(asType)),
    publicPath: ensureTrailingSlash(publicPath || clientManifest.publicPath || "/"),
    clientManifest: manifest,
    basedir,
    _dependencies: {},
    _dependencySets: {},
    _entrypoints: manifestEntries.filter((e) => e[1].isEntry).map(([module]) => module),
    _dynamicEntrypoints: manifestEntries.filter((e) => e[1].isDynamicEntry).map(([module]) => module)
  };
}
function isLegacyClientManifest(clientManifest) {
  return "all" in clientManifest && "initial" in clientManifest;
}
function getIdentifier(output) {
  return output ? `_${output}` : null;
}
function normalizeClientManifest(manifest = {}) {
  if (!isLegacyClientManifest(manifest)) {
    return manifest;
  }
  const clientManifest = {};
  for (const outfile of manifest.all) {
    if (isJS(outfile)) {
      clientManifest[getIdentifier(outfile)] = {
        file: outfile
      };
    }
  }
  const first = getIdentifier(manifest.initial.find(isJS));
  if (first) {
    if (!(first in clientManifest)) {
      throw new Error(`Invalid manifest - initial entrypoint not in \`all\`: ${manifest.initial.find(isJS)}`);
    }
    clientManifest[first].css = [];
    clientManifest[first].assets = [];
    clientManifest[first].dynamicImports = [];
  }
  for (const outfile of manifest.initial) {
    if (isJS(outfile)) {
      clientManifest[getIdentifier(outfile)].isEntry = true;
    } else if (isCSS(outfile) && first) {
      clientManifest[first].css.push(outfile);
    } else if (first) {
      clientManifest[first].assets.push(outfile);
    }
  }
  for (const outfile of manifest.async) {
    if (isJS(outfile)) {
      const identifier = getIdentifier(outfile);
      if (!(identifier in clientManifest)) {
        throw new Error(`Invalid manifest - async module not in \`all\`: ${outfile}`);
      }
      clientManifest[identifier].isDynamicEntry = true;
      clientManifest[first].dynamicImports.push(identifier);
    } else if (first) {
      const key = isCSS(outfile) ? "css" : "assets";
      const identifier = getIdentifier(outfile);
      clientManifest[identifier] = {
        file: "",
        [key]: [outfile]
      };
      clientManifest[first].dynamicImports.push(identifier);
    }
  }
  for (const [moduleId, importIndexes] of Object.entries(manifest.modules)) {
    const jsFiles = importIndexes.map((index) => manifest.all[index]).filter(isJS);
    jsFiles.forEach((file) => {
      const identifier = getIdentifier(file);
      clientManifest[identifier] = {
        ...clientManifest[identifier],
        file
      };
    });
    const mappedIndexes = importIndexes.map((index) => manifest.all[index]);
    clientManifest[moduleId] = {
      file: "",
      imports: jsFiles.map((id) => getIdentifier(id)),
      css: mappedIndexes.filter(isCSS),
      assets: mappedIndexes.filter((i) => !isJS(i) && !isCSS(i))
    };
  }
  return clientManifest;
}
function getModuleDependencies(id, rendererContext) {
  if (rendererContext._dependencies[id]) {
    return rendererContext._dependencies[id];
  }
  const dependencies = {
    scripts: {},
    styles: {},
    preload: {},
    prefetch: {}
  };
  const meta = rendererContext.clientManifest[id];
  if (!meta) {
    rendererContext._dependencies[id] = dependencies;
    return dependencies;
  }
  if (meta.file) {
    const type = isModule(meta.file) ? "module" : "script";
    dependencies.scripts[id] = { path: meta.file, type };
    dependencies.preload[id] = { path: meta.file, type };
  }
  for (const css of meta.css || []) {
    dependencies.styles[css] = { path: css };
    dependencies.preload[css] = { path: css, type: "style" };
    dependencies.prefetch[css] = { path: css };
  }
  for (const asset of meta.assets || []) {
    dependencies.preload[asset] = { path: asset, type: getPreloadType(asset), extension: getExtension(asset) };
    dependencies.prefetch[asset] = { path: asset };
  }
  for (const depId of meta.imports || []) {
    const depDeps = getModuleDependencies(depId, rendererContext);
    Object.assign(dependencies.styles, depDeps.styles);
    Object.assign(dependencies.preload, depDeps.preload);
    Object.assign(dependencies.prefetch, depDeps.prefetch);
  }
  const filteredPreload = {};
  for (const id2 in dependencies.preload) {
    const dep = dependencies.preload[id2];
    if (rendererContext.shouldPreload(dep.path, dep.type)) {
      filteredPreload[id2] = dependencies.preload[id2];
    }
  }
  dependencies.preload = filteredPreload;
  rendererContext._dependencies[id] = dependencies;
  return dependencies;
}
function getAllDependencies(ids, rendererContext) {
  var _a;
  const cacheKey = Array.from(ids).join(",");
  if (rendererContext._dependencySets[cacheKey]) {
    return rendererContext._dependencySets[cacheKey];
  }
  const allDeps = {
    scripts: {},
    styles: {},
    preload: {},
    prefetch: {}
  };
  for (const id of ids) {
    const deps = getModuleDependencies(id, rendererContext);
    Object.assign(allDeps.scripts, deps.scripts);
    Object.assign(allDeps.styles, deps.styles);
    Object.assign(allDeps.preload, deps.preload);
    Object.assign(allDeps.prefetch, deps.prefetch);
    for (const dynamicDepId of ((_a = rendererContext.clientManifest[id]) == null ? void 0 : _a.dynamicImports) || []) {
      const dynamicDeps = getModuleDependencies(dynamicDepId, rendererContext);
      Object.assign(allDeps.prefetch, dynamicDeps.scripts);
      Object.assign(allDeps.prefetch, dynamicDeps.styles);
      Object.assign(allDeps.prefetch, dynamicDeps.preload);
      Object.assign(allDeps.prefetch, dynamicDeps.prefetch);
    }
  }
  for (const id in allDeps.prefetch) {
    if (id in allDeps.preload) {
      delete allDeps.prefetch[id];
    }
  }
  rendererContext._dependencySets[cacheKey] = allDeps;
  return allDeps;
}
function getRequestDependencies(ssrContext, rendererContext) {
  if (ssrContext._requestDependencies) {
    return ssrContext._requestDependencies;
  }
  const ids = new Set(Array.from([
    ...rendererContext._entrypoints,
    ...ssrContext.modules || ssrContext._registeredComponents || []
  ]));
  const deps = getAllDependencies(ids, rendererContext);
  ssrContext._requestDependencies = deps;
  return deps;
}
function renderStyles(ssrContext, rendererContext) {
  const { styles } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(styles).map(({ path }) => `<link rel="stylesheet" href="${rendererContext.publicPath}${path}">`).join("");
}
function renderResourceHints(ssrContext, rendererContext) {
  return renderPreloadLinks(ssrContext, rendererContext) + renderPrefetchLinks(ssrContext, rendererContext);
}
function renderPreloadLinks(ssrContext, rendererContext) {
  const { preload } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(preload).map((file) => {
    const rel = file.type === "module" ? "modulepreload" : "preload";
    const as = file.type ? file.type === "module" ? ' as="script"' : ` as="${file.type}"` : "";
    const type = file.type === "font" ? ` type="font/${file.extension}" crossorigin` : "";
    return `<link rel="${rel}" href="${rendererContext.publicPath}${file.path}"${as}${type}>`;
  }).join("");
}
function renderPrefetchLinks(ssrContext, rendererContext) {
  const { prefetch } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(prefetch).map(({ path }) => `<link ${isModule(path) ? 'type="module" ' : ""}rel="prefetch" href="${rendererContext.publicPath}${path}">`).join("");
}
function renderScripts(ssrContext, rendererContext) {
  const { scripts } = getRequestDependencies(ssrContext, rendererContext);
  return Object.values(scripts).map(({ path, type }) => `<script${type === "module" ? ' type="module"' : ""} src="${rendererContext.publicPath}${path}" defer><\/script>`).join("");
}
function createRenderer(createApp, renderOptions) {
  const rendererContext = createRendererContext(renderOptions);
  return {
    async renderToString(ssrContext) {
      ssrContext._registeredComponents = ssrContext._registeredComponents || new Set();
      const _createApp = await Promise.resolve(createApp).then((r) => r.default || r);
      const app = await _createApp(ssrContext);
      const html = await renderOptions.renderToString(app, ssrContext);
      const wrap = (fn) => () => fn(ssrContext, rendererContext);
      return {
        html,
        renderResourceHints: wrap(renderResourceHints),
        renderStyles: wrap(renderStyles),
        renderScripts: wrap(renderScripts)
      };
    }
  };
}

var consola = require$$0;
var chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_$';
var unsafeChars = /[<>\b\f\n\r\t\0\u2028\u2029]/g;
var reserved = /^(?:do|if|in|for|int|let|new|try|var|byte|case|char|else|enum|goto|long|this|void|with|await|break|catch|class|const|final|float|short|super|throw|while|yield|delete|double|export|import|native|return|switch|throws|typeof|boolean|default|extends|finally|package|private|abstract|continue|debugger|function|volatile|interface|protected|transient|implements|instanceof|synchronized)$/;
var escaped = {
    '<': '\\u003C',
    '>': '\\u003E',
    '/': '\\u002F',
    '\\': '\\\\',
    '\b': '\\b',
    '\f': '\\f',
    '\n': '\\n',
    '\r': '\\r',
    '\t': '\\t',
    '\0': '\\0',
    '\u2028': '\\u2028',
    '\u2029': '\\u2029'
};
var objectProtoOwnPropertyNames = Object.getOwnPropertyNames(Object.prototype).sort().join('\0');
// workaround to disable warnings, see https://github.com/nuxt/nuxt.js/issues/4026 for details
var defaultLogLevel = process.env.NUXT_ENV_DEVALUE_LOG_LEVEL || 'warn';
var logLimit = parseInt(process.env.NUXT_ENV_DEVALUE_LOG_LIMIT) || 99;
function devalue(value, level) {
    if (level === void 0) { level = defaultLogLevel; }
    var counts = new Map();
    var logNum = 0;
    function log(message) {
        if (logNum < logLimit) {
            consola[level](message);
            logNum += 1;
        }
    }
    function walk(thing) {
        if (typeof thing === 'function') {
            consola[level]("Cannot stringify a function " + thing.name);
            return;
        }
        if (counts.has(thing)) {
            counts.set(thing, counts.get(thing) + 1);
            return;
        }
        counts.set(thing, 1);
        if (!isPrimitive(thing)) {
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                case 'Date':
                case 'RegExp':
                    return;
                case 'Array':
                    thing.forEach(walk);
                    break;
                case 'Set':
                case 'Map':
                    Array.from(thing).forEach(walk);
                    break;
                default:
                    var proto = Object.getPrototypeOf(thing);
                    if (proto !== Object.prototype &&
                        proto !== null &&
                        Object.getOwnPropertyNames(proto).sort().join('\0') !== objectProtoOwnPropertyNames) {
                        if (typeof thing.toJSON !== "function") {
                            log("Cannot stringify arbitrary non-POJOs " + thing.constructor.name);
                        }
                    }
                    else if (Object.getOwnPropertySymbols(thing).length > 0) {
                        log("Cannot stringify POJOs with symbolic keys " + Object.getOwnPropertySymbols(thing).map(function (symbol) { return symbol.toString(); }));
                    }
                    else {
                        Object.keys(thing).forEach(function (key) { return walk(thing[key]); });
                    }
            }
        }
    }
    walk(value);
    var names = new Map();
    Array.from(counts)
        .filter(function (entry) { return entry[1] > 1; })
        .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (entry, i) {
        names.set(entry[0], getName(i));
    });
    function stringify(thing) {
        if (names.has(thing)) {
            return names.get(thing);
        }
        if (isPrimitive(thing)) {
            return stringifyPrimitive(thing);
        }
        var type = getType(thing);
        switch (type) {
            case 'Number':
            case 'String':
            case 'Boolean':
                return "Object(" + stringify(thing.valueOf()) + ")";
            case 'RegExp':
                return thing.toString();
            case 'Date':
                return "new Date(" + thing.getTime() + ")";
            case 'Array':
                var members = thing.map(function (v, i) { return i in thing ? stringify(v) : ''; });
                var tail = thing.length === 0 || (thing.length - 1 in thing) ? '' : ',';
                return "[" + members.join(',') + tail + "]";
            case 'Set':
            case 'Map':
                return "new " + type + "([" + Array.from(thing).map(stringify).join(',') + "])";
            default:
                if (thing.toJSON) {
                    var json = thing.toJSON();
                    if (getType(json) === 'String') {
                        // Try to parse the returned data
                        try {
                            json = JSON.parse(json);
                        }
                        catch (e) { }
                    }
                    return stringify(json);
                }
                if (Object.getPrototypeOf(thing) === null) {
                    if (Object.keys(thing).length === 0) {
                        return 'Object.create(null)';
                    }
                    return "Object.create(null,{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":{writable:true,enumerable:true,value:" + stringify(thing[key]) + "}"; }).join(',') + "})";
                }
                return "{" + Object.keys(thing).map(function (key) { return safeKey(key) + ":" + stringify(thing[key]); }).join(',') + "}";
        }
    }
    var str = stringify(value);
    if (names.size) {
        var params_1 = [];
        var statements_1 = [];
        var values_1 = [];
        names.forEach(function (name, thing) {
            params_1.push(name);
            if (isPrimitive(thing)) {
                values_1.push(stringifyPrimitive(thing));
                return;
            }
            var type = getType(thing);
            switch (type) {
                case 'Number':
                case 'String':
                case 'Boolean':
                    values_1.push("Object(" + stringify(thing.valueOf()) + ")");
                    break;
                case 'RegExp':
                    values_1.push(thing.toString());
                    break;
                case 'Date':
                    values_1.push("new Date(" + thing.getTime() + ")");
                    break;
                case 'Array':
                    values_1.push("Array(" + thing.length + ")");
                    thing.forEach(function (v, i) {
                        statements_1.push(name + "[" + i + "]=" + stringify(v));
                    });
                    break;
                case 'Set':
                    values_1.push("new Set");
                    statements_1.push(name + "." + Array.from(thing).map(function (v) { return "add(" + stringify(v) + ")"; }).join('.'));
                    break;
                case 'Map':
                    values_1.push("new Map");
                    statements_1.push(name + "." + Array.from(thing).map(function (_a) {
                        var k = _a[0], v = _a[1];
                        return "set(" + stringify(k) + ", " + stringify(v) + ")";
                    }).join('.'));
                    break;
                default:
                    values_1.push(Object.getPrototypeOf(thing) === null ? 'Object.create(null)' : '{}');
                    Object.keys(thing).forEach(function (key) {
                        statements_1.push("" + name + safeProp(key) + "=" + stringify(thing[key]));
                    });
            }
        });
        statements_1.push("return " + str);
        return "(function(" + params_1.join(',') + "){" + statements_1.join(';') + "}(" + values_1.join(',') + "))";
    }
    else {
        return str;
    }
}
function getName(num) {
    var name = '';
    do {
        name = chars[num % chars.length] + name;
        num = ~~(num / chars.length) - 1;
    } while (num >= 0);
    return reserved.test(name) ? name + "0" : name;
}
function isPrimitive(thing) {
    return Object(thing) !== thing;
}
function stringifyPrimitive(thing) {
    if (typeof thing === 'string')
        return stringifyString(thing);
    if (thing === void 0)
        return 'void 0';
    if (thing === 0 && 1 / thing < 0)
        return '-0';
    var str = String(thing);
    if (typeof thing === 'number')
        return str.replace(/^(-)?0\./, '$1.');
    return str;
}
function getType(thing) {
    return Object.prototype.toString.call(thing).slice(8, -1);
}
function escapeUnsafeChar(c) {
    return escaped[c] || c;
}
function escapeUnsafeChars(str) {
    return str.replace(unsafeChars, escapeUnsafeChar);
}
function safeKey(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? key : escapeUnsafeChars(JSON.stringify((key)));
}
function safeProp(key) {
    return /^[_$a-zA-Z][_$a-zA-Z0-9]*$/.test(key) ? "." + key : "[" + escapeUnsafeChars(JSON.stringify(key)) + "]";
}
function stringifyString(str) {
    var result = '"';
    for (var i = 0; i < str.length; i += 1) {
        var char = str.charAt(i);
        var code = char.charCodeAt(0);
        if (char === '"') {
            result += '\\"';
        }
        else if (char in escaped) {
            result += escaped[char];
        }
        else if (code >= 0xd800 && code <= 0xdfff) {
            var next = str.charCodeAt(i + 1);
            // If this is the beginning of a [high, low] surrogate pair,
            // add the next two characters, otherwise escape
            if (code <= 0xdbff && (next >= 0xdc00 && next <= 0xdfff)) {
                result += char + str[++i];
            }
            else {
                result += "\\u" + code.toString(16).toUpperCase();
            }
        }
        else {
            result += char;
        }
    }
    result += '"';
    return result;
}

var devalue_cjs = devalue;

const devalue$1 = devalue_cjs;

const htmlTemplate = (params) => `<!DOCTYPE html>
<html ${params.HTML_ATTRS}>
  <head ${params.HEAD_ATTRS}>
    ${params.HEAD}
  </head>
  <body ${params.BODY_ATTRS}>
    ${params.APP}
  </body>
</html>
`;

const STATIC_ASSETS_BASE = "/site/_nuxt/static" + "/" + "1635365277";
const PAYLOAD_JS = "/payload.js";
const getClientManifest = cachedImport(() => import('./client.manifest.mjs'));
const getSSRApp = cachedImport(() => import('./server.mjs'));
const publicPath = publicConfig.app && publicConfig.app.assetsPath || "/_nuxt/" || "/_nuxt";
const getSSRRenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  if (!clientManifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getSSRApp();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const { renderToString: renderToString2 } = await import('./vue2.mjs');
  return createRenderer(createSSRApp, { clientManifest, renderToString: renderToString2, publicPath }).renderToString;
});
const getSPARenderer = cachedResult(async () => {
  const clientManifest = await getClientManifest();
  return (ssrContext) => {
    ssrContext.nuxt = {
      serverRendered: false,
      config: publicConfig
    };
    return {
      html: '<div id="__nuxt"></div>',
      renderResourceHints: () => "",
      renderStyles: () => "",
      renderScripts: () => clientManifest.initial.map((s) => {
        const isMJS = !s.endsWith(".js");
        return `<script ${isMJS ? 'type="module"' : ""} src="${publicPath}${s}"><\/script>`;
      }).join("")
    };
  };
});
function renderToString(ssrContext) {
  const getRenderer = ssrContext.noSSR ? getSPARenderer : getSSRRenderer;
  return getRenderer().then((renderToString2) => renderToString2(ssrContext));
}
async function renderMiddleware(req, res) {
  let url = req.url;
  let isPayloadReq = false;
  if (url.startsWith(STATIC_ASSETS_BASE) && url.endsWith(PAYLOAD_JS)) {
    isPayloadReq = true;
    url = url.substr(STATIC_ASSETS_BASE.length, url.length - STATIC_ASSETS_BASE.length - PAYLOAD_JS.length) || "/";
  }
  const ssrContext = {
    url,
    req,
    res,
    runtimeConfig: { private: privateConfig, public: publicConfig },
    noSSR: req.spa || req.headers["x-nuxt-no-ssr"],
    ...req.context || {}
  };
  const rendered = await renderToString(ssrContext);
  if (ssrContext.error) {
    throw ssrContext.error;
  }
  if (ssrContext.redirected || res.writableEnded) {
    return;
  }
  if (ssrContext.nuxt.hooks) {
    await ssrContext.nuxt.hooks.callHook("app:rendered");
  }
  const payload = ssrContext.payload || ssrContext.nuxt;
  {
    payload.staticAssetsBase = STATIC_ASSETS_BASE;
  }
  let data;
  if (isPayloadReq) {
    data = renderPayload(payload, url);
    res.setHeader("Content-Type", "text/javascript;charset=UTF-8");
  } else {
    data = await renderHTML(payload, rendered, ssrContext);
    res.setHeader("Content-Type", "text/html;charset=UTF-8");
  }
  const error = ssrContext.nuxt && ssrContext.nuxt.error;
  res.statusCode = error ? error.statusCode : 200;
  res.end(data, "utf-8");
}
async function renderHTML(payload, rendered, ssrContext) {
  const state = `<script>window.__NUXT__=${devalue$1(payload)}<\/script>`;
  const html = rendered.html;
  if ("renderMeta" in ssrContext) {
    rendered.meta = await ssrContext.renderMeta();
  }
  const {
    htmlAttrs = "",
    bodyAttrs = "",
    headAttrs = "",
    headTags = "",
    bodyScriptsPrepend = "",
    bodyScripts = ""
  } = rendered.meta || {};
  return htmlTemplate({
    HTML_ATTRS: htmlAttrs,
    HEAD_ATTRS: headAttrs,
    HEAD: headTags + rendered.renderResourceHints() + rendered.renderStyles() + (ssrContext.styles || ""),
    BODY_ATTRS: bodyAttrs,
    APP: bodyScriptsPrepend + html + state + rendered.renderScripts() + bodyScripts
  });
}
function renderPayload(payload, url) {
  return `__NUXT_JSONP__("${url}", ${devalue$1(payload)})`;
}
function _interopDefault(e) {
  return e && typeof e === "object" && "default" in e ? e.default : e;
}
function cachedImport(importer) {
  return cachedResult(() => importer().then(_interopDefault));
}
function cachedResult(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}

export { renderMiddleware };
