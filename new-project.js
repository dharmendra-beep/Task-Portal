/* =========================
   NEW PROJECT FORM
========================= */


/* =========================
   GOOGLE SHEET API
========================= */

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";

const addNewProjectButton =
    document.getElementById("addNewProjectButton");

const newProjectModal =
    document.getElementById("newProjectModal");

const closeNewProjectForm =
    document.getElementById("closeNewProjectForm");

const cancelNewProjectForm =
    document.getElementById("cancelNewProjectForm");

const newProjectForm =
    document.getElementById("newProjectForm");

const projectName =
    document.getElementById("newProjectName");

const assignDate =
    document.getElementById("assignDate");

const estimationTime =
    document.getElementById("estimationTime");

const estimationDate =
    document.getElementById("estimationDate");

const salesPerson =
    document.getElementById("salesPerson");

const contactPerson =
    document.getElementById("contactName");

const contactNumber =
    document.getElementById("contactNumber");

const frontendDeveloper =
    document.getElementById("frontendDeveloper");

const backendDeveloper =
    document.getElementById("backendDeveloper");

const projectStatus =
    document.getElementById("projectStatus");

const newProjectTableBody =
    document.getElementById("newProjectTableBody");

const NEW_PROJECTS_STORAGE_KEY =
    "crmNewProjects";

const LEGACY_PROJECTS_STORAGE_KEY =
    "crmProjects";


/* =========================
   STORAGE HELPERS
========================= */

function readStoredProjects(storageKey) {

    const savedProjects =
        localStorage.getItem(storageKey);

    if (!savedProjects) {

        return [];

    }


    try {

        const projects =
            JSON.parse(savedProjects);

        return Array.isArray(projects)
            ? projects
            : [];

    } catch (error) {

        return [];

    }

}


function isNewProjectRecord(project) {

    return Boolean(
        project &&
        (
            project.projectSource === "newProject" ||
            project.projectId ||
            project.assignDate ||
            project.estimationDate ||
            project.estimationTime ||
            project.projectStatus ||
            project.frontendDeveloper ||
            project.backendDeveloper
        )
    );

}


function migrateLegacyNewProjects() {

    if (
        localStorage.getItem(
            NEW_PROJECTS_STORAGE_KEY
        )
    ) {

        return;

    }


    const legacyProjects =
        readStoredProjects(
            LEGACY_PROJECTS_STORAGE_KEY
        );

    const newProjects =
        legacyProjects.filter(
            isNewProjectRecord
        );

    if (newProjects.length > 0) {

        localStorage.setItem(
            NEW_PROJECTS_STORAGE_KEY,
            JSON.stringify(
                newProjects
            )
        );

        fetch(GOOGLE_SHEET_API, {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        action: "updateNewProject",
        project: project,
        oldProjectName: oldProjectName
    })
})
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log(
        "New Project Google Sheet Update:",
        data
    );
})
.catch(function (error) {
    console.error(
        "New Project Google Sheet Update Error:",
        error
    );
});

    }

}


migrateLegacyNewProjects();


/* =========================
   LOAD NEW PROJECTS FROM GOOGLE SHEET
========================= */

