'use strict';

const utils = require('./render.cjs');

const cache = /* @__PURE__ */ new Map();
const memo = (node) => {
  const key = typeof node === "string" ? node : node instanceof HTMLElement ? node.outerHTML : node.textContent;
  if (cache.has(key)) {
    return cache.get(key);
  } else {
    const vnode = utils.fromDomNodeToVNode(typeof node === "string" ? utils.fromStringToDomNode(node) : node);
    cache.set(key, vnode);
    return vnode;
  }
};

const morph = (newDOMNode, oldDOMNode) => {
  return utils.patch(oldDOMNode, memo(newDOMNode), memo(oldDOMNode));
};

exports.memo = memo;
exports.morph = morph;
