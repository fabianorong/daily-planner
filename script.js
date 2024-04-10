const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const levelEffort = document.getElementById("effort");
const undoButton = document.getElementById("undo-button");
const clearButton = document.getElementById("clear-button");
let previousData; // Variable to store previous task list data

function addTask() {
    let taskText = inputBox.value;
        if (taskText === '') {
            alert("You must write something");
    }
    else {        
        let effortLevel = levelEffort.value;
        let li = document.createElement("li");
        let span = document.createElement("span");

        li.innerHTML = taskText + "(" + effortLevel + ")";
        li.setAttribute("data-effort", effortLevel); // Set a data attribute to store the effort level
        listContainer.appendChild(li);
        span.innerHTML = "\u00d7";
        li.appendChild(span);
    }
    inputBox.value = "";
    sortTaskByEffort();
    previousData = listContainer.innerHTML;
    saveData();
}

function handleKeyPress(event) {
    if (event.key === 'Enter') {
        addTask();
    }
}

function sortTaskByEffort() {
    let tasks = Array.from(listContainer.children);
    tasks.sort(function (a, b) {
        let effortA = a.getAttribute("data-effort");
        let effortB = b.getAttribute("data-effort");
        let effortLevels = { "Easy": 1, "Normal": 2, "Hard": 3 };

        // If both tasks have the same effort level, sort alphabetically
        if (effortLevels[effortA] === effortLevels[effortB]) {
            return a.innerHTML.localeCompare(b.innerHTML);
        }

        // Otherwise, sort by effort level
        return effortLevels[effortB] - effortLevels[effortA];
    })

    // This while loop removes all existing tasks from the listContainer
    // element. This step is necessary to clear the container before adding
    // the sorted tasks back in the next step.
    while (listContainer.firstChild) {
        listContainer.removeChild(listContainer.firstChild);
    }

    // This forEach loop iterates over the sorted tasks array (tasks).
    // For each task, it appends the task back to the listContainer element,
    // effectively adding the sorted tasks back to the task list container.
    tasks.forEach(function (task) {
        listContainer.appendChild(task);
    });
}

listContainer.addEventListener("click", function (e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
    }
    else if (e.target.tagName === "SPAN") {
        previousData = listContainer.innerHTML;
        e.target.parentElement.remove();
        saveData();
    }
}, false);

clearButton.addEventListener("click", function () {
    previousData = listContainer.innerHTML;     // Store the current task list data before clearing    
    listContainer.innerHTML = "";               // Remove all list items from the list container    
    saveData();                                 // After clearing the list, save the updated data
});

undoButton.addEventListener("click", function () {
    if (previousData) {
        listContainer.innerHTML = previousData; // If previous data exists, display it        
        saveData(); // Save the current data (after undo) to local storage
    }
});

function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    listContainer.innerHTML = localStorage.getItem("data");
}

showTask();