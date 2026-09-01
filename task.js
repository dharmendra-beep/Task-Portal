// ===============================
// GOOGLE SHEET API
// ===============================

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";
// ===============================
// SYNC TASK WITH GOOGLE SHEET
// ===============================

function syncTaskWithGoogleSheet(action, task) {

    fetch(GOOGLE_SHEET_API, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: action,
            task: task
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Google Sheet:", data);
    })
    .catch(error => {
        console.error("Google Sheet Sync Error:", error);
    });

}




// 1. We are accessing the HTML DOM element.

const parentTabs = document.querySelectorAll(".task-tab");
const childTabs = document.querySelectorAll(".task-child-tab");
const addTaskForm = document.getElementById("addTaskForm");
const taskStatus = document.getElementById("taskStatus");
const pendingType = document.getElementById("pendingType");
const childTabsContainer = document.querySelector(".task-child-tabs");
const taskTableBody = document.querySelector(".task-table tbody");

// 2. We are adding an event listener to the taskStatus dropdown.

taskStatus.addEventListener("change", function () {

    if (taskStatus.value === "Pending") {

        pendingType.disabled = false;

    } else {

        pendingType.disabled = true;
        pendingType.value = "";

    }

});


// 3. We are creating an array of tasks.

let tasks = [
    {
        projectName: "CRM Portal",
        taskId: "TASK-001",
        createdDate: "12 Aug 2026",
        estimationDate: "13 Aug 2026",
        estimationAssign: "4 Hours",
        developer: "Rahul",
        workingTime: "2 Hours",
        receiveDate: "12 Aug 2026",
        receiveTime: "10:30 AM",
        apkDate: "13 Aug 2026",
        apkTime: "04:00 PM",
        relatedTo: "UI",
        contactPerson: "Amit",
        status: "Pending",
        pendingType: "Client Side Pending"
    },

    {
        projectName: "Task Manager",
        taskId: "TASK-002",
        createdDate: "12 Aug 2026",
        estimationDate: "14 Aug 2026",
        estimationAssign: "6 Hours",
        developer: "Vikas",
        workingTime: "3 Hours",
        receiveDate: "12 Aug 2026",
        receiveTime: "11:00 AM",
        apkDate: "14 Aug 2026",
        apkTime: "05:00 PM",
        relatedTo: "Dashboard",
        contactPerson: "Rohit",
        status: "Pending",
        pendingType: "Development Pending"
    },
    {
    projectName: "CRM Portal",
    taskId: "TASK-003",
    createdDate: "12 Aug 2026",
    estimationDate: "15 Aug 2026",
    estimationAssign: "5 Hours",
    developer: "Aman",
    workingTime: "1 Hour",
    receiveDate: "12 Aug 2026",
    receiveTime: "12:00 PM",
    apkDate: "15 Aug 2026",
    apkTime: "03:00 PM",
    relatedTo: "Testing",
    contactPerson: "Raj",
    status: "Pending",
    pendingType: "Testing Pending"
},

{
    projectName: "Task Manager",
    taskId: "TASK-004",
    createdDate: "12 Aug 2026",
    estimationDate: "16 Aug 2026",
    estimationAssign: "3 Hours",
    developer: "Amit",
    workingTime: "2 Hours",
    receiveDate: "12 Aug 2026",
    receiveTime: "01:00 PM",
    apkDate: "16 Aug 2026",
    apkTime: "04:00 PM",
    relatedTo: "Review",
    contactPerson: "Ravi",
    status: "Pending",
    pendingType: "In Review Pending"
},

{
    projectName: "CRM Portal",
    taskId: "TASK-005",
    createdDate: "12 Aug 2026",
    estimationDate: "17 Aug 2026",
    estimationAssign: "4 Hours",
    developer: "Vikas",
    workingTime: "2 Hours",
    receiveDate: "12 Aug 2026",
    receiveTime: "02:00 PM",
    apkDate: "17 Aug 2026",
    apkTime: "05:00 PM",
    relatedTo: "Confirmation",
    contactPerson: "Suresh",
    status: "Pending",
    pendingType: "Confirmation Pending"
}
];

