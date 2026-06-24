document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const emptyState = document.getElementById('empty-state');

    // Array to hold task data
    let tasks = [];

    // Initialize the app
    function init() {
        // Retrieve tasks from localStorage if available
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            tasks = JSON.parse(savedTasks);
        }
        renderTasks();
    }

    // Save tasks to localStorage
    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Toggle the empty state visibility
    function updateEmptyState() {
        if (tasks.length === 0) {
            emptyState.style.display = 'flex';
            taskList.style.display = 'none';
        } else {
            emptyState.style.display = 'none';
            taskList.style.display = 'flex';
        }
    }

    // Render all tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = createTaskElement(task);
            taskList.appendChild(li);
        });
        
        updateEmptyState();
    }

    // Create a single task DOM element
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;

        // Task Content Container (Clickable to toggle)
        const contentDiv = document.createElement('div');
        contentDiv.className = 'task-content';
        contentDiv.addEventListener('click', () => toggleTask(task.id));

        // Checkbox icon
        const checkbox = document.createElement('div');
        checkbox.className = 'checkbox';
        checkbox.innerHTML = task.completed ? '<ion-icon name="checkmark-outline"></ion-icon>' : '';

        // Task text
        const textSpan = document.createElement('span');
        textSpan.className = 'task-text';
        textSpan.textContent = task.text;

        contentDiv.appendChild(checkbox);
        contentDiv.appendChild(textSpan);

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.setAttribute('aria-label', 'Delete task');
        deleteBtn.innerHTML = '<ion-icon name="trash-outline"></ion-icon>';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent toggling when clicking delete
            deleteTask(task.id, li);
        });

        li.appendChild(contentDiv);
        li.appendChild(deleteBtn);

        return li;
    }

    // Add a new task
    function addTask(text) {
        const newTask = {
            id: Date.now().toString(),
            text: text,
            completed: false
        };

        tasks.unshift(newTask); // Add to beginning of array
        saveTasks();
        
        // Optimize: just prepend the new element instead of re-rendering all
        const li = createTaskElement(newTask);
        taskList.insertBefore(li, taskList.firstChild);
        
        updateEmptyState();
    }

    // Toggle task completion status
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            saveTasks();
            
            // Update the specific DOM element
            const li = document.querySelector(`.task-item[data-id="${id}"]`);
            if (li) {
                li.classList.toggle('completed');
                const checkbox = li.querySelector('.checkbox');
                checkbox.innerHTML = task.completed ? '<ion-icon name="checkmark-outline"></ion-icon>' : '';
            }
        }
    }

    // Delete a task
    function deleteTask(id, element) {
        // Add animation class
        element.classList.add('removing');
        
        // Wait for animation to finish before actual removal
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            saveTasks();
            element.remove();
            updateEmptyState();
        }, 300); // Matches the CSS transition duration
    }

    // Handle form submission
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = taskInput.value.trim();
        if (text !== '') {
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        }
    });

    // Start the app
    init();
});
