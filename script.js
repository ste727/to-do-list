const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

function addTask() {
    if (inputBox.value === '') {
        alert("Input cannot be empty!");
    } else {
        let li = document.createElement("li");
        li.innerHTML = inputBox.value;
        li.setAttribute("draggable", "true");
        li.classList.add("draggable");
        listContainer.appendChild(li);
        let span = document.createElement("span"); //delete button
        span.innerHTML = "\u00d7"; //x
        li.appendChild(span);
        addDragAndDropEvents(li);
    }
    inputBox.value = ""; //clear
    saveData();
}

// Enter key
inputBox.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        document.getElementById("task").click();
    }
});


function addDragAndDropEvents(element) {
    element.addEventListener("dragstart", dragStart);
    element.addEventListener("dragover", dragOver);
    element.addEventListener("drop", dropItem);
    element.addEventListener("dragend", dragEnd);
}

//dragstart
function dragStart(e) {
    draggedElement = e.target
    setTimeout(() => {
        e.target.classList.add("dragging");
    }, 0);
}

//dragover
function dragOver(e) {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    const closestElement = getDragAfterElement(e.clientY);

    if (closestElement == null) {
        listContainer.appendChild(draggingItem);
    } else {
        listContainer.insertBefore(draggingItem, closestElement);
    }
}

//dragitem
function dropItem(e) {
    e.preventDefault();
    e.target.classList.remove("dragging");
    if(e.target !== draggedElement){
        listContainer.insertBefore(draggedElement, e.target)
    }
    saveData();
}

//dragend
function dragEnd(e) {
    e.target.classList.remove("dragging");
}


function getDragAfterElement(y) {
    const draggableElements = [...listContainer.querySelectorAll('.draggable:not(.dragging)'),];

    return draggableElements.reduce(
        (closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (
                offset < 0 &&
                offset > closest.offset) {
                return {
                    offset: offset,
                    element: child,
                };
            } else {
                return closest;
            }
        },
        {offset: Number.NEGATIVE_INFINITY,}).element;
};


function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
    const allListItems = listContainer.querySelectorAll("li");
    allListItems.forEach((item) => {
        item.setAttribute("draggable", "true");
        item.classList.add("draggable");
        addDragAndDropEvents(item);
    });
}
showTask();



//checking/unchecking
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
    }
}, false);

