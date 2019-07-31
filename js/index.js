const refs = {
    editor: document.querySelector('.js-editor'),
    todoList: document.querySelector('.js-todo-list'),
}

refs.editor.addEventListener('submit', handleEditorSubmit);
refs.todoList.addEventListener('click', deleteItemFromList);

const todos = {
    items: [],
    add(text) {
        const todo ={
            id: Date.now(),
            text
        };
        this.items.push(todo);
        return todo;
    },
    delete(idToDelete) {
        this.items = this.items.filter(el => el.id !== idToDelete);
    },
} 

try {
    let todoListFromLocalstorage = localStorage.getItem('todoList');
    if (todoListFromLocalstorage !== null) {
        if (todoListFromLocalstorage.length > 0) {
            todos.items.push(...JSON.parse(todoListFromLocalstorage));
            for (let el of todos.items) {
                const defaultTodoMarkup = buildTodoItem(el);
                appendTodoItem(refs.todoList, defaultTodoMarkup);
            }
        };
    }
}
catch (e) {
    console.log('loacalStorage error: ', e);
}

function handleEditorSubmit (e) {
    e.preventDefault();
    const form = e.currentTarget;
    const inputValue = form.elements.text.value;
    const todo = todos.add(inputValue);
    const todoMarkup = buildTodoItem(todo);
    appendTodoItem(refs.todoList, todoMarkup);
    localStorage.setItem('todoList', JSON.stringify(todos.items));
    form.reset();
}

function buildTodoItem(item) {
    return `
    <li class="todo-list__item" data-id="${item.id}">
      <div class="todo">
        <p class="todo__text">${item.text}</p>
        <div class="todo__actions">
          <button class="button" type="button">Remove</button>
        </div>
      </div>
    </li>
    `;
};

function appendTodoItem (parentRef, todoItem) {
    parentRef.insertAdjacentHTML('beforeend', todoItem)
};

function deleteItemFromList (e) {
    if (e.target.nodeName !== 'BUTTON') return;
    const button = e.target;
    const parentLi = button.closest('li.todo-list__item');
    const todoId = Number(parentLi.dataset.id);
    todos.delete(todoId);
    parentLi.remove();
    localStorage.setItem('todoList', JSON.stringify(todos.items));
};