function loadNewProjectsFromGoogleSheet() {

    fetch(GOOGLE_SHEET_API)

        .then(function (response) {
            return response.json();
        })

        .then(function (data) {

            if (
                !data.success ||
                !Array.isArray(data.newProjects)
            ) {
                console.error(
                    "New Project Google Sheet load failed."
                );
                return;
            }

            let projects =
                readStoredProjects(
                    NEW_PROJECTS_STORAGE_KEY
                );

            data.newProjects.forEach(
                function (sheetProject) {

                    if (!sheetProject.projectName) {
                        return;
                    }

                    const existingIndex =
                        projects.findIndex(
                            function (project) {
                                return (
                                    String(
                                        project.projectName
                                    ).trim().toLowerCase() ===
                                    String(
                                        sheetProject.projectName
                                    ).trim().toLowerCase()
                                );
                            }
                        );

                    if (existingIndex !== -1) {

                        projects[existingIndex] = {
                            ...projects[existingIndex],
                            projectName:
                                sheetProject.projectName,
                            assignDate:
                                sheetProject.assignDate,
                            estimationTime:
                                sheetProject.estimationTime,
                            salesPerson:
                                sheetProject.salesPerson,
                            contactPerson:
                                sheetProject.contactPerson,
                            frontendDeveloper:
                                sheetProject.frontendDeveloper,
                            backendDeveloper:
                                sheetProject.backendDeveloper,
                            projectStatus:
                                sheetProject.projectStatus ||
                                "Assigned"
                        };

                    } else {

                        projects.unshift({
                            projectSource:
                                "newProject",

                            projectId:
                                createProjectId(),

                            projectName:
                                sheetProject.projectName,

                            assignDate:
                                sheetProject.assignDate,

                            estimationTime:
                                sheetProject.estimationTime,

                            estimationDate:
                                "",

                            salesPerson:
                                sheetProject.salesPerson,

                            contactPerson:
                                sheetProject.contactPerson,

                            contactNumber:
                                "",

                            frontendDeveloper:
                                sheetProject.frontendDeveloper,

                            backendDeveloper:
                                sheetProject.backendDeveloper,

                            projectStatus:
                                sheetProject.projectStatus ||
                                "Assigned",

                            companyName:
                                "",

                            profileProjectName:
                                sheetProject.projectName,

                            profileProjectType:
                                "",

                            comments:
                                []
                        });

                    }

                }
            );

            localStorage.setItem(
                NEW_PROJECTS_STORAGE_KEY,
                JSON.stringify(projects)
            );

            showProjects();


        })

        .catch(function (error) {

            console.error(
                "New Project Google Sheet Error:",
                error
            );

        });

}

/* =========================
   OPEN FORM
========================= */

addNewProjectButton.addEventListener(
    "click",
    function () {

        newProjectModal.style.display =
            "flex";

    }
);


/* =========================
   CLOSE FORM
========================= */

closeNewProjectForm.addEventListener(
    "click",
    function () {

        newProjectModal.style.display =
            "none";

    }
);


/* =========================
   CANCEL FORM
========================= */

cancelNewProjectForm.addEventListener(
    "click",
    function () {

        newProjectModal.style.display =
            "none";

    }
);


/* =========================
   CALCULATE ESTIMATION TIME
========================= */

function calculateEstimationTime() {

    if (
        !assignDate.value ||
        !estimationDate.value
    ) {

        estimationTime.value =
            "";

        return;

    }


    const assign =
        new Date(
            assignDate.value
        );

    const estimation =
        new Date(
            estimationDate.value
        );


    const difference =
        estimation - assign;


    const days =
        difference /
        (1000 * 60 * 60 * 24);


    if (days < 0) {

        estimationTime.value =
            "";

        alert(
            "Estimation Date cannot be before Assign Date."
        );

        estimationDate.value =
            "";

        return;

    }


    estimationTime.value =
        days +
        (
            days === 1
                ? " Day"
                : " Days"
        );

}


assignDate.addEventListener(
    "change",
    calculateEstimationTime
);


estimationDate.addEventListener(
    "change",
    calculateEstimationTime
);


/* =========================
   CREATE PROJECT ID
========================= */

function createProjectId() {

    if (
        window.crypto &&
        crypto.randomUUID
    ) {

        return crypto.randomUUID();

    }


    return (
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2)
    );

}


/* =========================
   STATUS CLASS
========================= */

function getNewProjectStatusClass(
    status
) {

    if (
        status === "Assigned" ||
        status === "Assign"
    ) {

        return (
            "new-project-status-assigned"
        );

    }


    if (
        status ===
            "Kick-off Call Done" ||

        status ===
            "Internal Meeting Done" ||

        status ===
            "Assign to Developer" ||

        status ===
            "First Demo"
    ) {

        return (
            "new-project-status-in-process"
        );

    }


    if (
        status ===
            "Testing Pending"
    ) {

        return (
            "new-project-status-testing"
        );

    }


    if (
        status ===
            "New Changes"
    ) {

        return (
            "new-project-status-changes"
        );

    }


    if (
        status ===
            "Development Completed" ||

        status ===
            "Testing Completed" ||

        status ===
            "Final Demo" ||

        status ===
            "Account Approval" ||

        status ===
            "Live"
    ) {

        return (
            "new-project-status-completed"
        );

    }


    return (
        "new-project-status-assigned"
    );

}


/* =========================
   SHOW PROJECTS
========================= */

