import { h, render, Store } from "./framework.js";

// ======================
// INITIAL STATE
// ======================
Store.set({
  todos: [],
  editingId: null
});

// ======================
// ACTIONS
// ======================
function addTodo(e) {
  if (e.key !== "Enter") return;

  const text = e.target.value.trim();
  if (!text) return;

  Store.set({
    todos: [
      ...Store.get().todos,
      { id: crypto.randomUUID(), text, done: false }
    ]
  });

  e.target.value = "";
  e.target.focus();
}

function toggleTodo(id) {
  Store.set({
    todos: Store.get().todos.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    )
  });
}

function removeTodo(id) {
  Store.set({
    todos: Store.get().todos.filter(t => t.id !== id)
  });
}

function clearCompleted() {
  Store.set({
    todos: Store.get().todos.filter(t => !t.done)
  });
}

function startEdit(id) {
  Store.set({ editingId: id });
}

function finishEdit(e, id) {
  if (e.key !== "Enter") return;

  const text = e.target.value.trim();
  if (!text) return;

  Store.set({
    todos: Store.get().todos.map(t =>
      t.id === id ? { ...t, text } : t
    ),
    editingId: null
  });
}

// ======================
// VIEW
// ======================
function TodoApp() {
  const { todos, editingId } = Store.get();
  const hash = location.hash || "#/all";

  const filtered = todos.filter(t => {
    if (hash === "#/active") return !t.done;
    if (hash === "#/completed") return t.done;
    return true;
  });

  const remaining = todos.filter(t => !t.done).length;
  const completed = todos.some(t => t.done);

  return h("section", { class: "todoapp" }, [
    // HEADER
    h("header", { class: "header" }, [
      h("h1", {}, "TO DOs !"),
      h("input", {
        class: "new-todo",
        placeholder: "What needs to be done?",
        onkeydown: addTodo,
        autofocus: true
      })
    ]),

    // MAIN
    todos.length
      ? h("section", { class: "main" }, [
          h(
            "ul",
            { class: "todo-list" },
            filtered.map(todo =>
              h(
                "li",
                {
                  class:
                    (todo.done ? "completed " : "") +
                    (editingId === todo.id ? "editing" : "")
                },
                [
                  editingId === todo.id
                    ? h("input", {
                        class: "edit",
                        value: todo.text,
                        onkeydown: e => finishEdit(e, todo.id)
                      })
                    : h("div", { class: "view" }, [
                        h("input", {
                          class: "toggle",
                          type: "checkbox",
                          checked: todo.done,
                          onclick: () => toggleTodo(todo.id)
                        }),
                        h("label", {
                          ondblclick: () => startEdit(todo.id)
                        }, todo.text),
                        h("button", {
                          class: "destroy",
                          onclick: () => removeTodo(todo.id)
                        }, "×")
                      ])
                ]
              )
            )
          )
        ])
      : null,

    // FOOTER
    todos.length
      ? h("footer", { class: "footer" }, [
          h("span", { class: "todo-count" }, [
            h("strong", {}, String(remaining)),
            ` item${remaining !== 1 ? "s" : ""} left`
          ]),
          h("ul", { class: "filters" }, [
            h("li", {}, h("a", { href: "#/all", class: hash === "#/all" ? "selected" : "" }, "All")),
            h("li", {}, h("a", { href: "#/active", class: hash === "#/active" ? "selected" : "" }, "Active")),
            h("li", {}, h("a", { href: "#/completed", class: hash === "#/completed" ? "selected" : "" }, "Completed"))
          ]),
          completed
            ? h("button", {
                class: "clear-completed",
                onclick: clearCompleted
              }, "Clear completed")
            : null
        ])
      : null
  ]);
}

// ======================
// START
// ======================
render(TodoApp, document.getElementById("root"));