// 4. We are checking if there are any saved tasks in localStorage & converting from json.string to object and assigning to tasks array. If not, we are saving the tasks array to localStorage.

const savedTasks = localStorage.getItem("crmTasks");

if (savedTasks) {
    tasks = JSON.parse(savedTasks);
} else {
    localStorage.setItem("crmTasks", JSON.stringify(tasks));
}

// 5. We are creating a function to display the tasks in the table.
function showTasks(taskList, currentTab) {
    //5.1. we are clair the tebale body before adding new rows to avoid duplication of data.

    taskTableBody.innerHTML = "";
    //5.2 hare we are creating a new row for each task in the taskList and adding it to the table body.

    taskList.forEach(function (task) {

        const row = document.createElement("tr");
//5.3 we are adding the task data to the row using template literals and adding a change status button if the task status is pending or in process.
        row.innerHTML = `
            <td>${task.projectName}</td>
           <td>
    <span class="task-id-badge">${task.taskId}</span>
</td>
            <td>${task.createdDate}</td>
            <td>${task.estimationDate}</td>
            <td>${task.estimationAssign}</td>
            <td>${task.developer}</td>
            <td>${task.workingTime}</td>
            <td>${task.receiveDate}</td>
            <td>${task.receiveTime}</td>
            <td>${task.apkDate}</td>
            <td>${task.apkTime}</td>
            <td>${task.relatedTo}</td>
            <td>${task.contactPerson}</td>
            
    <td>
    <span class="status-badge ${task.status
    .toLowerCase()
    .replace(" ", "-")}">
    ${task.status}
</span>

${
    task.status === "Pending" || task.status === "In Process"
    ? `<button class="change-status-btn" data-task-id="${task.taskId}">
          Change Status
       </button>`
    : ""
}
</td>
        `;

        taskTableBody.appendChild(row);
    });
}


parentTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        parentTabs.forEach(function (item) {
            item.classList.remove("active");
        });

        tab.classList.add("active");


        const tabName = tab.textContent.trim();


        if (tabName === "Pending Task") {

            childTabsContainer.style.display = "flex";

            childTabs.forEach(function (item) {
                item.classList.remove("active");
            });

            childTabs[0].classList.add("active");


            const pendingTasks = tasks.filter(function (task) {
                return task.status === "Pending";
            });

        showTasks(pendingTasks, "Pending Task");
        } else {

            childTabsContainer.style.display = "none";

            const filteredTasks = tasks.filter(function (task) {
                return task.status === tabName;
            });

            showTasks(filteredTasks, tabName);
        }

    });

});


childTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        childTabs.forEach(function (item) {
            item.classList.remove("active");
        });

        tab.classList.add("active");


        const pendingType = tab.textContent.trim();


        let filteredTasks;

if (pendingType === "Development Pending") {

    filteredTasks = tasks.filter(function (task) {
        return task.status === "Pending" &&
               task.pendingType === "Development Pending";
    });

} else {

    filteredTasks = tasks.filter(function (task) {
        return task.status === "Pending" &&
               task.pendingType === pendingType;
    });

}

        showTasks(filteredTasks, tab.textContent.trim());

    });

});


showTasks(
    tasks.filter(function (task) {
        return task.status === "Pending";
    }),
    "Pending Task"
);

const addTaskButton = document.getElementById("addTaskButton");
const taskModal = document.getElementById("taskModal");
const closeTaskForm = document.getElementById("closeTaskForm");
const cancelTaskForm = document.getElementById("cancelTaskForm");


addTaskButton.onclick = function () {
    taskModal.style.display = "flex";
};

closeTaskForm.onclick = function () {
    taskModal.style.display = "none";
};

cancelTaskForm.onclick = function () {
    taskModal.style.display = "none";
};

addTaskForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const newTask = {
        projectName: document.getElementById("projectName").value,
        taskId: document.getElementById("taskId").value,
        createdDate: document.getElementById("createdDate").value,
        estimationDate: document.getElementById("estimationDate").value,
        estimationAssign: document.getElementById("estimationAssign").value,
        developer: document.getElementById("developer").value,
        workingTime: document.getElementById("workingTime").value,
        receiveDate: document.getElementById("receiveDate").value,
        receiveTime: document.getElementById("receiveTime").value,
        apkDate: document.getElementById("apkDate").value,
        apkTime: document.getElementById("apkTime").value,
        relatedTo: document.getElementById("relatedTo").value,
        contactPerson: document.getElementById("contactPerson").value,
        status: document.getElementById("taskStatus").value,
        pendingType: document.getElementById("pendingType").value
    };

    tasks.unshift(newTask);
    localStorage.setItem("crmTasks", JSON.stringify(tasks));

   syncTaskWithGoogleSheet("add", newTask);



if (newTask.status === "Pending") {

    const activeChildTab = document.querySelector(".task-child-tab.active");

    if (activeChildTab) {

        const selectedPendingType = activeChildTab.textContent.trim();

        if (newTask.pendingType === selectedPendingType) {
            showTasks([newTask]);
        }

    }

} else {

    showTasks([newTask]);

}
taskModal.style.display = "none";

addTaskForm.reset();
successPopup.style.display = "flex";

});

const successPopup = document.getElementById("successPopup");
const successPopupClose = document.getElementById("successPopupClose");

successPopupClose.onclick = function () {
    successPopup.style.display = "none";
};



document.addEventListener("click", function (event) {

    if (event.target.classList.contains("change-status-btn")) {

        const button = event.target;
        const currentCell = button.parentElement;
        const taskId = button.dataset.taskId;

        const existingDropdown = currentCell.querySelector(".status-dropdown");

        if (existingDropdown) {
            existingDropdown.remove();
            button.style.display = "block";
            return;
        }

        document.querySelectorAll(".status-dropdown").forEach(function (dropdown) {
            dropdown.remove();
        });

        document.querySelectorAll(".change-status-btn").forEach(function (btn) {
            btn.style.display = "block";
        });

        const dropdown = document.createElement("select");

        dropdown.className = "status-dropdown";
        dropdown.dataset.taskId = taskId;

        const currentTask = tasks.find(function (item) {
    return item.taskId === taskId;
});

if (currentTask && currentTask.status === "In Process") {

    dropdown.innerHTML = `
        <option value="">Change Status</option>
        <option value="Client Side Pending">Client Side Pending</option>
        <option value="Testing Pending">Testing Pending</option>
        <option value="In Review Pending">In Review Pending</option>
        <option value="Confirmation Pending">Confirmation Pending</option>
    `;

} else {

    dropdown.innerHTML = `
        <option value="">Change Status</option>
        <option value="In Process">In Process</option>
        <option value="Closed">Closed</option>
        <option value="Reject">Reject</option>
    `;

}

        button.style.display = "none";

        currentCell.appendChild(dropdown);

        dropdown.focus();
    }

});