function showProjects() {

    newProjectTableBody.innerHTML =
        "";


    const savedProjects =
        localStorage.getItem(
            NEW_PROJECTS_STORAGE_KEY
        );


    if (!savedProjects) {

        return;

    }


    let projects = [];


    try {

        projects =
            JSON.parse(
                savedProjects
            );

    } catch (error) {

        projects = [];

    }


    if (!Array.isArray(projects)) {

        projects = [];

    }


    /* =========================
       ENSURE PROJECT IDs
    ========================= */

    let idsChanged =
        false;


    projects.forEach(
        function (project) {

            if (!project.projectId) {

                project.projectId =
                    createProjectId();

                idsChanged =
                    true;

            }


            if (
                !Array.isArray(
                    project.comments
                )
            ) {

                project.comments =
                    [];

                idsChanged =
                    true;

            }

        }
    );


    if (idsChanged) {

        localStorage.setItem(
            NEW_PROJECTS_STORAGE_KEY,
            JSON.stringify(
                projects
            )
        );

    }


    /* =========================
       CREATE TABLE ROWS
    ========================= */

    projects.forEach(
        function (project) {

            const row =
                document.createElement(
                    "tr"
                );
                row.dataset.projectId =
    project.projectId;


            /* =========================
               PROJECT NAME
            ========================= */

            const projectNameCell =
                document.createElement(
                    "td"
                );


            const projectNameLink =
                document.createElement(
                    "a"
                );


            projectNameLink.href =
                "./profile-new-project.html?projectId=" +
                encodeURIComponent(
                    project.projectId
                );


            projectNameLink.className =
                "project-name-link";


            projectNameLink.textContent =
                project.projectName ||
                "-";


            projectNameCell.appendChild(
                projectNameLink
            );


            /* =========================
               ASSIGN DATE
            ========================= */

            const assignDateCell =
                document.createElement(
                    "td"
                );


            assignDateCell.textContent =
                project.assignDate ||
                "-";


            /* =========================
               ESTIMATION TIME
            ========================= */

            const estimationTimeCell =
                document.createElement(
                    "td"
                );


            estimationTimeCell.textContent =
                project.estimationTime ||
                "-";


            /* =========================
               SALES PERSON
            ========================= */

            const salesPersonCell =
                document.createElement(
                    "td"
                );


            salesPersonCell.textContent =
                project.salesPerson ||
                "-";


            /* =========================
               CONTACT PERSON
            ========================= */

            const contactPersonCell =
                document.createElement(
                    "td"
                );


            contactPersonCell.textContent =
                project.contactPerson ||
                "-";


            /* =========================
               CONTACT NUMBER
            ========================= */

            const contactNumberCell =
                document.createElement(
                    "td"
                );


            contactNumberCell.textContent =
                project.contactNumber ||
                "-";


            /* =========================
               FRONTEND DEVELOPER
            ========================= */

            const frontendCell =
                document.createElement(
                    "td"
                );


            frontendCell.textContent =
                project.frontendDeveloper ||
                "-";


            /* =========================
               BACKEND DEVELOPER
            ========================= */

            const backendCell =
                document.createElement(
                    "td"
                );


            backendCell.textContent =
                project.backendDeveloper ||
                "-";


            /* =========================
               STATUS BADGE
            ========================= */

            const statusCell =
                document.createElement(
                    "td"
                );


            const statusBadge =
                document.createElement(
                    "span"
                );


            let status =
                project.projectStatus ||
                "Assigned";


            /*
              Existing projects mein agar
              purana "Testing Pending"
              saved hai, to table mein
              usko Testing Completed
              consider karenge.
            */

            if (
                status ===
                "Testing Pending"
            ) {

                status =
                    "Testing Completed";

            }


            statusBadge.className =
                "new-project-status-badge " +
                getNewProjectStatusClass(
                    status
                );


            statusBadge.textContent =
                status;


            statusCell.appendChild(
                statusBadge
            );


            /* =========================
               VIEW ROADMAP
            ========================= */

            const checkStatusCell =
                document.createElement(
                    "td"
                );


            const roadmapButton =
                document.createElement(
                    "button"
                );


            roadmapButton.type =
                "button";


            roadmapButton.className =
                "view-roadmap-button";


            roadmapButton.textContent =
                "View Roadmap";


            roadmapButton.addEventListener(
                "click",
                function () {

                    const params =
                        new URLSearchParams();


                    params.set(
                        "projectId",
                        project.projectId
                    );


                    window.location.href =
                        "./project-roadmap.html?" +
                        params.toString();

                }
            );


            checkStatusCell.appendChild(
                roadmapButton
            );


            /* =========================
               APPEND CELLS
            ========================= */

            row.appendChild(
                projectNameCell
            );


            row.appendChild(
                assignDateCell
            );


            row.appendChild(
                estimationTimeCell
            );


            row.appendChild(
                salesPersonCell
            );


            row.appendChild(
                contactPersonCell
            );


            row.appendChild(
                contactNumberCell
            );


            row.appendChild(
                frontendCell
            );


            row.appendChild(
                backendCell
            );


            row.appendChild(
                statusCell
            );


            row.appendChild(
                checkStatusCell
            );


            newProjectTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================
   FORM SUBMIT
========================= */

newProjectForm.addEventListener(
    "submit",
    function (event) {

        if (newProjectEditMode) {

            return;

        }


        event.preventDefault();


        /* =========================
           PROJECT NAME
        ========================= */

        const projectNameValue =
            projectName.value.trim();


        if (!projectNameValue) {

            alert(
                "Please enter Project Name."
            );

            projectName.focus();

            return;

        }


        if (
            !/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/
                .test(
                    projectNameValue
                )
        ) {

            alert(
                "Project Name can contain only letters and spaces."
            );

            projectName.focus();

            return;

        }


        /* =========================
           ASSIGN DATE
        ========================= */

        if (!assignDate.value) {

            alert(
                "Please select Assign Date."
            );

            assignDate.focus();

            return;

        }


        /* =========================
           ESTIMATION DATE
        ========================= */

        if (!estimationDate.value) {

            alert(
                "Please select Estimation Date."
            );

            estimationDate.focus();

            return;

        }


        /* =========================
           SALES PERSON
        ========================= */

        if (
            !salesPerson.value.trim()
        ) {

            alert(
                "Please enter Sales Person."
            );

            salesPerson.focus();

            return;

        }


        /* =========================
           CONTACT PERSON
        ========================= */

        if (
            !contactPerson.value.trim()
        ) {

            alert(
                "Please enter Contact Person."
            );

            contactPerson.focus();

            return;

        }


        /* =========================
           CONTACT NUMBER
        ========================= */

        const phoneNumber =
            contactNumber.value.trim();


        if (!phoneNumber) {

            alert(
                "Please enter Contact Number."
            );

            contactNumber.focus();

            return;

        }


        if (
            !/^\d{10}$/.test(
                phoneNumber
            )
        ) {

            alert(
                "Contact Number must contain exactly 10 digits."
            );

            contactNumber.focus();

            return;

        }


        /* =========================
           FRONTEND DEVELOPER
        ========================= */

        if (
            !frontendDeveloper.value.trim()
        ) {

            alert(
                "Please enter Frontend Developer."
            );

            frontendDeveloper.focus();

            return;

        }


        /* =========================
           BACKEND DEVELOPER
        ========================= */

        if (
            !backendDeveloper.value.trim()
        ) {

            alert(
                "Please enter Backend Developer."
            );

            backendDeveloper.focus();

            return;

        }


        /* =========================
           PROJECT STATUS
        ========================= */

        if (
            projectStatus.value !==
            "Assigned"
        ) {

            alert(
                "Project Status must be Assigned."
            );

            projectStatus.focus();

            return;

        }


        /* =========================
           CREATE PROJECT
        ========================= */

        const newProject = {

            projectSource:
                "newProject",

            projectId:
                createProjectId(),

            projectName:
                projectNameValue,

            assignDate:
                assignDate.value,

            estimationTime:
                estimationTime.value,

            estimationDate:
                estimationDate.value,

            salesPerson:
                salesPerson.value.trim(),

            contactPerson:
                contactPerson.value.trim(),

            contactNumber:
                contactNumber.value.trim(),

            frontendDeveloper:
                frontendDeveloper.value.trim(),

            backendDeveloper:
                backendDeveloper.value.trim(),

            projectStatus:
                "Assigned",

            companyName:
                "",

            profileProjectName:
                projectNameValue,

            profileProjectType:
                "",

            comments:
                []

        };


        /* =========================
           GET EXISTING PROJECTS
        ========================= */

        let projects = [];


        const savedProjects =
            localStorage.getItem(
                NEW_PROJECTS_STORAGE_KEY
            );


        if (savedProjects) {

            try {

                projects =
                    JSON.parse(
                        savedProjects
                    );

            } catch (error) {

                projects = [];

            }

        }


        /* =========================
           CHECK ARRAY
        ========================= */

        if (!Array.isArray(projects)) {

            projects = [];

        }


        /* =========================
           OLD PROJECT IDs
        ========================= */

        projects.forEach(
            function (project) {

                if (!project.projectId) {

                    project.projectId =
                        createProjectId();

                }


                if (
                    !Array.isArray(
                        project.comments
                    )
                ) {

                    project.comments =
                        [];

                }

            }
        );


        /* =========================
           ADD NEW PROJECT
        ========================= */

        projects.unshift(
            newProject
        );


        /* =========================
           SAVE PROJECTS
        ========================= */

        localStorage.setItem(
            NEW_PROJECTS_STORAGE_KEY,
            JSON.stringify(
                projects
            )
        );


        /* =========================
           UPDATE TABLE
        ========================= */

        showProjects();

        fetch(GOOGLE_SHEET_API, {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        action: "addNewProject",
        project: newProject
    })
})
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log("New Project Google Sheet:", data);
})
.catch(function (error) {
    console.error("New Project Google Sheet Error:", error);
});

        /* =========================
           CLOSE FORM
        ========================= */

        newProjectModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        newProjectForm.reset();

        estimationTime.value =
            "";


        /* =========================
           SUCCESS POPUP
        ========================= */

        const successPopup =
            document.getElementById(
                "newProjectSuccessPopup"
            );


        if (successPopup) {

            successPopup.style.display =
                "flex";

        } else {

            alert(
                "Project saved successfully."
            );

        }

    }
);


