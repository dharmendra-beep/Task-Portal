/* =========================
   MY PROJECT MANAGEMENT
========================= */

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";


/* =========================
   ELEMENTS
========================= */

const projectSearch =
    document.getElementById("projectSearch");

const clearProjectSearch =
    document.getElementById("clearProjectSearch");

const projectTableBody =
    document.getElementById("projectTableBody");

const addProjectButton =
    document.getElementById("addProjectButton");

const projectModal =
    document.getElementById("projectModal");

const closeProjectForm =
    document.getElementById("closeProjectForm");

const cancelProjectForm =
    document.getElementById("cancelProjectForm");

const addProjectForm =
    document.getElementById("addProjectForm");

const projectName =
    document.getElementById("projectName");

const pastBA =
    document.getElementById("pastBA");

const presentBA =
    document.getElementById("presentBA");

const salesPerson =
    document.getElementById("salesPerson");

const projectType =
    document.getElementById("projectType");

const totalUser =
    document.getElementById("totalUser");

const businessType =
    document.getElementById("businessType");

const webPortalUrl =
    document.getElementById("webPortalUrl");

const projectSuccessPopup =
    document.getElementById("projectSuccessPopup");

const projectSuccessClose =
    document.getElementById("projectSuccessClose");


/* =========================
   PROJECT DATA
========================= */

let projects = [];

const savedProjects =
    localStorage.getItem("crmProjects");

function createSheetRecordId(prefix) {

    return (
        prefix +
        "-" +
        Date.now().toString(36) +
        "-" +
        Math.random()
            .toString(36)
            .slice(2, 8)
    );

}