document.addEventListener("change", function (event) {

    if (event.target.classList.contains("status-dropdown")) {

        const selectedStatus = event.target.value;
        const taskId = event.target.dataset.taskId;

        if (!selectedStatus) {
            return;
        }

        const task = tasks.find(function (item) {
            return item.taskId === taskId;
        });

        if (!task) {
            return;
        }


        // In Process → Pending Child
        if (
            task.status === "In Process" &&
            (
                selectedStatus === "Client Side Pending" ||
                selectedStatus === "Testing Pending" ||
                selectedStatus === "In Review Pending" ||
                selectedStatus === "Confirmation Pending"
            )
        ) {

            task.status = "Pending";
            task.pendingType = selectedStatus;

            localStorage.setItem("crmTasks", JSON.stringify(tasks));

            syncTaskWithGoogleSheet("update", task);

            parentTabs.forEach(function (tab) {
                tab.classList.remove("active");

                if (tab.textContent.trim() === "Pending Task") {
                    tab.classList.add("active");
                }
            });

            childTabsContainer.style.display = "flex";

            childTabs.forEach(function (tab) {
                tab.classList.remove("active");

                if (tab.textContent.trim() === selectedStatus) {
                    tab.classList.add("active");
                }
            });

            const pendingTasks = tasks.filter(function (item) {
                return item.status === "Pending" &&
                       item.pendingType === selectedStatus;
            });

            showTasks([task], selectedStatus);

            return;
        }


        // Pending → In Process / Closed / Reject
        task.status = selectedStatus;
        task.pendingType = "";

        localStorage.setItem("crmTasks", JSON.stringify(tasks));

        syncTaskWithGoogleSheet("update", task);

        parentTabs.forEach(function (tab) {
            tab.classList.remove("active");

            if (tab.textContent.trim() === selectedStatus) {
                tab.classList.add("active");
            }
        });

        childTabsContainer.style.display = "none";

        const updatedTasks = tasks.filter(function (item) {
            return item.status === selectedStatus;
        });

        showTasks(updatedTasks, selectedStatus);

    }

});

const taskSearch = document.getElementById("taskSearch");

taskSearch.addEventListener("input", function () {

    const searchText = taskSearch.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(function (task) {

        return task.projectName.toLowerCase().includes(searchText) ||
               task.taskId.toLowerCase().includes(searchText);

    });

    showTasks(filteredTasks, "Search");

});

const projectSearch = document.getElementById("projectSearch");

projectSearch.addEventListener("input", function () {

    const searchText = projectSearch.value.toLowerCase().trim();

    const filteredTasks = tasks.filter(function (task) {

        return task.projectName
            .toLowerCase()
            .includes(searchText);

    });

    showTasks(filteredTasks, "Project Search");

});

document.getElementById("clearProjectSearch").addEventListener("click", function () {

    document.getElementById("projectSearch").value = "";
    document.getElementById("taskSearch").value = "";

    document.getElementById("projectSearch").dispatchEvent(new Event("input"));
    document.getElementById("taskSearch").dispatchEvent(new Event("input"));

});

/* ========================================
   LOGOUT
======================================== */

const logoutButton =
    document.getElementById("logoutButton");


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        function () {

            sessionStorage.removeItem(
                "taskPortalLoggedIn"
            );

            window.location.href =
                "./login.html";

        }
    );

}

/* ========================================
   TASK RIGHT CLICK MENU
======================================== */


/* =========================
   ELEMENTS
========================= */

const taskContextMenu =
    document.getElementById(
        "taskContextMenu"
    );

const editTaskContext =
    document.getElementById(
        "editTaskContext"
    );

const deleteTaskContext =
    document.getElementById(
        "deleteTaskContext"
    );


const taskConfirmModal =
    document.getElementById(
        "taskConfirmModal"
    );

const taskConfirmIcon =
    document.getElementById(
        "taskConfirmIcon"
    );

const taskConfirmTitle =
    document.getElementById(
        "taskConfirmTitle"
    );

const taskConfirmMessage =
    document.getElementById(
        "taskConfirmMessage"
    );

const taskConfirmCancel =
    document.getElementById(
        "taskConfirmCancel"
    );

const taskConfirmOk =
    document.getElementById(
        "taskConfirmOk"
    );


/* =========================
   SELECTED TASK
========================= */

let selectedTask =
    null;

let selectedTaskIndex =
    null;


/* =========================
   EDIT MODE
========================= */

let taskEditMode =
    false;


/* =========================
   PENDING ACTION
========================= */

let taskPendingAction =
    null;


/* =========================
   RIGHT CLICK ON ROW
========================= */