/* =========================
   SUCCESS POPUP
========================= */

const newProjectSuccessClose =
    document.getElementById(
        "newProjectSuccessClose"
    );


const newProjectSuccessPopup =
    document.getElementById(
        "newProjectSuccessPopup"
    );


if (
    newProjectSuccessClose &&
    newProjectSuccessPopup
) {

    newProjectSuccessClose.addEventListener(
        "click",
        function () {

            newProjectSuccessPopup.style.display =
                "none";

        }
    );

}


/* =========================
   INITIAL LOAD
========================= */

showProjects();


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
   NEW PROJECT SEARCH
======================================== */

const newProjectSearch =
    document.getElementById(
        "newProjectSearch"
    );

const clearNewProjectSearch =
    document.getElementById(
        "clearNewProjectSearch"
    );


/* =========================
   SEARCH FUNCTION
========================= */

function searchNewProjects(
    searchValue = ""
) {

    const value =
        searchValue
            .trim()
            .toLowerCase();


    const rows =
        newProjectTableBody.querySelectorAll(
            "tr"
        );


    rows.forEach(
        function (row) {

            const rowText =
                row.textContent
                    .toLowerCase();


            if (
                !value ||
                rowText.includes(value)
            ) {

                row.style.display =
                    "";

            } else {

                row.style.display =
                    "none";

            }

        }
    );

}