function isNewProjectRecord(project) {

    if (
        project &&
        project.projectSource === "myProject"
    ) {
        return false;
    }

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

if (savedProjects) {

    try {

        projects =
            JSON.parse(savedProjects);

        projects =
            Array.isArray(projects)
                ? projects.filter(function (project) {
                    return !isNewProjectRecord(project);
                })
                : [];

    } catch (error) {

        projects = [];

    }

}


/* =========================
   SAVE PROJECTS
========================= */

function saveProjects() {

    localStorage.setItem(
        "crmProjects",
        JSON.stringify(projects)
    );

}

function parseGoogleSheetResponse(response) {

    return response
        .text()
        .then(function (text) {

            if (!text) {
                return {};
            }

            try {
                return JSON.parse(text);
            } catch (error) {
                return {
                    success: response.ok,
                    message: text
                };
            }

        });

}


function ensureProjectSheetIds() {

    let changed =
        false;

    projects.forEach(function (project) {

        if (!project.sheetRecordId) {

            project.sheetRecordId =
                createSheetRecordId("MYPROJECT");

            changed =
                true;

        }

    });

    if (changed) {
        saveProjects();
    }

}


function getGoogleSheetAction(action) {

    return action;

}


function createGoogleSheetProjectRow(project, action) {

    const status =
        action === "deleteProject"
            ? "Deleted"
            : project.projectStatus || "Assigned";

    return [
        project.projectName || "",
        project.pastBA || "",
        project.presentBA || "",
        project.salesPerson || "",
        project.projectType || "",
        project.totalUser || "",
        project.businessType || "",
        project.webPortalUrl || ""
    ];

}


function syncProjectWithGoogleSheet(action, project, extraData = {}) {

    if (!GOOGLE_SHEET_API || !project) {
        return Promise.resolve(null);
    }

    const googleSheetAction =
        getGoogleSheetAction(action);

    const sheetRow =
        createGoogleSheetProjectRow(
            project,
            action
        );

    return fetch(GOOGLE_SHEET_API, {
        method: "POST",
        headers: {
            "Content-Type": "text/plain;charset=utf-8"
        },
        body: JSON.stringify(
            Object.assign(
                {
                    action: googleSheetAction,
                    moduleAction: action,
                    recordType: "project",
                    project: project,
                    sheetRow: sheetRow
                },
                extraData
            )
        )
    })
    .then(parseGoogleSheetResponse)
    .then(function (data) {
        console.log("Google Sheet Project:", data);
        return data;
    })
    .catch(function (error) {
        console.error(
            "Google Sheet Project Sync Error:",
            error
        );
        return null;
    });

}


/* =========================
   SHOW PROJECTS
========================= */

function showProjects(projectList) {

    projectTableBody.innerHTML = "";


    projectList.forEach(function (project, index) {

        const row =
            document.createElement("tr");

        row.dataset.projectIndex =
            projects.indexOf(project);


        /* =========================
           PROJECT NAME
        ========================= */

        const projectNameCell =
            document.createElement("td");

        const projectNameLink =
    document.createElement("a");

projectNameLink.href =
    "project-profile.HTML?project=" +
    encodeURIComponent(project.projectName);

projectNameLink.className =
    "project-name-link";

projectNameLink.textContent =
    project.projectName;

        /*
         * Profile functionality
         * Part 2 mein yahin se project
         * profile open karenge.
         */

        


        projectNameCell.appendChild(
            projectNameLink

        );


        /* =========================
           PAST BA
        ========================= */

        const pastBACell =
            document.createElement("td");

        pastBACell.textContent =
            project.pastBA || "-";


        /* =========================
           PRESENT BA
        ========================= */

        const presentBACell =
            document.createElement("td");

        presentBACell.textContent =
            project.presentBA || "-";


        /* =========================
           SALES PERSON
        ========================= */

        const salesPersonCell =
            document.createElement("td");

        salesPersonCell.textContent =
            project.salesPerson || "-";


        /* =========================
           PROJECT TYPE
        ========================= */

        const projectTypeCell =
            document.createElement("td");

        projectTypeCell.textContent =
            project.projectType || "-";


        /* =========================
           TOTAL USER
        ========================= */

        const totalUserCell =
            document.createElement("td");

        totalUserCell.textContent =
            project.totalUser || "0";


        /* =========================
           BUSINESS TYPE
        ========================= */

        const businessTypeCell =
            document.createElement("td");

        businessTypeCell.textContent =
            project.businessType || "-";


        /* =========================
           WEB PORTAL
        ========================= */

        const webPortalCell =
            document.createElement("td");


        if (project.webPortalUrl) {

            const openButton =
                document.createElement("button");

            openButton.type =
                "button";

            openButton.className =
                "project-open-button";

            openButton.textContent =
                "Open";


            openButton.addEventListener(
                "click",
                function () {

                    let url =
                        project.webPortalUrl.trim();


                    /*
                     * Agar user https:// nahi likhta
                     * to automatically add kar denge.
                     */

                    if (
                        !url.startsWith("http://") &&
                        !url.startsWith("https://")
                    ) {

                        url =
                            "https://" + url;

                    }


                    window.open(
                        url,
                        "_blank"
                    );

                }
            );


            webPortalCell.appendChild(
                openButton
            );

        } else {

            const noUrlText =
                document.createElement("span");

            noUrlText.textContent =
                "No URL";

            noUrlText.style.color =
                "#9ca3af";

            webPortalCell.appendChild(
                noUrlText
            );

        }


        /* =========================
           REMOVE BUTTON
        ========================= */

        const removeButton =
            document.createElement("button");

        removeButton.type =
            "button";

        removeButton.className =
            "project-remove-button";

        removeButton.textContent =
            "Remove";


        removeButton.addEventListener(
            "click",
            function () {

                const confirmed =
                    confirm(
                        "Are you sure you want to remove " +
                        project.projectName +
                        "?"
                    );


                if (!confirmed) {
                    return;
                }


                /*
                 * Original project ko remove
                 * karne ke liye object reference
                 * se delete kar rahe hain.
                 */

                projects =
                    projects.filter(
                        function (item) {
                            return item !== project;
                        }
                    );


                saveProjects();

                syncProjectWithGoogleSheet(
                    "deleteProject",
                    project
                );

                filterProjects();

            }
        );


        webPortalCell.appendChild(
            document.createTextNode(" ")
        );

        webPortalCell.appendChild(
            removeButton
        );


        /* =========================
           ADD CELLS TO ROW
        ========================= */

        row.appendChild(
            projectNameCell
        );

        row.appendChild(
            pastBACell
        );

        row.appendChild(
            presentBACell
        );

        row.appendChild(
            salesPersonCell
        );

        row.appendChild(
            projectTypeCell
        );

        row.appendChild(
            totalUserCell
        );

        row.appendChild(
            businessTypeCell
        );

        row.appendChild(
            webPortalCell
        );


        projectTableBody.appendChild(
            row
        );

    });

}


/* =========================
   SEARCH PROJECTS
========================= */

function filterProjects() {

    const searchValue =
        projectSearch.value
            .trim()
            .toLowerCase();


    if (!searchValue) {

        showProjects(projects);

        return;

    }


    const filteredProjects =
        projects.filter(
            function (project) {

                return [

                    project.projectName,
                    project.pastBA,
                    project.presentBA,
                    project.salesPerson,
                    project.projectType,
                    project.businessType

                ].some(
                    function (value) {

                        return String(
                            value || ""
                        )
                        .toLowerCase()
                        .includes(
                            searchValue
                        );

                    }
                );

            }
        );


    showProjects(
        filteredProjects
    );

}

/* =========================
   SEARCH INPUT
========================= */

projectSearch.addEventListener(
    "input",
    function () {

        filterProjects();

    }
);


/* =========================
   CLEAR SEARCH
========================= */

clearProjectSearch.addEventListener(
    "click",
    function () {

        projectSearch.value = "";

        showProjects(projects);

    }
);


/* =========================
   OPEN ADD PROJECT MODAL
========================= */

addProjectButton.addEventListener(
    "click",
    function () {

        addProjectForm.reset();

        projectModal.style.display =
            "flex";

    }
);


/* =========================
   CLOSE MODAL
========================= */

closeProjectForm.addEventListener(
    "click",
    function () {

        projectModal.style.display =
            "none";

    }
);


cancelProjectForm.addEventListener(
    "click",
    function () {

        projectModal.style.display =
            "none";

    }
);


/* =========================
   ADD PROJECT
========================= */

addProjectForm.addEventListener(
    "submit",
    function (event) {

        if (projectEditMode) {

            return;

        }


        event.preventDefault();


        const newProject = {

            projectSource:
                "myProject",

            sheetRecordId:
                createSheetRecordId("MYPROJECT"),

            projectName:
                projectName.value.trim(),

            pastBA:
                pastBA.value.trim(),

            presentBA:
                presentBA.value.trim(),

            salesPerson:
                salesPerson.value.trim(),

            projectType:
                projectType.value,

            totalUser:
                totalUser.value,

            businessType:
                businessType.value.trim(),

            webPortalUrl:
                webPortalUrl.value.trim()

        };


        projects.unshift(
    newProject
);

saveProjects();

syncProjectWithGoogleSheet(
    "addProject",
    newProject
);

projectModal.style.display =
    "none";

addProjectForm.reset();

ensureProjectSheetIds();

showProjects(projects);


        projectSuccessPopup.style.display =
            "flex";

    }
);


/* =========================
   SUCCESS POPUP
========================= */

projectSuccessClose.addEventListener(
    "click",
    function () {

        projectSuccessPopup.style.display =
            "none";

    }
);


/* =========================
   INITIAL LOAD
========================= */

showProjects(projects);

loadProjectsFromGoogleSheet();


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
   PROJECT RIGHT CLICK MENU
======================================== */


/* =========================
   ELEMENTS
========================= */

const projectContextMenu =
    document.getElementById(
        "projectContextMenu"
    );

const editProjectContext =
    document.getElementById(
        "editProjectContext"
    );

const deleteProjectContext =
    document.getElementById(
        "deleteProjectContext"
    );


const projectConfirmModal =
    document.getElementById(
        "projectConfirmModal"
    );

const projectConfirmIcon =
    document.getElementById(
        "projectConfirmIcon"
    );

const projectConfirmTitle =
    document.getElementById(
        "projectConfirmTitle"
    );

const projectConfirmMessage =
    document.getElementById(
        "projectConfirmMessage"
    );

const projectConfirmCancel =
    document.getElementById(
        "projectConfirmCancel"
    );

const projectConfirmOk =
    document.getElementById(
        "projectConfirmOk"
    );


/* =========================
   SELECTED PROJECT
========================= */

let selectedProject =
    null;

let selectedProjectIndex =
    null;


/* =========================
   EDIT MODE
========================= */

let projectEditMode =
    false;


/* =========================
   PENDING ACTION
========================= */

let projectPendingAction =
    null;


/* =========================
   RIGHT CLICK ON PROJECT ROW
========================= */

projectTableBody.addEventListener(
    "contextmenu",
    function (event) {

        const row =
            event.target.closest("tr");


        if (!row) {

            return;

        }


        event.preventDefault();


        const projectIndex =
            Number(
                row.dataset.projectIndex
            );


        if (
            Number.isNaN(projectIndex) ||
            projectIndex < 0
        ) {

            return;

        }


        /*
         * Find original project
         * from the main projects array.
         */

        const foundProject =
            projects[projectIndex];


        if (!foundProject) {

            return;

        }


        selectedProject =
            foundProject;


        selectedProjectIndex =
            projectIndex;


        if (
            selectedProjectIndex === -1
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


        projectContextMenu.style.left =
            left + "px";

        projectContextMenu.style.top =
            top + "px";


        projectContextMenu.style.display =
            "block";

    }
);


/* =========================
   SHOW CONFIRMATION
========================= */

function showProjectConfirmation(
    action
) {

    projectPendingAction =
        action;


    if (action === "edit") {

        projectConfirmIcon.textContent =
            "✏️";

        projectConfirmTitle.textContent =
            "Confirm Edit";

        projectConfirmMessage.textContent =
            "Are you sure you want to edit this project?";

        projectConfirmOk.textContent =
            "Edit";

    }


    if (action === "delete") {

        projectConfirmIcon.textContent =
            "🗑️";

        projectConfirmTitle.textContent =
            "Confirm Delete";

        projectConfirmMessage.textContent =
            "Are you sure you want to delete this project?";

        projectConfirmOk.textContent =
            "Delete";

    }


    projectConfirmModal.style.display =
        "flex";

}


/* =========================
   EDIT MENU BUTTON
========================= */

editProjectContext.addEventListener(
    "click",
    function () {

        if (!selectedProject) {

            return;

        }


        projectContextMenu.style.display =
            "none";


        showProjectConfirmation(
            "edit"
        );

    }
);


/* =========================
   DELETE MENU BUTTON
========================= */

deleteProjectContext.addEventListener(
    "click",
    function () {

        if (!selectedProject) {

            return;

        }


        projectContextMenu.style.display =
            "none";


        showProjectConfirmation(
            "delete"
        );

    }
);


/* =========================
   START PROJECT EDIT
========================= */

function startProjectEdit() {

    if (
        !selectedProject ||
        selectedProjectIndex === null
    ) {

        return;

    }


    projectEditMode =
        true;


    /* =========================
       FILL EXISTING FORM
    ========================= */

    projectName.value =
        selectedProject.projectName;


    pastBA.value =
        selectedProject.pastBA || "";


    presentBA.value =
        selectedProject.presentBA || "";


    salesPerson.value =
        selectedProject.salesPerson || "";


    projectType.value =
        selectedProject.projectType || "";


    totalUser.value =
        selectedProject.totalUser || "";


    businessType.value =
        selectedProject.businessType || "";


    webPortalUrl.value =
        selectedProject.webPortalUrl || "";


    /* =========================
       FORM TITLE
    ========================= */

    const projectFormTitle =
        document.querySelector(
            ".project-modal-header h2"
        );


    if (projectFormTitle) {

        projectFormTitle.textContent =
            "Edit Project";

    }


    /* =========================
       SAVE BUTTON
    ========================= */

    const projectSaveButton =
        addProjectForm.querySelector(
            'button[type="submit"]'
        );


    if (projectSaveButton) {

        projectSaveButton.textContent =
            "Update Project";

    }


    /* =========================
       OPEN MODAL
    ========================= */

    projectModal.style.display =
        "flex";

}


/* =========================
   CONFIRM BUTTON
========================= */

projectConfirmOk.addEventListener(
    "click",
    function () {

        if (
            projectPendingAction ===
            "edit"
        ) {

            projectConfirmModal.style.display =
                "none";

            projectPendingAction =
                null;


            startProjectEdit();

            return;

        }


        if (
            projectPendingAction ===
            "delete"
        ) {

            projectConfirmModal.style.display =
                "none";

            projectPendingAction =
                null;


            deleteSelectedProject();

        }

    }
);


/* =========================
   DELETE PROJECT
========================= */

function deleteSelectedProject() {

    if (
        selectedProjectIndex === null
    ) {

        return;

    }


    const deletedProject =
    projects[selectedProjectIndex];

projects.splice(
    selectedProjectIndex,
    1
);

saveProjects();

syncProjectWithGoogleSheet(
    "deleteProject",
    deletedProject
);


    selectedProject =
        null;

    selectedProjectIndex =
        null;


    /*
     * Existing search/filter
     * ko preserve karte hue
     * table refresh.
     */

    filterProjects();

}


/* =========================
   CANCEL CONFIRMATION
========================= */

projectConfirmCancel.addEventListener(
    "click",
    function () {

        projectPendingAction =
            null;

        projectConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CLOSE ON BACKDROP
========================= */

projectConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            projectConfirmModal
        ) {

            projectPendingAction =
                null;

            projectConfirmModal.style.display =
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
            !projectContextMenu.contains(
                event.target
            )
        ) {

            projectContextMenu.style.display =
                "none";

        }

    }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            projectContextMenu.style.display =
                "none";

            projectConfirmModal.style.display =
                "none";

            projectPendingAction =
                null;

        }

    }
);