taskTableBody.addEventListener(
    "contextmenu",
    function (event) {

        const row =
            event.target.closest("tr");


        if (!row) {

            return;

        }


        event.preventDefault();


        const rows =
            Array.from(
                taskTableBody.querySelectorAll("tr")
            );


        const rowIndex =
            rows.indexOf(row);


        if (rowIndex === -1) {

            return;

        }


        /*
         * Row ko identify karne ke liye
         * Task ID use kar rahe hain.
         */

        const taskIdCell =
            row.querySelector(
                ".task-id-badge"
            );


        if (!taskIdCell) {

            return;

        }


        const taskId =
            taskIdCell.textContent.trim();


        const foundTask =
            tasks.find(
                function (task) {

                    return (
                        task.taskId === taskId
                    );

                }
            );


        if (!foundTask) {

            return;

        }


        selectedTask =
            foundTask;


        selectedTaskIndex =
            tasks.indexOf(
                foundTask
            );


        if (
            selectedTaskIndex === -1
        ) {

            return;

        }


        /* =========================
           MENU POSITION
        ========================= */

        const menuWidth =
            145;

        const menuHeight =
            90;


        let left =
            event.clientX;

        let top =
            event.clientY;


        if (
            left + menuWidth >
            window.innerWidth
        ) {

            left =
                window.innerWidth -
                menuWidth -
                10;

        }


        if (
            top + menuHeight >
            window.innerHeight
        ) {

            top =
                window.innerHeight -
                menuHeight -
                10;

        }


        taskContextMenu.style.left =
            left + "px";

        taskContextMenu.style.top =
            top + "px";


        taskContextMenu.style.display =
            "block";

    }
);


/* =========================
   SHOW CONFIRMATION
========================= */

function showTaskConfirmation(
    action
) {

    taskPendingAction =
        action;


    if (action === "edit") {

        taskConfirmIcon.textContent =
            "✏️";

        taskConfirmTitle.textContent =
            "Confirm Edit";

        taskConfirmMessage.textContent =
            "Are you sure you want to edit this task?";

        taskConfirmOk.textContent =
            "Edit";

    }


    if (action === "delete") {

        taskConfirmIcon.textContent =
            "🗑️";

        taskConfirmTitle.textContent =
            "Confirm Delete";

        taskConfirmMessage.textContent =
            "Are you sure you want to delete this task?";

        taskConfirmOk.textContent =
            "Delete";

    }


    taskConfirmModal.style.display =
        "flex";

}


/* =========================
   EDIT MENU BUTTON
========================= */

editTaskContext.addEventListener(
    "click",
    function () {

        if (!selectedTask) {

            return;

        }


        taskContextMenu.style.display =
            "none";


        showTaskConfirmation(
            "edit"
        );

    }
);


/* =========================
   DELETE MENU BUTTON
========================= */

deleteTaskContext.addEventListener(
    "click",
    function () {

        if (!selectedTask) {

            return;

        }


        taskContextMenu.style.display =
            "none";


        showTaskConfirmation(
            "delete"
        );

    }
);


/* =========================
   CONFIRM EDIT
========================= */