/* =========================
   LIVE SEARCH
========================= */

newProjectSearch.addEventListener(
    "input",
    function () {

        searchNewProjects(
            this.value
        );

    }
);


/* =========================
   CLEAR SEARCH
========================= */

clearNewProjectSearch.addEventListener(
    "click",
    function () {

        newProjectSearch.value =
            "";

        searchNewProjects();

        newProjectSearch.focus();

    }
);

/* ========================================
   PROJECT NAME COLUMN SEARCH
======================================== */

const newProjectNameSearch =
    document.getElementById(
        "newProjectNameSearch"
    );


/* =========================
   PROJECT NAME SEARCH
========================= */

newProjectNameSearch.addEventListener(
    "input",
    function () {

        const searchValue =
            this.value
                .trim()
                .toLowerCase();


        const rows =
            newProjectTableBody.querySelectorAll(
                "tr"
            );


        rows.forEach(
            function (row) {

                /*
                 * Project Name first cell hai.
                 */

                const projectNameCell =
                    row.cells[0];


                if (!projectNameCell) {

                    return;

                }


                const projectName =
                    projectNameCell.textContent
                        .trim()
                        .toLowerCase();


                if (
                    !searchValue ||
                    projectName.includes(
                        searchValue
                    )
                ) {

                    row.style.display =
                        "";

                } else {

                    row.style.display =
                        "none";

                }

            }
        );

    }
);

