# Mini JavaScript Framework

## Overview

This project is a **custom JavaScript framework** built using **vanilla JavaScript only**, without React, Vue, Angular, or similar libraries. It abstracts DOM manipulation, provides global state management, implements routing, and handles events. A **TodoMVC application** is built using the framework to demonstrate its features.

---

## Project Structure

```
/
├── index.html
├── framework.js
├── app.js
└── README.md
```

The application runs directly from the root directory.

---

## Framework Features

* Virtual DOM (DOM abstraction)
* Global state management
* Custom event handling system
* Hash-based routing
* Declarative rendering

---

## DOM Abstraction

The DOM is represented using JavaScript objects instead of HTML.

```js
h("div", {}, "Hello")
```

Each element consists of a tag, properties, and children. The framework converts this Virtual DOM into real DOM elements.

---

## Creating & Nesting Elements

```js
h("div", {}, [
  h("h1", {}, "Title"),
  h("p", {}, "Text")
])
```

Children are passed as arrays to create nested structures.

---

## Adding Attributes

```js
h("input", { type: "text", placeholder: "Enter text" })
```

Attributes are defined through the `props` object.

---

## Event Handling

```js
h("button", { onclick: () => console.log("Clicked") }, "Click")
```

Events are handled using a **custom event delegation system**, not `addEventListener` on individual elements.

---

## State Management

A global `Store` manages application state.

```js
Store.get()
Store.set({ key: value })
```

Updating the state automatically triggers a UI re-render.

---

## Routing

Routing is synchronized with the URL hash.

Examples:

* `#/all`
* `#/active`
* `#/completed`

Changing the hash updates the rendered UI.

---

## Rendering Cycle

1. User action triggers an event
2. State updates via `Store.set`
3. Application re-renders
4. Virtual DOM is rebuilt
5. Real DOM is updated

---

## TodoMVC Application

The TodoMVC app demonstrates:

* Adding todos
* Toggling completed state
* Filtering via routing
* Global state usage

All functionality is implemented using the custom framework.

---

## Design Rationale

* Virtual DOM simplifies DOM updates
* Centralized state ensures predictable behavior
* Event delegation improves performance
* Hash routing links UI state to the URL
* Full re-rendering keeps the framework simple