function startTaskEdit() {

    if (
        !selectedTask ||
        selectedTaskIndex === null
    ) {

        return;

    }


    taskEditMode =
        true;


    /* =========================
       FILL FORM
    ========================= */

    document.getElementById(
        "projectName"
    ).value =
        selectedTask.projectName;


    document.getElementById(
        "taskId"
    ).value =
        selectedTask.taskId;


    document.getElementById(
        "createdDate"
    ).value =
        convertTaskDateForInput(
            selectedTask.createdDate
        );


    document.getElementById(
        "estimationDate"
    ).value =
        convertTaskDateForInput(
            selectedTask.estimationDate
        );


    document.getElementById(
        "estimationAssign"
    ).value =
        selectedTask.estimationAssign;


    document.getElementById(
        "developer"
    ).value =
        selectedTask.developer;


    document.getElementById(
        "workingTime"
    ).value =
        selectedTask.workingTime;


    document.getElementById(
        "receiveDate"
    ).value =
        convertTaskDateForInput(
            selectedTask.receiveDate
        );


    document.getElementById(
        "receiveTime"
    ).value =
        convertTaskTimeForInput(
            selectedTask.receiveTime
        );


    document.getElementById(
        "apkDate"
    ).value =
        convertTaskDateForInput(
            selectedTask.apkDate
        );


    document.getElementById(
        "apkTime"
    ).value =
        convertTaskTimeForInput(
            selectedTask.apkTime
        );


    document.getElementById(
        "relatedTo"
    ).value =
        selectedTask.relatedTo;


    document.getElementById(
        "contactPerson"
    ).value =
        selectedTask.contactPerson;


    document.getElementById(
        "taskStatus"
    ).value =
        selectedTask.status;


    document.getElementById(
        "pendingType"
    ).value =
        selectedTask.pendingType;


    /*
     * Pending Type ki existing condition
     * ko trigger karne ke liye.
     */

    taskStatus.dispatchEvent(
        new Event("change")
    );


    /* =========================
       TASK FORM TITLE
    ========================= */

    const taskFormTitle =
        document.querySelector(
            ".task-form-header h2"
        );


    if (taskFormTitle) {

        taskFormTitle.textContent =
            "Edit Task";

    }


    /* =========================
       SAVE BUTTON
    ========================= */

    const taskSaveButton =
        addTaskForm.querySelector(
            'button[type="submit"]'
        );


    if (taskSaveButton) {

        taskSaveButton.textContent =
            "Update Task";

    }


    /* =========================
       OPEN FORM
    ========================= */

    taskModal.style.display =
        "flex";

}


/* =========================
   DATE CONVERTER
========================= */

function convertTaskDateForInput(
    dateValue
) {

    if (!dateValue) {

        return "";

    }


    /*
     * Agar date already YYYY-MM-DD hai
     */

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(
            dateValue
        )
    ) {

        return dateValue;

    }


    /*
     * Example:
     * 12 Aug 2026
     */

    const parts =
        dateValue.split(" ");


    if (
        parts.length !== 3
    ) {

        return "";

    }


    const day =
        parts[0].padStart(
            2,
            "0"
        );


    const monthNames = {

        Jan: "01",
        Feb: "02",
        Mar: "03",
        Apr: "04",
        May: "05",
        Jun: "06",
        Jul: "07",
        Aug: "08",
        Sep: "09",
        Oct: "10",
        Nov: "11",
        Dec: "12"

    };


    const month =
        monthNames[
            parts[1]
        ];


    if (!month) {

        return "";

    }


    return (
        parts[2] +
        "-" +
        month +
        "-" +
        day
    );

}


/* =========================
   TIME CONVERTER
========================= */

function convertTaskTimeForInput(
    timeValue
) {

    if (!timeValue) {

        return "";

    }


    /*
     * Already 24-hour format
     */

    if (
        /^\d{2}:\d{2}$/.test(
            timeValue
        )
    ) {

        return timeValue;

    }


    const parts =
        timeValue
            .trim()
            .split(" ");


    if (
        parts.length !== 2
    ) {

        return "";

    }


    const timeParts =
        parts[0].split(":");


    if (
        timeParts.length !== 2
    ) {

        return "";

    }


    let hours =
        parseInt(
            timeParts[0],
            10
        );


    const minutes =
        timeParts[1];


    const period =
        parts[1].toUpperCase();


    if (
        Number.isNaN(hours)
    ) {

        return "";

    }


    if (
        period === "PM" &&
        hours !== 12
    ) {

        hours += 12;

    }


    if (
        period === "AM" &&
        hours === 12
    ) {

        hours = 0;

    }


    return (
        String(hours).padStart(2, "0") +
        ":" +
        minutes
    );

}


/* =========================
   CONFIRM BUTTON
========================= */

