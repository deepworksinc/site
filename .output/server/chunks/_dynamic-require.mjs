const dynamicChunks = {
 ['pages/index.js']: () => import('./app/pages/index.mjs').then(function (n) { return n.i; })
};

function dynamicRequire(id) {
  return dynamicChunks[id]();
}

export { dynamicRequire as default };