/* =========================
   EDIT SUBMIT INTERCEPT
========================= */

addProjectForm.addEventListener(
    "submit",
    function (event) {

        if (!projectEditMode) {

            return;

        }


        /*
         * Existing ADD PROJECT handler
         * ko edit mode mein run nahi hone denge.
         */

        event.preventDefault();

        event.stopImmediatePropagation();


        if (
            selectedProjectIndex === null
        ) {

            return;

        }


        const project =
            projects[
                selectedProjectIndex
            ];


        if (!project) {

            return;

        }


        const oldProjectName =
            project.projectName;


        /* =========================
           UPDATE SAME PROJECT
        ========================= */

        project.projectName =
            projectName.value.trim();


        project.pastBA =
            pastBA.value.trim();


        project.presentBA =
            presentBA.value.trim();


        project.salesPerson =
            salesPerson.value.trim();


        project.projectType =
            projectType.value;


        project.totalUser =
            totalUser.value;


        project.businessType =
            businessType.value.trim();


        project.webPortalUrl =
            webPortalUrl.value.trim();


        /* =========================
           SAVE
        ========================= */

        saveProjects();

        syncProjectWithGoogleSheet(
            "updateProject",
            project,
            {
                oldProjectName: oldProjectName
            }
        );


        /* =========================
           EXIT EDIT MODE
        ========================= */

        projectEditMode =
            false;


        selectedProject =
            null;

        selectedProjectIndex =
            null;


        /* =========================
           CLOSE MODAL
        ========================= */

        projectModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        addProjectForm.reset();


        /* =========================
           RESTORE FORM TITLE
        ========================= */

        const projectFormTitle =
            document.querySelector(
                ".project-modal-header h2"
            );


        if (projectFormTitle) {

            projectFormTitle.textContent =
                "Add New Project";

        }


        /* =========================
           RESTORE BUTTON
        ========================= */

        const projectSaveButton =
            addProjectForm.querySelector(
                'button[type="submit"]'
            );


        if (projectSaveButton) {

            projectSaveButton.textContent =
                "Save Project";

        }


        /* =========================
           REFRESH TABLE
        ========================= */

        filterProjects();


        /* =========================
           SUCCESS POPUP
        ========================= */

        projectSuccessPopup.style.display =
            "flex";

    },
    true
);


