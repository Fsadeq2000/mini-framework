// ======================
// 1. VIRTUAL DOM
// ======================
export function h(tag, props = {}, children = []) {
  return {
    tag,
    props,
    children: Array.isArray(children) ? children : [children]
  };
}

// ======================
// 2. EVENT SYSTEM
// ======================
const Events = (() => {
  const handlers = {};

  return {
    add(fn) {
      const id = crypto.randomUUID();
      handlers[id] = fn;
      return id;
    },
    dispatch(e) {
      let el = e.target;
      while (el) {
        const handlerId = el.dataset.handler;
        if (handlerId && handlers[handlerId]) {
          handlers[handlerId](e);
          return;
        }
        el = el.parentElement;
      }
    }
  };
})();

document.addEventListener("click", Events.dispatch);
document.addEventListener("keydown", Events.dispatch);

// ======================
// 3. REAL DOM CREATION (NULL SAFE)
// ======================
function createDom(vnode) {
  if (vnode === null || vnode === undefined) return document.createTextNode("");
  if (typeof vnode === "string") return document.createTextNode(vnode);

  const el = document.createElement(vnode.tag);

  for (const key in vnode.props) {
    if (key.startsWith("on")) {
      const handlerId = Events.add(vnode.props[key]);
      el.dataset.handler = handlerId;
    } else if (key === "value") {
      el.value = vnode.props[key]; // important for input editing
    } else if (key === "checked") {
      el.checked = vnode.props[key]; // checkbox state
    } else if (key === "autofocus") {
      if (vnode.props[key]) el.autofocus = true;
    } else {
      el.setAttribute(key, vnode.props[key]);
    }
  }

  vnode.children.forEach(child => {
    const childDom = createDom(child);
    if (childDom) el.appendChild(childDom);
  });

  return el;
}

// ======================
// 4. RENDER SYSTEM
// ======================
let rootEl = null;
let rootComponent = null;

export function render(component, mountPoint) {
  rootComponent = component;
  rootEl = mountPoint;
  update();
}

function update() {
  if (!rootEl || !rootComponent) return;
  rootEl.innerHTML = "";
  rootEl.appendChild(createDom(rootComponent()));
}

// ======================
// 5. STATE MANAGEMENT
// ======================
export const Store = (() => {
  let state = {};
  const listeners = [];

  return {
    get() { return state; },
    set(newState) {
      state = { ...state, ...newState };
      listeners.forEach(fn => fn());
    },
    subscribe(fn) { listeners.push(fn); }
  };
})();

Store.subscribe(update);

// ======================
// 6. ROUTING
// ======================
window.addEventListener("hashchange", update);