taskConfirmOk.addEventListener(
    "click",
    function () {

        if (
            taskPendingAction ===
            "edit"
        ) {

            taskConfirmModal.style.display =
                "none";

            taskPendingAction =
                null;

            startTaskEdit();

            return;

        }


        if (
            taskPendingAction ===
            "delete"
        ) {

            taskConfirmModal.style.display =
                "none";

            taskPendingAction =
                null;

            deleteSelectedTask();

        }

    }
);


/* =========================
   DELETE TASK
========================= */

function deleteSelectedTask() {

    if (
        selectedTaskIndex === null
    ) {

        return;

    }


    tasks.splice(
        selectedTaskIndex,
        1
    );


    localStorage.setItem(
        "crmTasks",
        JSON.stringify(tasks)
    );

    syncTaskWithGoogleSheet("update", task);


    selectedTask =
        null;

    selectedTaskIndex =
        null;


    /*
     * Existing active tab ko
     * refresh karne ke liye.
     */

    const activeParentTab =
        document.querySelector(
            ".task-tab.active"
        );


    if (activeParentTab) {

        const tabName =
            activeParentTab.textContent.trim();


        if (
            tabName ===
            "Pending Task"
        ) {

            const activeChildTab =
                document.querySelector(
                    ".task-child-tab.active"
                );


            if (activeChildTab) {

                const childName =
                    activeChildTab.textContent.trim();


                const filteredTasks =
                    tasks.filter(
                        function (task) {

                            return (
                                task.status ===
                                    "Pending" &&
                                task.pendingType ===
                                    childName
                            );

                        }
                    );


                showTasks(
                    filteredTasks,
                    childName
                );

            }

        } else {

            const filteredTasks =
                tasks.filter(
                    function (task) {

                        return (
                            task.status ===
                            tabName
                        );

                    }
                );


            showTasks(
                filteredTasks,
                tabName
            );

        }

    }

}


/* =========================
   CANCEL CONFIRMATION
========================= */

taskConfirmCancel.addEventListener(
    "click",
    function () {

        taskPendingAction =
            null;

        taskConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CLOSE CONFIRMATION
========================= */

taskConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            taskConfirmModal
        ) {

            taskPendingAction =
                null;

            taskConfirmModal.style.display =
                "none";

        }

    }
);


/* =========================
   ESCAPE
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            taskContextMenu.style.display =
                "none";

            taskConfirmModal.style.display =
                "none";

            taskPendingAction =
                null;

        }

    }
);


/* =========================
   CLOSE CONTEXT MENU
========================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !taskContextMenu.contains(
                event.target
            )
        ) {

            taskContextMenu.style.display =
                "none";

        }

    }
);


/* =========================
   EDIT SUBMIT INTERCEPT
========================= */