/* ========================================
   NEW PROJECT
   RIGHT CLICK + EDIT + DELETE
======================================== */


/* =========================
   ELEMENTS
========================= */

const newProjectContextMenu =
    document.getElementById("newProjectContextMenu");

const editNewProjectContext =
    document.getElementById("editNewProjectContext");

const deleteNewProjectContext =
    document.getElementById("deleteNewProjectContext");

const newProjectConfirmModal =
    document.getElementById("newProjectConfirmModal");

const newProjectConfirmIcon =
    document.getElementById("newProjectConfirmIcon");

const newProjectConfirmTitle =
    document.getElementById("newProjectConfirmTitle");

const newProjectConfirmMessage =
    document.getElementById("newProjectConfirmMessage");

const newProjectConfirmCancel =
    document.getElementById("newProjectConfirmCancel");

const newProjectConfirmOk =
    document.getElementById("newProjectConfirmOk");


/* =========================
   SELECTED PROJECT
========================= */

let selectedNewProjectId = null;

let newProjectEditMode = false;

let newProjectPendingAction = null;


/* =========================
   GET LATEST PROJECTS
========================= */

function getLatestNewProjects() {

    const savedProjects =
        localStorage.getItem(
            NEW_PROJECTS_STORAGE_KEY
        );

    if (!savedProjects) {

        return [];

    }


    try {

        const data =
            JSON.parse(savedProjects);

        return Array.isArray(data)
            ? data
            : [];

    } catch (error) {

        return [];

    }

}


/* =========================
   FIND SELECTED PROJECT
========================= */

function getSelectedNewProject() {

    if (!selectedNewProjectId) {

        return null;

    }


    const projects =
        getLatestNewProjects();


    return projects.find(
        function (project) {

            return (
                project.projectId ===
                selectedNewProjectId
            );

        }
    ) || null;

}


/* =========================
   RIGHT CLICK
========================= */

newProjectTableBody.addEventListener(
    "contextmenu",
    function (event) {

        const row =
            event.target.closest("tr");


        if (!row) {

            return;

        }


        event.preventDefault();


        const projectId =
            row.dataset.projectId;


        if (!projectId) {

            return;

        }


        const projects =
            getLatestNewProjects();


        const project =
            projects.find(
                function (item) {

                    return (
                        item.projectId ===
                        projectId
                    );

                }
            );


        if (!project) {

            return;

        }


        selectedNewProjectId =
            projectId;


        /* =========================
           MENU POSITION
        ========================= */

        const menuWidth = 145;

        const menuHeight = 90;


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


        newProjectContextMenu.style.left =
            left + "px";

        newProjectContextMenu.style.top =
            top + "px";

        newProjectContextMenu.style.display =
            "block";

    }
);


/* =========================
   CONFIRMATION
========================= */

function showNewProjectConfirmation(
    action
) {

    newProjectPendingAction =
        action;


    if (
        action === "edit"
    ) {

        newProjectConfirmIcon.textContent =
            "✏️";

        newProjectConfirmTitle.textContent =
            "Confirm Edit";

        newProjectConfirmMessage.textContent =
            "Are you sure you want to edit this project?";

        newProjectConfirmOk.textContent =
            "Edit";

    }


    if (
        action === "delete"
    ) {

        newProjectConfirmIcon.textContent =
            "🗑️";

        newProjectConfirmTitle.textContent =
            "Confirm Delete";

        newProjectConfirmMessage.textContent =
            "Are you sure you want to delete this project?";

        newProjectConfirmOk.textContent =
            "Delete";

    }


    newProjectConfirmModal.style.display =
        "flex";

}


/* =========================
   EDIT MENU
========================= */

editNewProjectContext.addEventListener(
    "click",
    function () {

        if (!selectedNewProjectId) {

            return;

        }


        newProjectContextMenu.style.display =
            "none";


        showNewProjectConfirmation(
            "edit"
        );

    }
);


/* =========================
   DELETE MENU
========================= */

