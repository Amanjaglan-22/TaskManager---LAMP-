const API = 'api/tasks.php';
const POLL_MS = 8000;

const COLUMNS = [
    { status: 'backlog', label: 'Backlog' },
    { status: 'planned', label: 'Planned' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'done', label: 'Completed' }
];

const board = document.getElementById('board');
const taskInput = document.getElementById('taskInput');
const statusSelect = document.getElementById('statusSelect');
const addBtn = document.getElementById('addBtn');
const syncStatus = document.getElementById('syncStatus');

let tasks = [];
let busy = 0;
let dragging = false;

function setSync(text, isError) {
    syncStatus.textContent = text;
    syncStatus.className = isError ? 'sync error' : 'sync';
}

async function request(url, options) {
    busy++;
    setSync('Saving...', false);
    try {
        const res = await fetch(url, options);
        if (!res.ok) {
            throw new Error("Request failed");
        }
        const data = await res.json();
        setSync('All changes saved', false);
        return data;
    } catch (err) {
        setSync('Could not reach the server', true);
        throw err;
    } finally {
        busy--;
    }
}

async function loadTasks() {
    if (busy > 0 || dragging) return;

    try {
        tasks = await request(API);
        render();
    } catch (err) {
        // Error message already handled by setSync
    }
}

async function addTask() {
    const title = taskInput.value.trim();
    if (title === '') return;

    try {
        const created = await request(API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: title, status: statusSelect.value })
        });
        tasks.unshift(created);
        taskInput.value = '';
        render();
    } catch (err) {
        // Error message already handled by setSync
    }
}

async function moveTask(id, newStatus) {
    const task = tasks.find(function (t) {
        return String(t.id) === String(id);
    });
    if (!task || task.status === newStatus) return;

    const oldStatus = task.status;
    task.status = newStatus;
    render();

    try {
        await request(`${API}?id=${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: newStatus })
        });
    } catch (err) {
        task.status = oldStatus;
        render();
    }
}

async function deleteTask(id) {
    const before = tasks;
    tasks = tasks.filter(function (t) {
        return t.id !== id;
    });
    render();

    try {
        await request(`${API}?id=${id}`, { method: 'DELETE' });
    } catch (err) {
        tasks = before;
        render();
    }
}

function buildCard(task) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;

    card.addEventListener('dragstart', function (e) {
        dragging = true;
        e.dataTransfer.setData('text/plain', String(task.id));
        card.classList.add('dragging');
    });

    card.addEventListener('dragend', function () {
        dragging = false;
        card.classList.remove('dragging');
    });

    const title = document.createElement('div');
    title.className = 'card-title';
    title.textContent = task.title;

    const actions = document.createElement('div');
    actions.className = 'card-actions';

    const select = document.createElement('select');
    COLUMNS.forEach(function (col) {
        const option = document.createElement('option');
        option.value = col.status;
        option.textContent = col.label;
        if (col.status === task.status) {
            option.selected = true;
        }
        select.appendChild(option);
    });

    select.addEventListener('change', function () {
        moveTask(task.id, select.value);
    });

    const del = document.createElement('button');
    del.className = 'delete';
    del.textContent = 'Erase';
    del.addEventListener('click', function () {
        deleteTask(task.id);
    });

    actions.appendChild(select);
    actions.appendChild(del);
    card.appendChild(title);
    card.appendChild(actions);
    return card;
}

function render() {
    board.innerHTML = '';

    COLUMNS.forEach(function (col) {
        const items = tasks.filter(function (t) {
            return t.status === col.status;
        });

        const column = document.createElement('section');
        column.className = 'column';
        column.dataset.status = col.status;

        const header = document.createElement('div');
        header.className = 'column header';

        const name = document.createElement('span');
        name.textContent = col.label;

        const count = document.createElement('span');
        count.className = 'count';
        count.textContent = items.length;

        header.appendChild(name);
        header.appendChild(count);
        column.appendChild(header);

        if (items.length === 0) {
            const empty = document.createElement('div');
            empty.className = 'empty';
            empty.textContent = 'Nothing here yet';
            column.appendChild(empty);
        }

        items.forEach(function (task) {
            column.appendChild(buildCard(task));
        });

        column.addEventListener('dragover', function (e) {
            e.preventDefault();
            column.classList.add('drag-over');
        });

        column.addEventListener('dragleave', function () {
            column.classList.remove('drag-over');
        });

        column.addEventListener('drop', function (e) {
            e.preventDefault();
            column.classList.remove('drag-over');
            dragging = false;
            const id = e.dataTransfer.getData('text/plain');
            if (id) {
                moveTask(id, col.status);
            }
        });

        board.appendChild(column);
    });
}

addBtn.addEventListener('click', addTask);

taskInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
});

loadTasks();
setInterval(loadTasks, POLL_MS);
