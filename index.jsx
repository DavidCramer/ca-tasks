 // Task Management with Lists
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task');
    const addTaskButton = document.getElementById('add-task');
    const searchInput = document.getElementById('search');
    const filterSelect = document.getElementById('filter');
    const themeToggle = document.getElementById('theme-toggle');
    const listSelector = document.getElementById('list-selector');
    const addListButton = document.getElementById('add-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || {};
    let currentList = 'personal';

    function saveTasks() {
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
      taskList.innerHTML = '';
      const filteredTasks = (tasks[currentList] || []).filter(task => {
        if (filterSelect.value === 'active') return !task.completed;
        if (filterSelect.value === 'completed') return task.completed;
        return true;
      }).filter(task => task.text.toLowerCase().includes(searchInput.value.toLowerCase()));

      filteredTasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
          <input type="checkbox" ${task.completed ? 'checked' : ''} data-index="${index}">
          <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
          <button class="delete" data-index="${index}">&#10006;</button>
        `;
        taskList.appendChild(li);
      });
    }

    function addTask() {
      const text = newTaskInput.value.trim();
      if (text) {
        tasks[currentList] = tasks[currentList] || [];
        tasks[currentList].push({ text, completed: false });
        newTaskInput.value = '';
        saveTasks();
        renderTasks();
      }
    }

    taskList.addEventListener('click', (e) => {
      const index = e.target.dataset.index;
      if (e.target.tagName === 'INPUT') {
        tasks[currentList][index].completed = !tasks[currentList][index].completed;
      } else if (e.target.tagName === 'BUTTON') {
        tasks[currentList].splice(index, 1);
      }
      saveTasks();
      renderTasks();
    });

    addTaskButton.addEventListener('click', addTask);
    newTaskInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') addTask();
    });
    searchInput.addEventListener('input', renderTasks);
    filterSelect.addEventListener('change', renderTasks);
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });

    listSelector.addEventListener('change', (e) => {
      currentList = e.target.value;
      renderTasks();
    });

    addListButton.addEventListener('click', () => {
      const newList = prompt('Enter new list name:');
      if (newList && !tasks[newList]) {
        tasks[newList] = [];
        saveTasks();
        const option = document.createElement('option');
        option.value = newList;
        option.textContent = newList;
        listSelector.appendChild(option);
      }
    });

    renderTasks();