deleteNewProjectContext.addEventListener(
    "click",
    function () {

        if (!selectedNewProjectId) {

            return;

        }


        newProjectContextMenu.style.display =
            "none";


        showNewProjectConfirmation(
            "delete"
        );

    }
);


/* =========================
   START EDIT
========================= */

function startNewProjectEdit() {

    const project =
        getSelectedNewProject();


    if (!project) {

        return;

    }


    newProjectEditMode =
        true;


    /* =========================
       FILL FORM
    ========================= */

    projectName.value =
        project.projectName || "";

    assignDate.value =
        project.assignDate || "";

    estimationDate.value =
        project.estimationDate || "";

    estimationTime.value =
        project.estimationTime || "";

    salesPerson.value =
        project.salesPerson || "";

    contactPerson.value =
        project.contactPerson || "";

    contactNumber.value =
        project.contactNumber || "";

    frontendDeveloper.value =
        project.frontendDeveloper || "";

    backendDeveloper.value =
        project.backendDeveloper || "";

    projectStatus.value =
        project.projectStatus ||
        "Assigned";


    /* =========================
       FORM TITLE
    ========================= */

    const formTitle =
        document.querySelector(
            ".new-project-modal-header h2"
        );


    if (formTitle) {

        formTitle.textContent =
            "Edit New Project";

    }


    /* =========================
       BUTTON
    ========================= */

    const saveButton =
        newProjectForm.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "Update Project";

    }


    /* =========================
       OPEN MODAL
    ========================= */

    newProjectModal.style.display =
        "flex";

}


/* =========================
   DELETE PROJECT
========================= */

function deleteSelectedNewProject() {

    if (!selectedNewProjectId) {

        return;

    }


    const projects =
        getLatestNewProjects();


    const projectIndex =
        projects.findIndex(
            function (project) {

                return (
                    project.projectId ===
                    selectedNewProjectId
                );

            }
        );


    if (
        projectIndex === -1
    ) {

        return;

    }


    const projectToDelete =
        projects[
            projectIndex
        ];


    projects.splice(
        projectIndex,
        1
    );


    localStorage.setItem(
        NEW_PROJECTS_STORAGE_KEY,
        JSON.stringify(
            projects
        )
    );


    fetch(GOOGLE_SHEET_API, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify({
            action: "deleteNewProject",
            project: {
                projectName: projectToDelete.projectName,
                projectId: projectToDelete.projectId
            }
        })
    })
    .then(function (response) {
        return response.json();
    })
    .then(function (data) {
        console.log("New Project Google Sheet Delete:", data);
    })
    .catch(function (error) {
        console.error("New Project Google Sheet Delete Error:", error);
    });


    selectedNewProjectId =
        null;


    showProjects();


    /* =========================
       RESTORE SEARCH
    ========================= */

    if (
        typeof newProjectSearch !==
        "undefined"
    ) {

        searchNewProjects(
            newProjectSearch.value
        );

    }


    if (
        typeof newProjectNameSearch !==
        "undefined"
    ) {

        newProjectNameSearch.dispatchEvent(
            new Event("input")
        );

    }

}


/* =========================
   CONFIRM BUTTON
========================= */

newProjectConfirmOk.addEventListener(
    "click",
    function () {

        if (
            newProjectPendingAction ===
            "edit"
        ) {

            newProjectConfirmModal.style.display =
                "none";

            newProjectPendingAction =
                null;


            startNewProjectEdit();

            return;

        }


        if (
            newProjectPendingAction ===
            "delete"
        ) {

            newProjectConfirmModal.style.display =
                "none";

            newProjectPendingAction =
                null;


            deleteSelectedNewProject();

        }

    }
);


/* =========================
   CANCEL CONFIRMATION
========================= */

newProjectConfirmCancel.addEventListener(
    "click",
    function () {

        newProjectPendingAction =
            null;

        newProjectConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CLOSE MODAL BACKGROUND
========================= */

newProjectConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            newProjectConfirmModal
        ) {

            newProjectPendingAction =
                null;

            newProjectConfirmModal.style.display =
                "none";

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
            !newProjectContextMenu.contains(
                event.target
            )
        ) {

            newProjectContextMenu.style.display =
                "none";

        }

    }
);


