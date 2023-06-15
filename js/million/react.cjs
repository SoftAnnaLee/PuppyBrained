'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const utils = require('./chunks/render.cjs');

const cloneElement = (vnode) => {
  if (typeof vnode === "string")
    return vnode;
  return utils.h(vnode.tag, vnode.props, ...vnode.children ?? []);
};
const createElement = utils.compat(utils.h);
const isValidElement = (vnode) => {
  if (vnode && vnode !== null && vnode.constructor === void 0) {
    if (typeof vnode === "string")
      return true;
    if (vnode.tag)
      return true;
  }
  return false;
};
const memo = (component) => () => {
  return (props) => {
    return utils.thunk(component, Object.values(props));
  };
};
const toChildArray = (children) => {
  return utils.h("_", {}, ...children).children;
};
const mapFn = (children, fn) => {
  if (children == null)
    return null;
  return toChildArray(toChildArray(children).map(fn));
};
const Children = {
  map: mapFn,
  forEach: mapFn,
  count(children) {
    return children ? toChildArray(children).length : 0;
  },
  only(children) {
    const normalized = toChildArray(children);
    if (normalized.length !== 1)
      throw "Children.only";
    return normalized[0];
  },
  toArray: toChildArray
};
const lazy = (loader) => {
  let promise;
  let component;
  let err;
  return (props) => {
    if (!promise) {
      promise = loader();
      promise.then((exports) => component = exports.default || exports, (e) => err = e);
    }
    if (err)
      throw err;
    if (!component)
      throw promise;
    return utils.h(component, props);
  };
};
const createRef = () => {
  return { current: null };
};
const forwardRef = (fn) => {
  return function Forwarded(props) {
    const clone = { ...props };
    delete clone.ref;
    return fn(clone, props.ref || null);
  };
};
const Suspense = (props) => {
  return props?.children;
};
const SuspenseList = (props) => {
  return props?.children;
};
const StrictMode = (props) => {
  return props?.children;
};
class Component {
  constructor(props, context) {
    this.props = props;
    this.context = context;
    this.state = {};
    this.queueRender = utils.batch();
  }
  componentDidMount() {
    return false;
  }
  componentDidUnmount() {
    return false;
  }
  componentDidUpdate() {
    return true;
  }
  shouldComponentUpdate(_newProps, _newState) {
    return true;
  }
  setState(update, callback) {
    const newState = {
      ...this.state,
      ...typeof update === "function" ? update(this.state, this.props) : update
    };
    if (!this.shouldComponentUpdate(this.props, newState))
      return;
    if (callback)
      callback(this.state, this.props);
    this.state = newState;
    this.queueRender(() => {
      if (this.rerender)
        this.rerender();
    });
  }
  render(props) {
    return utils.Fragment(props);
  }
}
class PureComponent extends Component {
  shouldComponentUpdate(newProps, newState) {
    return newProps !== this.props && newState !== this.state;
  }
}

const React = {
  __proto__: null,
  hook: utils.hook,
  Children: Children,
  Component: Component,
  Fragment: utils.Fragment,
  PureComponent: PureComponent,
  StrictMode: StrictMode,
  Suspense: Suspense,
  SuspenseList: SuspenseList,
  unstable_SuspenseList: SuspenseList,
  cloneElement: cloneElement,
  createContext: utils.createContext,
  createElement: createElement,
  createRef: createRef,
  forwardRef: forwardRef,
  isValidElement: isValidElement,
  lazy: lazy,
  memo: memo,
  startTransition: utils.startTransition,
  unstable_startTransition: utils.startTransition,
  useId: utils.useId,
  useCallback: utils.useCallback,
  useContext: utils.useContext,
  useDebugValue: utils.useDebugValue,
  useDeferredValue: utils.useDeferredValue,
  unstable_useDeferredValue: utils.useDeferredValue,
  useEffect: utils.useEffect,
  useImperativeHandle: utils.useImperativeHandle,
  useInsertionEffect: utils.useEffect,
  useLayoutEffect: utils.useLayoutEffect,
  useMemo: utils.useMemo,
  useMutableSource: utils.useSyncExternalStore,
  unstable_useMutableSource: utils.useSyncExternalStore,
  useReducer: utils.useReducer,
  useRef: utils.useRef,
  useState: utils.useState,
  useSyncExternalStore: utils.useSyncExternalStore,
  useTransition: utils.useTransition,
  unstable_useTransition: utils.useTransition,
  jsx: utils.jsx,
  jsxs: utils.jsx,
  jsxDEV: utils.jsx
};