addTaskForm.addEventListener(
    "submit",
    function (event) {

        if (!taskEditMode) {

            return;

        }


        event.preventDefault();

        event.stopImmediatePropagation();


        if (
            selectedTaskIndex === null
        ) {

            return;

        }


        const task =
            tasks[
                selectedTaskIndex
            ];


        if (!task) {

            return;

        }


        /* =========================
           UPDATE SAME TASK
        ========================= */

        task.projectName =
            document.getElementById(
                "projectName"
            ).value;


        task.taskId =
            document.getElementById(
                "taskId"
            ).value;


        task.createdDate =
            document.getElementById(
                "createdDate"
            ).value;


        task.estimationDate =
            document.getElementById(
                "estimationDate"
            ).value;


        task.estimationAssign =
            document.getElementById(
                "estimationAssign"
            ).value;


        task.developer =
            document.getElementById(
                "developer"
            ).value;


        task.workingTime =
            document.getElementById(
                "workingTime"
            ).value;


        task.receiveDate =
            document.getElementById(
                "receiveDate"
            ).value;


        task.receiveTime =
            document.getElementById(
                "receiveTime"
            ).value;


        task.apkDate =
            document.getElementById(
                "apkDate"
            ).value;


        task.apkTime =
            document.getElementById(
                "apkTime"
            ).value;


        task.relatedTo =
            document.getElementById(
                "relatedTo"
            ).value;


        task.contactPerson =
            document.getElementById(
                "contactPerson"
            ).value;


        task.status =
            document.getElementById(
                "taskStatus"
            ).value;


        task.pendingType =
            document.getElementById(
                "pendingType"
            ).value;


        /* =========================
           SAVE
        ========================= */

        localStorage.setItem(
            "crmTasks",
            JSON.stringify(tasks)
        );

        syncTaskWithGoogleSheet("update", task);


        /* =========================
           RESET EDIT MODE
        ========================= */

        taskEditMode =
            false;


        selectedTask =
            null;

        selectedTaskIndex =
            null;


        /* =========================
           RESTORE FORM
        ========================= */

        taskModal.style.display =
            "none";


        addTaskForm.reset();


        const taskFormTitle =
            document.querySelector(
                ".task-form-header h2"
            );


        if (taskFormTitle) {

            taskFormTitle.textContent =
                "Add New Task";

        }


        const taskSaveButton =
            addTaskForm.querySelector(
                'button[type="submit"]'
            );


        if (taskSaveButton) {

            taskSaveButton.textContent =
                "Save Task";

        }


        /* =========================
           REFRESH CURRENT VIEW
        ========================= */

        const activeParentTab =
            document.querySelector(
                ".task-tab.active"
            );


        if (
            activeParentTab
        ) {

            const tabName =
                activeParentTab.textContent.trim();


            if (
                tabName ===
                "Pending Task"
            ) {

                const activeChildTab =
                    document.querySelector(
                        ".task-child-tab.active"
                    );


                if (
                    activeChildTab
                ) {

                    const childName =
                        activeChildTab.textContent.trim();


                    showTasks(
                        tasks.filter(
                            function (item) {

                                return (
                                    item.status ===
                                        "Pending" &&
                                    item.pendingType ===
                                        childName
                                );

                            }
                        ),
                        childName
                    );

                }

            } else {

                showTasks(
                    tasks.filter(
                        function (item) {

                            return (
                                item.status ===
                                tabName
                            );

                        }
                    ),
                    tabName
                );

            }

        }


        /* =========================
           SUCCESS MESSAGE
        ========================= */

        const successTitle =
            document.querySelector(
                "#successPopup h3"
            );

        const successMessage =
            document.querySelector(
                "#successPopup p"
            );


        if (successTitle) {

            successTitle.textContent =
                "Task Updated Successfully";

        }


        if (successMessage) {

            successMessage.textContent =
                "Your task has been updated successfully.";

        }


        successPopup.style.display =
            "flex";

    },
    true
);


/* =========================
   RESTORE ADD FORM
========================= */

function resetTaskFormMode() {

    taskEditMode =
        false;

    selectedTask =
        null;

    selectedTaskIndex =
        null;


    const taskFormTitle =
        document.querySelector(
            ".task-form-header h2"
        );


    if (taskFormTitle) {

        taskFormTitle.textContent =
            "Add New Task";

    }


    const taskSaveButton =
        addTaskForm.querySelector(
            'button[type="submit"]'
        );


    if (taskSaveButton) {

        taskSaveButton.textContent =
            "Save Task";

    }

}


/* =========================
   CANCEL / CLOSE EDIT
========================= */

cancelTaskForm.addEventListener(
    "click",
    function () {

        resetTaskFormMode();

    }
);


closeTaskForm.addEventListener(
    "click",
    function () {

        resetTaskFormMode();

    }
);


const currentDate = new Date();

const dateElement = document.querySelector('.dashboard-date strong');
const dayElement = document.querySelector('.dashboard-date span');

const dateOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
};

const dayOptions = {
    weekday: 'long'
};

dateElement.textContent = currentDate.toLocaleDateString('en-GB', dateOptions);
dayElement.textContent = currentDate.toLocaleDateString('en-US', dayOptions);