/* =========================
   ESC KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            newProjectContextMenu.style.display =
                "none";

            newProjectConfirmModal.style.display =
                "none";

            newProjectPendingAction =
                null;

        }

    }
);


/* =========================
   EDIT SUBMIT
========================= */

newProjectForm.addEventListener(
    "submit",
    function (event) {

        /*
         * Normal Add Project mode mein
         * existing code ko disturb nahi karna.
         */

        if (!newProjectEditMode) {

            return;

        }


        event.preventDefault();

        event.stopImmediatePropagation();


        if (!selectedNewProjectId) {

            return;

        }


        const projects =
            getLatestNewProjects();


        const projectIndex =
            projects.findIndex(
                function (project) {

                    return (
                        project.projectId ===
                        selectedNewProjectId
                    );

                }
            );


        if (
            projectIndex === -1
        ) {

            return;

        }


        const project =
            projects[
                projectIndex
            ];

        const oldProjectName =
            project.projectName || "";


        /* =========================
           UPDATE SAME PROJECT
        ========================= */

        project.projectName =
            projectName.value.trim();

        project.assignDate =
            assignDate.value;

        project.estimationDate =
            estimationDate.value;

        project.estimationTime =
            estimationTime.value;

        project.salesPerson =
            salesPerson.value.trim();

        project.contactPerson =
            contactPerson.value.trim();

        project.contactNumber =
            contactNumber.value.trim();

        project.frontendDeveloper =
            frontendDeveloper.value.trim();

        project.backendDeveloper =
            backendDeveloper.value.trim();

        project.projectStatus =
            projectStatus.value;


        /*
         * Project ID ko change nahi karna.
         */

        localStorage.setItem(
            NEW_PROJECTS_STORAGE_KEY,
            JSON.stringify(
                projects
            )
        );


        /* =========================
           RESET EDIT MODE
        ========================= */

        newProjectEditMode =
            false;

        selectedNewProjectId =
            null;


        /* =========================
           CLOSE FORM
        ========================= */

        newProjectModal.style.display =
            "none";


        newProjectForm.reset();


        /* =========================
           RESTORE TITLE
        ========================= */

        const formTitle =
            document.querySelector(
                ".new-project-modal-header h2"
            );


        if (formTitle) {

            formTitle.textContent =
                "Add New Project";

        }


        /* =========================
           RESTORE BUTTON
        ========================= */

        const saveButton =
            newProjectForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.textContent =
                "Save Project";

        }


        /* =========================
           REFRESH TABLE
        ========================= */
fetch(GOOGLE_SHEET_API, {
    method: "POST",
    headers: {
        "Content-Type": "text/plain;charset=utf-8"
    },
    body: JSON.stringify({
        action: "updateNewProject",
        project: project,
        oldProjectName: oldProjectName
    })
})
.then(function (response) {
    return response.json();
})
.then(function (data) {
    console.log("New Project Sheet Update:", data);
})
.catch(function (error) {
    console.error("New Project Sheet Update Error:", error);
});
        showProjects();

        


        /* =========================
           RESTORE SEARCH
        ========================= */

        if (
            typeof newProjectSearch !==
            "undefined"
        ) {

            searchNewProjects(
                newProjectSearch.value
            );

        }


        if (
            typeof newProjectNameSearch !==
            "undefined"
        ) {

            newProjectNameSearch.dispatchEvent(
                new Event("input")
            );

        }

    },
    true
);


/* =========================
   RESET EDIT MODE
========================= */

function resetNewProjectEditMode() {

    newProjectEditMode =
        false;

    selectedNewProjectId =
        null;


    const formTitle =
        document.querySelector(
            ".new-project-modal-header h2"
        );


    if (formTitle) {

        formTitle.textContent =
            "Add New Project";

    }


    const saveButton =
        newProjectForm.querySelector(
            'button[type="submit"]'
        );


    if (saveButton) {

        saveButton.textContent =
            "Save Project";

    }

}


/* =========================
   CANCEL EDIT
========================= */

cancelNewProjectForm.addEventListener(
    "click",
    function () {

        resetNewProjectEditMode();

    }
);


/* =========================
   CLOSE EDIT
========================= */

closeNewProjectForm.addEventListener(
    "click",
    function () {

        resetNewProjectEditMode();

    }
);


/* =========================
   LOAD FROM GOOGLE SHEET
========================= */

loadNewProjectsFromGoogleSheet();

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