/* =========================
   RESET EDIT MODE
========================= */

function resetProjectEditMode() {

    projectEditMode =
        false;

    selectedProject =
        null;

    selectedProjectIndex =
        null;


    const projectFormTitle =
        document.querySelector(
            ".project-modal-header h2"
        );


    if (projectFormTitle) {

        projectFormTitle.textContent =
            "Add New Project";

    }


    const projectSaveButton =
        addProjectForm.querySelector(
            'button[type="submit"]'
        );


    if (projectSaveButton) {

        projectSaveButton.textContent =
            "Save Project";

    }

}


/* =========================
   CANCEL EDIT
========================= */

cancelProjectForm.addEventListener(
    "click",
    function () {

        resetProjectEditMode();

    }
);


/* =========================
   CLOSE EDIT
========================= */

closeProjectForm.addEventListener(
    "click",
    function () {

        resetProjectEditMode();

    }
);


function loadProjectsFromGoogleSheet() {

    fetch(GOOGLE_SHEET_API)
        .then(parseGoogleSheetResponse)
        .then(data => {

            if (!data.success || !Array.isArray(data.projects)) {
                console.error("Google Sheet projects load failed.");
                return;
            }

            const sheetProjects = data.projects;

            sheetProjects.forEach(function (sheetProject) {

                const alreadyExists = projects.some(function (localProject) {

                    return (
                        String(localProject.projectName).trim().toLowerCase() ===
                        String(sheetProject.projectName).trim().toLowerCase()
                    );

                });

                if (!alreadyExists && sheetProject.projectName) {

                    sheetProject.projectSource =
                        "myProject";

                    projects.unshift(
                        sheetProject
                    );
                }

            });

            saveProjects();

            showProjects(projects);

        })
        .catch(error => {

            console.error(
                "Google Sheet Project Load Error:",
                error
            );

        });

}

/*
 * Apps Script abhi projects read/load action return nahi kar raha.
 * Jab backend mein valid read action add ho, tab is function ko call karna.
 */
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