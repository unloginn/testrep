const themeButton = document.querySelector('#themeButton');
const counterButton = document.querySelector('#counterButton');
const counter = document.querySelector('#counter');
const taskForm = document.querySelector('#taskForm');
const taskInput = document.querySelector('#taskInput');
const taskList = document.querySelector('#taskList');
const message = document.querySelector('#message');

let clicks = 0;

themeButton.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

counterButton.addEventListener('click', () => {
  clicks += 10;
  counter.textContent = clicks;
});

taskForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    message.textContent = 'Введите текст задачи.';
    return;
  }

  const item = document.createElement('li');
  item.textContent = text;
  taskList.append(item);

  taskInput.value = '';
  message.textContent = 'Задача добавлена.';
});
