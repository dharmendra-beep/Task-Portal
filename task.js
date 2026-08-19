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

    tasks.push(newTask);
    localStorage.setItem("crmTasks", JSON.stringify(tasks));
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