const hydrateRoot = (vnode, root) => {
  utils.hydrate(root, vnode);
  return root;
};
const createRoot = (root) => {
  const renderer = (renderFn, patchFn) => {
    return (vnode) => {
      if (!vnode)
        return;
      utils.startTransition(() => {
        if (Array.isArray(vnode)) {
          const rootVNode = utils.fromDomNodeToVNode(root);
          patchFn(root, utils.h(rootVNode.tag, rootVNode.props, ...vnode));
          requestAnimationFrame(() => root[utils.DOM_REF_FIELD] = root.firstChild);
        } else {
          renderFn(root, vnode);
        }
      });
    };
  };
  return {
    render: renderer(utils.render, utils.patch),
    hydrate: renderer(utils.hydrate, utils.patch),
    unmount: () => {
      root.textContent = "";
      root[utils.DOM_REF_FIELD] = void 0;
    }
  };
};
const render = (vnode, root) => {
  utils.startTransition(() => {
    if (Array.isArray(vnode)) {
      const rootVNode = utils.fromDomNodeToVNode(root);
      utils.patch(root, utils.h(rootVNode.tag, rootVNode.props, ...vnode));
      requestAnimationFrame(() => root[utils.DOM_REF_FIELD] = root.firstChild);
    } else {
      utils.render(root, vnode);
    }
  });
};
const createPortal = (children, el) => {
  const rootVNode = utils.fromDomNodeToVNode(el);
  utils.patch(el, utils.h(rootVNode.tag, rootVNode.props, ...children));
};

const ReactDOM = {
  __proto__: null,
  render: render,
  createPortal: createPortal,
  createRoot: createRoot,
  hydrateRoot: hydrateRoot,
  flushSync: utils.startTransition
};

const version = "18.1.0";
const index = {
  version,
  ...React,
  ...ReactDOM,
  ...utils.ReactCompat
};

exports.Fragment = utils.Fragment;
exports.compat = utils.compat;
exports.createClass = utils.createClass;
exports.createComponent = utils.createComponent;
exports.createContext = utils.createContext;
exports.flushSync = utils.startTransition;
exports.hook = utils.hook;
exports.jsx = utils.jsx;
exports.jsxDEV = utils.jsx;
exports.jsxs = utils.jsx;
exports.startTransition = utils.startTransition;
exports.unstable_startTransition = utils.startTransition;
exports.unstable_useDeferredValue = utils.useDeferredValue;
exports.unstable_useMutableSource = utils.useSyncExternalStore;
exports.unstable_useTransition = utils.useTransition;
exports.useCallback = utils.useCallback;
exports.useContext = utils.useContext;
exports.useDebugValue = utils.useDebugValue;
exports.useDeferredValue = utils.useDeferredValue;
exports.useEffect = utils.useEffect;
exports.useId = utils.useId;
exports.useImperativeHandle = utils.useImperativeHandle;
exports.useInsertionEffect = utils.useEffect;
exports.useLayoutEffect = utils.useLayoutEffect;
exports.useMemo = utils.useMemo;
exports.useMutableSource = utils.useSyncExternalStore;
exports.useReducer = utils.useReducer;
exports.useRef = utils.useRef;
exports.useState = utils.useState;
exports.useSyncExternalStore = utils.useSyncExternalStore;
exports.useTransition = utils.useTransition;
exports.Children = Children;
exports.Component = Component;
exports.PureComponent = PureComponent;
exports.StrictMode = StrictMode;
exports.Suspense = Suspense;
exports.SuspenseList = SuspenseList;
exports.cloneElement = cloneElement;
exports.createElement = createElement;
exports.createPortal = createPortal;
exports.createRef = createRef;
exports.createRoot = createRoot;
exports["default"] = index;
exports.forwardRef = forwardRef;
exports.hydrateRoot = hydrateRoot;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.render = render;
exports.unstable_SuspenseList = SuspenseList;
exports.version = version;
