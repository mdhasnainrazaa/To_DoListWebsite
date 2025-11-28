const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');
const counter = document.getElementById('counter');
const filterButtons = document.querySelectorAll('.filters button');

let todos = JSON.parse(localStorage.getItem('todos')) || [];
let currentFilter = 'all';

// 🟢 FORM SUBMIT
form.addEventListener('submit', function (e) {
  e.preventDefault();
  const taskText = input.value.trim();
  if (taskText !== '') {
    addTodo(taskText);
    input.value = '';
  }
});

// 🟢 ADD TODO
function addTodo(text) {
  const todo = {
    id: Date.now(),
    text,
    completed: false,
  };
  todos.push(todo);
  saveToLocalStorage();
  renderTodos();
}

// 🟢 RENDER TODOS
function renderTodos() {
  list.innerHTML = '';

  let filteredTodos = todos;
  if (currentFilter === 'active') {
    filteredTodos = todos.filter(todo => !todo.completed);
  } else if (currentFilter === 'completed') {
    filteredTodos = todos.filter(todo => todo.completed);
  }

  filteredTodos.forEach(todo => {
    const li = document.createElement('li');
    li.className = todo.completed ? 'completed' : '';

    // ✅ Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleComplete(todo.id));

    // Task text
    const span = document.createElement('span');
    span.textContent = todo.text;

    // Delete button
    const btn = document.createElement('button');
    btn.textContent = 'Delete';
    btn.addEventListener('click', () => deleteTodo(todo.id));

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });

  updateCounter();
}

// 🟢 TOGGLE COMPLETE
function toggleComplete(id) {
  todos = todos.map(todo =>
    todo.id === id ? { ...todo, completed: !todo.completed } : todo
  );
  saveToLocalStorage();
  renderTodos();
}

// 🟢 DELETE TASK
function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

// 🟢 UPDATE COUNTER
function updateCounter() {
  const remaining = todos.filter(todo => !todo.completed).length;
  counter.textContent = `${remaining} task${remaining !== 1 ? 's' : ''} left`;
}

// 🟢 SAVE TO LOCAL STORAGE
function saveToLocalStorage() {
  localStorage.setItem('todos', JSON.stringify(todos));
}

// 🟢 FILTER BUTTONS
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    currentFilter = button.dataset.filter;
    renderTodos();
  });
});

// 🟢 KEYBOARD SHORTCUT (Ctrl + D → delete completed)
document.addEventListener('keydown', e => {
  if (e.ctrlKey && e.key.toLowerCase() === 'd') {
    e.preventDefault();
    todos = todos.filter(todo => !todo.completed);
    saveToLocalStorage();
    renderTodos();
    alert('All completed tasks deleted!');
  }
});

// 🟢 INITIAL LOAD
renderTodos();
