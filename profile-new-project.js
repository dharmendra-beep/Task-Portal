/* =========================
   PROJECT PROFILE
========================= */


const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";


const editCompanyNameButton = document.getElementById("editCompanyNameButton");
const editProjectTypeButton = document.getElementById("editProjectTypeButton");

const profileCompanyName = document.getElementById("profileCompanyName");
const profileProjectName = document.getElementById("profileProjectName");
const profileContactPerson = document.getElementById("profileContactPerson");
const profileProjectType = document.getElementById("profileProjectType");

const saveCompanyNameButton = document.getElementById("saveCompanyName");
const cancelCompanyEdit = document.getElementById("cancelCompanyEdit");
const companySaveActions = document.getElementById("companySaveActions");

const projectStatusBadge = document.getElementById("projectStatusBadge");

const profileAssignDate = document.getElementById("profileAssignDate");
const profileEstimationDate = document.getElementById("profileEstimationDate");
const profileEstimationTime = document.getElementById("profileEstimationTime");

const addCommentButton = document.getElementById("addCommentButton");
const commentModal = document.getElementById("commentModal");

const closeCommentForm = document.getElementById("closeCommentForm");
const cancelCommentForm = document.getElementById("cancelCommentForm");

const addCommentForm = document.getElementById("addCommentForm");

const pendencyType = document.getElementById("pendencyType");
const commentText = document.getElementById("commentText");
const commentStatus = document.getElementById("commentStatus");

const commentsTableBody =
    document.getElementById("commentsTableBody");

    /* =========================
   PENDENCY → STATUS RELATION
========================= */

const PENDENCY_STATUS_MAP = {

    "B.A Pendency": [
        "Demo Pending",
        "Kick of Call Pending"
    ],

    "Client Side Pendency": [
        "Client side pending",
        "Account Approvel Pending",
        "Approvel Pending"
    ],

    "Development Pendency": [
        "Task Assign pending",
        "Assign to devloper",
        "Development Pending"
    ],

    "In Review": [
        "In review"
    ],

    "Testing Pendency": [
        "Testing Assign Pending",
        "Testing Pending"
    ],

    "New Changes": [
        "Task Assign pending",
        "Assign to devloper",
        "Development Pending"
    ],

    "Complited": [
    "Kick of Call Done",
    "Internal Meeting Done",
    "Assigned to Developer",
    "Development Completed",
    "Testing Completed",
    "First Demo Completed",
    "Final Demo Completed",
    "Account Approval",
    "Live"
]

};


/* =========================
   UPDATE STATUS OPTIONS
========================= */

function updateStatusOptions() {

    if (!pendencyType || !commentStatus) {
        return;
    }

    const selectedPendency =
        pendencyType.value;

    const statuses =
        PENDENCY_STATUS_MAP[selectedPendency] || [];

    commentStatus.innerHTML = "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent =
        "Select Status";

    commentStatus.appendChild(
        defaultOption
    );

    statuses.forEach(function (status) {

        const option =
            document.createElement("option");

        option.value = status;
        option.textContent = status;

        commentStatus.appendChild(option);

    });
}


/* =========================
   PENDENCY CHANGE
========================= */

if (pendencyType) {

    pendencyType.addEventListener(
        "change",
        function () {

            updateStatusOptions();

        }
    );

}

const profileSuccessPopup =
    document.getElementById("profileSuccessPopup");

const profileSuccessClose =
    document.getElementById("profileSuccessClose");


/* =========================
   URL
========================= */

const urlParams =
    new URLSearchParams(
        window.location.search
    );


const projectIdFromUrl =
    urlParams.get("projectId");


/* =========================
   PROJECT DATA
========================= */

let projects = [];

let currentProject = null;

let editingProjectType = false;


/* =========================
   LOAD PROJECTS
========================= */

function loadProjects() {

    let savedProjects =
        localStorage.getItem(
            "crmNewProjects"
        );

    const shouldFilterLegacyProjects =
        !savedProjects;

    if (!savedProjects) {

        savedProjects =
            localStorage.getItem(
                "crmProjects"
            );

    }


    if (!savedProjects) {

        projects = [];

        return;

    }


    try {

        const parsedProjects =
            JSON.parse(
                savedProjects
            );


        projects =
            Array.isArray(parsedProjects)
                ? parsedProjects
                : [];

        if (shouldFilterLegacyProjects) {

            projects =
                projects.filter(
                    isNewProjectRecord
                );

        }


    } catch (error) {

        projects = [];

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


/* =========================
   FIND CURRENT PROJECT
========================= */

function findCurrentProject() {

    currentProject =
        projects.find(
            function (project) {

                return (
                    String(
                        project.projectId
                    ) ===
                    String(
                        projectIdFromUrl
                    )
                );

            }
        ) || null;

}


/* =========================
   CHECK PROJECT
========================= */

function checkProject() {

    if (currentProject) {

        return true;

    }


    alert(
        "Project not found."
    );


    window.location.href =
        "./new-project.html";


    return false;

}


/* =========================
   GET COMMENTS
========================= */

function ensureProjectCommentIds() {

    if (!currentProject || !Array.isArray(currentProject.comments)) {
        return;
    }

    let modified = false;

    currentProject.comments.forEach(function (comment, index) {
        if (comment.sNo === undefined || comment.sNo === null || comment.sNo === "") {
            comment.sNo = index + 1;
            modified = true;
        }
    });

    if (modified) {
        saveProjects();
    }

}


function getProjectComments() {

    if (!currentProject) {

        return [];

    }


    if (
        !Array.isArray(
            currentProject.comments
        )
    ) {

        currentProject.comments =
            [];

    }

    ensureProjectCommentIds();

    return currentProject.comments;

}


/* =========================
   LOAD PROFILE
========================= */

function loadProfile() {

    if (!currentProject) {

        return;

    }


    /* =========================
       COMPANY NAME
    ========================= */

    const companyName =
        currentProject.companyName ||
        "";


    if (profileCompanyName) {

        if (
            "value" in
            profileCompanyName
        ) {

            profileCompanyName.value =
                companyName;

        } else {

            profileCompanyName.textContent =
                companyName ||
                "-";

        }

    }


    /* =========================
       PROJECT NAME
    ========================= */

    if (profileProjectName) {

        profileProjectName.textContent =
            currentProject.projectName ||
            "-";

    }


    /* =========================
       CONTACT PERSON
    ========================= */

    if (profileContactPerson) {

        profileContactPerson.textContent =
            currentProject.contactPerson ||
            "-";

    }


    /* =========================
       PROJECT TYPE
    ========================= */

    if (profileProjectType) {

        profileProjectType.textContent =
            currentProject.projectType ||
            currentProject.profileProjectType ||
            "-";

    }


    /* =========================
       STATUS
    ========================= */

    updateProjectStatus(
        currentProject.projectStatus ||
        "Assigned"
    );


    /* =========================
       ASSIGN DATE
    ========================= */

    if (profileAssignDate) {

        profileAssignDate.textContent =
            currentProject.assignDate ||
            "-";

    }


    /* =========================
       ESTIMATION DATE
    ========================= */

    if (profileEstimationDate) {

        profileEstimationDate.textContent =
            currentProject.estimationDate ||
            "-";

    }


    /* =========================
       ESTIMATION TIME
    ========================= */

    if (profileEstimationTime) {

        profileEstimationTime.textContent =
            currentProject.estimationTime ||
            "-";

    }

}


/* =========================
   STATUS CLASS
========================= */

function getStatusClass(status) {

    if (
        status === "Assigned" ||
        status === "Assign"
    ) {

        return "assigned";

    }


    if (
        status === "Kick-off Call Done" ||
        status === "Internal Meeting Done" ||
        status === "Assign to Developer" ||
        status === "First Demo" ||
        status === "New Changes" ||
        status === "Account Approval"
    ) {

        return "in-process";

    }


    if (
        status === "Development Completed" ||
        status === "Testing Completed" ||
        status === "Final Demo" ||
        status === "Live"
    ) {

        return "closed";

    }


    return "assigned";

}


/* =========================
   UPDATE STATUS
========================= */

function updateProjectStatus(status) {

    if (!projectStatusBadge) {

        return;

    }


    projectStatusBadge.textContent =
        status ||
        "Assigned";


    projectStatusBadge.className =
        "project-status-badge " +
        getStatusClass(
            status ||
            "Assigned"
        );

}


/* =========================
   SHOW COMMENTS
========================= */

function showComments() {

    if (!commentsTableBody) {

        return;

    }


    commentsTableBody.innerHTML =
        "";


    const comments =
        getProjectComments();


    comments.forEach(
        function (comment, index) {

            const row =
                document.createElement(
                    "tr"
                );


            /* =========================
               S.NO
            ========================= */

            const serialCell =
                document.createElement(
                    "td"
                );


            serialCell.textContent =
                index + 1;


            /* =========================
               DATE
            ========================= */

            const dateCell =
                document.createElement(
                    "td"
                );


            dateCell.textContent =
                comment.date ||
                "";


            /* =========================
               TIME
            ========================= */

            const timeCell =
                document.createElement(
                    "td"
                );


            timeCell.textContent =
                comment.time ||
                "";


            /* =========================
               PENDENCY TYPE
            ========================= */

            const pendencyCell =
                document.createElement(
                    "td"
                );


            pendencyCell.textContent =
                comment.pendencyType ||
                "";


            /* =========================
               COMMENT
            ========================= */

            const commentCell =
                document.createElement(
                    "td"
                );


            commentCell.textContent =
                comment.commentText ||
                "";


            /* =========================
               STATUS
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
                comment.status ||
                "Assign";



            statusBadge.className =
                "project-status-badge " +
                getStatusClass(
                    status
                );


            statusBadge.textContent =
                status;


            statusCell.appendChild(
                statusBadge
            );


            /* =========================
               ADD CELLS
            ========================= */

            row.appendChild(
                serialCell
            );

            row.appendChild(
                dateCell
            );

            row.appendChild(
                timeCell
            );

            row.appendChild(
                pendencyCell
            );

            row.appendChild(
                commentCell
            );

            row.appendChild(
                statusCell
            );


            commentsTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================
   SAVE LOCAL STORAGE
========================= */

function saveProjects() {

    localStorage.setItem(
        "crmNewProjects",
        JSON.stringify(
            projects
        )
    );

}


/* =========================
   SUCCESS POPUP
========================= */

function showSuccessPopup() {

    if (profileSuccessPopup) {

        profileSuccessPopup.style.display =
            "flex";

    }

}


/* =========================
   COMPANY EDIT
========================= */

function enableCompanyEdit() {

    if (
        !profileCompanyName ||
        !companySaveActions
    ) {

        return;

    }


    /*
       Agar Company Name input hai
    */

    if (
        "value" in
        profileCompanyName
    ) {

        profileCompanyName.disabled =
            false;


        companySaveActions.style.display =
            "flex";


        profileCompanyName.focus();


        return;

    }


    /*
       Agar Company Name normal
       div hai to temporary input
       create hoga
    */

    const oldValue =
        currentProject.companyName ||
        "";


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.id =
        "profileCompanyNameEdit";


    input.className =
        "project-profile-input";


    input.value =
        oldValue;


    input.style.width =
        "100%";


    input.style.boxSizing =
        "border-box";


    profileCompanyName.innerHTML =
        "";


    profileCompanyName.appendChild(
        input
    );


    companySaveActions.style.display =
        "flex";


    input.focus();

}


/* =========================
   GET COMPANY VALUE
========================= */

function getCompanyEditValue() {

    if (!profileCompanyName) {

        return "";

    }


    if (
        "value" in
        profileCompanyName
    ) {

        return (
            profileCompanyName.value ||
            ""
        ).trim();

    }


    const input =
        document.getElementById(
            "profileCompanyNameEdit"
        );


    if (input) {

        return input.value.trim();

    }


    return (
        profileCompanyName.textContent ||
        ""
    ).trim();

}


/* =========================
   RESTORE COMPANY
========================= */

function restoreCompanyDisplay() {

    if (
        !profileCompanyName ||
        !currentProject
    ) {

        return;

    }


    const value =
        currentProject.companyName ||
        "";


    if (
        "value" in
        profileCompanyName
    ) {

        profileCompanyName.value =
            value;


        profileCompanyName.disabled =
            true;

    } else {

        profileCompanyName.textContent =
            value ||
            "-";

    }


    if (companySaveActions) {

        companySaveActions.style.display =
            "none";

    }

}


/* =========================
   CANCEL COMPANY EDIT
========================= */

function cancelCompanyEditMode() {

    restoreCompanyDisplay();

}


/* =========================
   SAVE COMPANY
========================= */

function saveCompanyName() {

    if (!currentProject) {

        return;

    }


    const value =
        getCompanyEditValue();


    if (!value) {

        alert(
            "Please enter Company Name."
        );

        return;

    }


    currentProject.companyName =
        value;


    saveProjects();


    restoreCompanyDisplay();


    showSuccessPopup();

}


/* =========================
   PROJECT TYPE EDIT
========================= */

function enableProjectTypeEdit() {

    if (
        !profileProjectType ||
        editingProjectType ||
        !currentProject
    ) {

        return;

    }


    editingProjectType =
        true;


    const currentValue =
        currentProject.projectType ||
        currentProject.profileProjectType ||
        "";


    profileProjectType.innerHTML =
        "";


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.id =
        "profileProjectTypeInput";


    input.className =
        "project-profile-input";


    input.value =
        currentValue;


    input.placeholder =
        "Enter Type of Project";


    const actions =
        document.createElement(
            "div"
        );


    actions.id =
        "projectTypeSaveActions";


    actions.className =
        "project-profile-save-actions";


    actions.style.marginTop =
        "10px";


    const cancelButton =
        document.createElement(
            "button"
        );


    cancelButton.type =
        "button";


    cancelButton.className =
        "project-profile-cancel-button";


    cancelButton.textContent =
        "Cancel";


    const saveButton =
        document.createElement(
            "button"
        );


    saveButton.type =
        "button";


    saveButton.className =
        "project-profile-save-button";


    saveButton.textContent =
        "Save";


    actions.appendChild(
        cancelButton
    );


    actions.appendChild(
        saveButton
    );


    profileProjectType.appendChild(
        input
    );


    if (
        profileProjectType.parentElement
    ) {

        profileProjectType.parentElement.appendChild(
            actions
        );

    }


    cancelButton.addEventListener(
        "click",
        cancelProjectTypeEdit
    );


    saveButton.addEventListener(
        "click",
        saveProjectType
    );


    input.focus();

}


/* =========================
   SAVE PROJECT TYPE
========================= */

function saveProjectType() {

    if (!currentProject) {

        return;

    }


    const input =
        document.getElementById(
            "profileProjectTypeInput"
        );


    if (!input) {

        return;

    }


    const value =
        input.value.trim();


    if (!value) {

        alert(
            "Please enter Type of Project."
        );

        input.focus();

        return;

    }


    currentProject.projectType =
        value;


    currentProject.profileProjectType =
        value;


    saveProjects();


    editingProjectType =
        false;


    profileProjectType.innerHTML =
        "";


    profileProjectType.textContent =
        value;


    const actions =
        document.getElementById(
            "projectTypeSaveActions"
        );


    if (actions) {

        actions.remove();

    }


    showSuccessPopup();

}


/* =========================
   CANCEL PROJECT TYPE
========================= */

function cancelProjectTypeEdit() {

    if (
        !currentProject ||
        !profileProjectType
    ) {

        return;

    }


    editingProjectType =
        false;


    profileProjectType.innerHTML =
        "";


    profileProjectType.textContent =
        currentProject.projectType ||
        currentProject.profileProjectType ||
        "-";


    const actions =
        document.getElementById(
            "projectTypeSaveActions"
        );


    if (actions) {

        actions.remove();

    }

}


/* =========================
   COMPANY BUTTON
========================= */

if (editCompanyNameButton) {

    editCompanyNameButton.addEventListener(
        "click",
        enableCompanyEdit
    );

}


/* =========================
   SAVE COMPANY BUTTON
========================= */

if (saveCompanyNameButton) {

    saveCompanyNameButton.addEventListener(
        "click",
        saveCompanyName
    );

}


/* =========================
   CANCEL COMPANY BUTTON
========================= */

if (cancelCompanyEdit) {

    cancelCompanyEdit.addEventListener(
        "click",
        cancelCompanyEditMode
    );

}


/* =========================
   PROJECT TYPE BUTTON
========================= */

if (editProjectTypeButton) {

    editProjectTypeButton.addEventListener(
        "click",
        enableProjectTypeEdit
    );

}


/* =========================
   OPEN COMMENT FORM
========================= */

if (addCommentButton) {

    addCommentButton.addEventListener(
        "click",
        function () {

            if (addCommentForm) {

                addCommentForm.reset();

            }


            if (commentModal) {

                commentModal.style.display =
                    "flex";

            }


            if (pendencyType) {

                pendencyType.focus();

            }

        }
    );

}


/* =========================
   RESET COMMENT EDIT MODE
========================= */

function resetCommentEditMode() {

    commentEditMode =
        false;

    editingCommentIndex =
        null;

    const modalTitle =
        document.querySelector(
            ".comment-modal-header h2"
        );

    if (modalTitle) {

        modalTitle.textContent =
            "Add Comment";

    }

    const saveButton =
        addCommentForm
            ? addCommentForm.querySelector(
                'button[type="submit"]'
            )
            : null;

    if (saveButton) {

        saveButton.textContent =
            "Save Comment";

    }

    if (addCommentForm) {

        addCommentForm.reset();

    }

    updateStatusOptions();

}


/* =========================
   CLOSE COMMENT FORM
========================= */

if (closeCommentForm) {

    closeCommentForm.addEventListener(
        "click",
        function () {

            resetCommentEditMode();

            if (commentModal) {

                commentModal.style.display =
                    "none";

            }

        }
    );

}


/* =========================
   CANCEL COMMENT FORM
========================= */

if (cancelCommentForm) {

    cancelCommentForm.addEventListener(
        "click",
        function () {

            resetCommentEditMode();

            if (commentModal) {

                commentModal.style.display =
                    "none";

            }

        }
    );

}


/* =========================
   GOOGLE SHEET SYNC HELPERS
========================= */

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

                    success:
                        response.ok,

                    message:
                        text

                };

            }

        });

}


function syncNewProjectCommentWithGoogleSheet(action, project, comment) {

    if (!GOOGLE_SHEET_API || !project || !comment) {

        return Promise.resolve(null);

    }

    const payload = {

        action:
            action,

        project: {

            projectName:
                (
                    project.projectName ||
                    project.profileProjectName ||
                    ""
                ).trim(),

            projectId:
                project.projectId ||
                ""

        },

        comment: {

            sNo:
                comment.sNo !== undefined &&
                comment.sNo !== null
                    ? comment.sNo
                    : "",

            date:
                comment.date || "",

            time:
                comment.time || "",

            pendencyType:
                comment.pendencyType || "",

            commentText:
                comment.commentText || "",

            status:
                comment.status || ""

        }

    };

    return fetch(GOOGLE_SHEET_API, {

        method: "POST",

        headers: {

            "Content-Type":
                "text/plain;charset=utf-8"

        },

        body: JSON.stringify(payload)

    })
    .then(parseGoogleSheetResponse)
    .then(function (data) {

        console.log(
            "Google Sheet New Project Comment (" + action + "):",
            data
        );

        return data;

    })
    .catch(function (error) {

        console.error(
            "Google Sheet New Project Comment Sync Error (" + action + "):",
            error
        );

        return null;

    });

}


/* =========================
   SAVE COMMENT
========================= */

if (addCommentForm) {

    addCommentForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =========================
               CURRENT PROJECT
            ========================= */

            if (!currentProject) {

                alert(
                    "Project not found."
                );

                return;

            }


            /* =========================
               GET VALUES
            ========================= */

            const pendencyTypeValue =
                pendencyType
                    ? pendencyType.value.trim()
                    : "";


            const commentTextValue =
                commentText
                    ? commentText.value.trim()
                    : "";


            let commentStatusValue =
                commentStatus
                    ? commentStatus.value
                    : "";


            /* =========================
               VALIDATION
            ========================= */

            if (!pendencyTypeValue) {

                alert(
                    "Please select Pendency Type."
                );

                if (pendencyType) {

                    pendencyType.focus();

                }

                return;

            }


            if (!commentTextValue) {

                alert(
                    "Please enter Comment."
                );

                if (commentText) {

                    commentText.focus();

                }

                return;

            }


            if (!commentStatusValue) {

                alert(
                    "Please select Status."
                );

                if (commentStatus) {

                    commentStatus.focus();

                }

                return;

            }

            const comments =
                getProjectComments();


            /* =========================
               EDIT COMMENT MODE
            ========================= */

            if (
                commentEditMode &&
                editingCommentIndex !== null
            ) {

                const existingComment =
                    comments[
                        editingCommentIndex
                    ];

                if (!existingComment) {

                    alert(
                        "Comment not found for editing."
                    );

                    return;

                }

                if (
                    existingComment.sNo === undefined ||
                    existingComment.sNo === null ||
                    existingComment.sNo === ""
                ) {

                    existingComment.sNo =
                        editingCommentIndex + 1;

                }

                existingComment.pendencyType =
                    pendencyTypeValue;

                existingComment.commentText =
                    commentTextValue;

                existingComment.status =
                    commentStatusValue;

                currentProject.projectStatus =
                    commentStatusValue;

                const projectIndex =
                    projects.findIndex(
                        function (project) {

                            return (
                                String(
                                    project.projectId
                                ) ===
                                String(
                                    currentProject.projectId
                                )
                            );

                        }
                    );

                if (projectIndex !== -1) {

                    projects[
                        projectIndex
                    ] =
                        currentProject;

                }

                saveProjects();

                syncNewProjectCommentWithGoogleSheet(
                    "updateNewProjectComment",
                    currentProject,
                    existingComment
                );

                updateProjectStatus(
                    commentStatusValue
                );

                if (
                    typeof populateNewProfileFilterMenus ===
                    "function"
                ) {

                    populateNewProfileFilterMenus();

                }

                if (
                    typeof renderNewProfileFilteredComments ===
                    "function"
                ) {

                    renderNewProfileFilteredComments();

                } else {

                    showComments();

                }

                if (commentModal) {

                    commentModal.style.display =
                        "none";

                }

                resetCommentEditMode();

                showSuccessPopup();

                return;

            }


            /* =========================
               ADD NEW COMMENT MODE
            ========================= */

            const now =
                new Date();


            const date =
                now.getFullYear() +
                "-" +
                String(
                    now.getMonth() + 1
                ).padStart(
                    2,
                    "0"
                ) +
                "-" +
                String(
                    now.getDate()
                ).padStart(
                    2,
                    "0"
                );


            const time =
                String(
                    now.getHours()
                ).padStart(
                    2,
                    "0"
                ) +
                ":" +
                String(
                    now.getMinutes()
                ).padStart(
                    2,
                    "0"
                );


            const nextSNo =
                comments.reduce(
                    function (max, c) {

                        const num =
                            Number(c.sNo);

                        return (
                            !isNaN(num) &&
                            num > max
                        )
                            ? num
                            : max;

                    },
                    0
                ) + 1;


            const newComment = {

                sNo:
                    nextSNo,

                date:
                    date,

                time:
                    time,

                pendencyType:
                    pendencyTypeValue,

                commentText:
                    commentTextValue,

                status:
                    commentStatusValue

            };


            currentProject.comments.unshift(
                newComment
            );


            currentProject.projectStatus =
                commentStatusValue;


            const projectIndex =
                projects.findIndex(
                    function (project) {

                        return (
                            String(
                                project.projectId
                            ) ===
                            String(
                                currentProject.projectId
                            )
                        );

                    }
                );


            if (
                projectIndex !== -1
            ) {

                projects[
                    projectIndex
                ] =
                    currentProject;

            }


            saveProjects();


            syncNewProjectCommentWithGoogleSheet(
                "addNewProjectComment",
                currentProject,
                newComment
            );


            updateProjectStatus(
                commentStatusValue
            );


            if (
                typeof populateNewProfileFilterMenus ===
                "function"
            ) {

                populateNewProfileFilterMenus();

            }

            if (
                typeof renderNewProfileFilteredComments ===
                "function"
            ) {

                renderNewProfileFilteredComments();

            } else {

                showComments();

            }


            if (commentModal) {

                commentModal.style.display =
                    "none";

            }


            resetCommentEditMode();


            showSuccessPopup();

        }
    );

}


/* =========================
   SUCCESS CLOSE
========================= */

if (profileSuccessClose) {

    profileSuccessClose.addEventListener(
        "click",
        function () {

            if (profileSuccessPopup) {

                profileSuccessPopup.style.display =
                    "none";

            }

        }
    );

}


/* =========================
   INITIAL LOAD
========================= */

loadProjects();

findCurrentProject();


if (checkProject()) {

    loadProfile();

    showComments();

}
/* =========================================================
   NEW PROJECT PROFILE
   SEARCH + CLEAR + FILTER
   ROADMAP FILTER CONNECTION
   RIGHT CLICK EDIT / DELETE
========================================================= */


/* =========================================================
   FILTER ELEMENTS
========================================================= */

const newProfileSearchInput =
    document.getElementById(
        "commentsSearchInput"
    );

const newProfileClearSearch =
    document.getElementById(
        "clearCommentsSearch"
    );

const newProfilePendencyButton =
    document.getElementById(
        "pendencyTypeFilterButton"
    );

const newProfileStatusButton =
    document.getElementById(
        "commentStatusFilterButton"
    );

const newProfilePendencyMenu =
    document.getElementById(
        "pendencyTypeFilterMenu"
    );

const newProfileStatusMenu =
    document.getElementById(
        "commentStatusFilterMenu"
    );


/* =========================================================
   FILTER VALUES
========================================================= */

let newProfilePendencyFilter = "";

let newProfileStatusFilter = "";

let newProfileSearchValue = "";


/* =========================================================
   ROADMAP URL FILTER
========================================================= */

const roadmapStatusFilter =
    urlParams.get("status");

const roadmapPendencyKey =
    urlParams.get("pendency");

const roadmapPendencyType =
    urlParams.get("pendencyType");


/* =========================================================
   PENDENCY GROUPS
========================================================= */

const ROADMAP_PENDENCY_GROUPS = {

    ba: [
        /* New canonical pendency type */
        "B.A Pendency",

        /* Existing / legacy values kept for compatibility */
        "Kick-off Call Pending",
        "Kick Off Call Pending",
        "Demo Pending",
        "BA Pendency"
    ],

    development: [
        /* New canonical pendency type */
        "Development Pendency",

        /* Existing / legacy values kept for compatibility */
        "Task Assignment Pending",
        "Task Assigning Pending",
        "Development Pending"
    ],

    client: [
        /* New canonical pendency type */
        "Client Side Pendency",

        /* Existing / legacy values kept for compatibility */
        "Client Side Pending",
        "Account Approval Pending"
    ],

    review: [
        /* New canonical pendency type */
        "In Review",

        /* Existing / legacy values kept for compatibility */
        "Review Pending"
    ],

    testing: [
        /* New canonical pendency type */
        "Testing Pendency",

        /* Existing / legacy value kept for compatibility */
        "Testing Pending"
    ]

};


/* =========================================================
   GET PENDENCY GROUP
========================================================= */

function getRoadmapPendencyGroup(
    comment
) {

    const type =
        String(
            comment.pendencyType ||
            ""
        ).trim();

    const status =
        String(
            comment.status ||
            ""
        ).trim();


    /*
       New Pendency Type is the primary connection.

       This prevents a new value such as
       "Development Pendency" from being incorrectly
       grouped by an unrelated status.
    */
    for (
        const group in
        ROADMAP_PENDENCY_GROUPS
    ) {

        const values =
            ROADMAP_PENDENCY_GROUPS[
                group
            ];


        if (
            (
                type ===
                "B.A Pendency" ||
                type ===
                "Development Pendency" ||
                type ===
                "Client Side Pendency" ||
                type ===
                "In Review" ||
                type ===
                "Testing Pendency"
            ) &&
            values.includes(type)
        ) {

            return group;

        }

    }


    /*
       Legacy compatibility:
       keep the previous status / old pendency matching.
    */
    for (
        const group in
        ROADMAP_PENDENCY_GROUPS
    ) {

        const values =
            ROADMAP_PENDENCY_GROUPS[
                group
            ];


        if (
            values.includes(type) ||
            values.includes(status)
        ) {

            return group;

        }

    }


    return "";

}


/* =========================================================
   MATCH ROADMAP PENDENCY
========================================================= */

function matchesRoadmapPendency(
    comment
) {

    if (!roadmapPendencyKey) {

        return true;

    }


    return (
        getRoadmapPendencyGroup(
            comment
        ) ===
        roadmapPendencyKey
    );

}


/* =========================================================
   MATCH ROADMAP STATUS
========================================================= */

function matchesRoadmapStatus(
    comment
) {

    if (!roadmapStatusFilter) {

        return true;

    }


    const allowedStatuses =
        roadmapStatusFilter
            .split("|")
            .map(function (value) {

                return value.trim();

            })
            .filter(Boolean);


    return allowedStatuses.includes(
        String(
            comment.status ||
            ""
        ).trim()
    );

}


/* =========================================================
   MATCH ROADMAP PENDENCY TYPE
========================================================= */

function matchesRoadmapPendencyType(
    comment
) {

    if (!roadmapPendencyType) {

        return true;

    }


    const group =
        getRoadmapPendencyGroup(
            comment
        );


    if (
        group ===
        roadmapPendencyType
    ) {

        return true;

    }


    return (
        String(
            comment.pendencyType ||
            ""
        ).trim() ===
        roadmapPendencyType
    );

}


/* =========================================================
   FILTER OPTIONS
========================================================= */

function populateNewProfileFilterMenus() {

    if (!currentProject) {

        return;

    }


    const comments =
        getProjectComments();


    /* =====================================================
       PENDENCY OPTIONS
    ===================================================== */

    /*
       Pendency Type filter now contains only the
       five roadmap pendency categories.

       This is intentionally fixed so the old
       legacy pendency values cannot reappear in
       the filter menu.
    */
    const pendencyValues = [
        "B.A Pendency",
        "Development Pendency",
        "Client Side Pendency",
        "In Review",
        "Testing Pendency"
    ];


    newProfilePendencyMenu.innerHTML =
        "";


    const allPendency =
        document.createElement(
            "button"
        );


    allPendency.type =
        "button";

    allPendency.className =
        "comment-filter-option";

    allPendency.textContent =
        "All";

    allPendency.dataset.filterType =
        "pendency";

    allPendency.dataset.filterValue =
        "";


    newProfilePendencyMenu.appendChild(
        allPendency
    );


    pendencyValues.forEach(
        function (value) {

            const option =
                document.createElement(
                    "button"
                );


            option.type =
                "button";

            option.className =
                "comment-filter-option";

            option.textContent =
                value;

            option.dataset.filterType =
                "pendency";

            option.dataset.filterValue =
                value;


            newProfilePendencyMenu.appendChild(
                option
            );

        }
    );


    /* =====================================================
       STATUS OPTIONS
    ===================================================== */

    const statusValues = [];


    comments.forEach(
        function (comment) {

            const value =
                String(
                    comment.status ||
                    ""
                ).trim();


            if (
                value &&
                !statusValues.includes(
                    value
                )
            ) {

                statusValues.unshift(
                    value
                );

            }

        }
    );


    newProfileStatusMenu.innerHTML =
        "";


    const allStatus =
        document.createElement(
            "button"
        );


    allStatus.type =
        "button";

    allStatus.className =
        "comment-filter-option";

    allStatus.textContent =
        "All";

    allStatus.dataset.filterType =
        "status";

    allStatus.dataset.filterValue =
        "";


    newProfileStatusMenu.appendChild(
        allStatus
    );


    statusValues.forEach(
        function (value) {

            const option =
                document.createElement(
                    "button"
                );


            option.type =
                "button";

            option.className =
                "comment-filter-option";

            option.textContent =
                value;

            option.dataset.filterType =
                "status";

            option.dataset.filterValue =
                value;


            newProfileStatusMenu.appendChild(
                option
            );

        }
    );


    updateNewProfileFilterActiveState();

}


/* =========================================================
   ACTIVE FILTER
========================================================= */

function updateNewProfileFilterActiveState() {

    document
        .querySelectorAll(
            ".comment-filter-option"
        )
        .forEach(
            function (option) {

                const type =
                    option.dataset.filterType;

                const value =
                    option.dataset.filterValue;


                option.classList.remove(
                    "active"
                );


                if (
                    type ===
                    "pendency" &&
                    value ===
                    newProfilePendencyFilter
                ) {

                    option.classList.add(
                        "active"
                    );

                }


                if (
                    type ===
                    "status" &&
                    value ===
                    newProfileStatusFilter
                ) {

                    option.classList.add(
                        "active"
                    );

                }

            }
        );

}


/* =========================================================
   GET FILTERED COMMENTS
========================================================= */

function getNewProfileFilteredComments() {

    const comments =
        getProjectComments();


    const search =
        newProfileSearchValue
            .trim()
            .toLowerCase();


    return comments.filter(
        function (comment) {

            const date =
                String(
                    comment.date ||
                    ""
                ).toLowerCase();


            const time =
                String(
                    comment.time ||
                    ""
                ).toLowerCase();


            const pendency =
                String(
                    comment.pendencyType ||
                    ""
                ).toLowerCase();


            const commentText =
                String(
                    comment.commentText ||
                    ""
                ).toLowerCase();


            const status =
                String(
                    comment.status ||
                    ""
                ).toLowerCase();


            const searchMatch =
                !search ||
                date.includes(search) ||
                time.includes(search) ||
                pendency.includes(search) ||
                commentText.includes(search) ||
                status.includes(search);


            const pendencyMatch =
                !newProfilePendencyFilter ||
                pendency ===
                newProfilePendencyFilter
                    .toLowerCase();


            const statusMatch =
                !newProfileStatusFilter ||
                status ===
                newProfileStatusFilter
                    .toLowerCase();


            const roadmapPendencyMatch =
                matchesRoadmapPendency(
                    comment
                );


            const roadmapStatusMatch =
                matchesRoadmapStatus(
                    comment
                );


            const roadmapTypeMatch =
                matchesRoadmapPendencyType(
                    comment
                );


            return (
                searchMatch &&
                pendencyMatch &&
                statusMatch &&
                roadmapPendencyMatch &&
                roadmapStatusMatch &&
                roadmapTypeMatch
            );

        }
    );

}


/* =========================================================
   RENDER FILTERED COMMENTS
========================================================= */

function renderNewProfileFilteredComments() {

    if (!commentsTableBody) {

        return;

    }


    commentsTableBody.innerHTML =
        "";


    const comments =
        getProjectComments();


    const filteredComments =
        getNewProfileFilteredComments();


    filteredComments.forEach(
        function (
            comment,
            filteredIndex
        ) {

            const originalIndex =
                comments.indexOf(
                    comment
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.dataset.commentIndex =
                originalIndex;


            /* =================================================
               S.NO
            ================================================= */

            const serialCell =
                document.createElement(
                    "td"
                );


            serialCell.textContent =
                filteredIndex + 1;


            /* =================================================
               DATE
            ================================================= */

            const dateCell =
                document.createElement(
                    "td"
                );


            dateCell.textContent =
                comment.date ||
                "";


            /* =================================================
               TIME
            ================================================= */

            const timeCell =
                document.createElement(
                    "td"
                );


            timeCell.textContent =
                comment.time ||
                "";


            /* =================================================
               PENDENCY
            ================================================= */

            const pendencyCell =
                document.createElement(
                    "td"
                );


            pendencyCell.textContent =
                comment.pendencyType ||
                "";


            /* =================================================
               COMMENT
            ================================================= */

            const commentCell =
                document.createElement(
                    "td"
                );


            commentCell.textContent =
                comment.commentText ||
                "";


            /* =================================================
               STATUS
            ================================================= */

            const statusCell =
                document.createElement(
                    "td"
                );


            const statusBadge =
                document.createElement(
                    "span"
                );


            const status =
                comment.status ||
                "Assigned";


            statusBadge.className =
                "project-status-badge " +
                getStatusClass(
                    status
                );


            statusBadge.textContent =
                status;


            statusCell.appendChild(
                statusBadge
            );


            row.appendChild(
                serialCell
            );

            row.appendChild(
                dateCell
            );

            row.appendChild(
                timeCell
            );

            row.appendChild(
                pendencyCell
            );

            row.appendChild(
                commentCell
            );

            row.appendChild(
                statusCell
            );


            commentsTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================================================
   SEARCH
========================================================= */

if (newProfileSearchInput) {

    newProfileSearchInput.addEventListener(
        "input",
        function () {

            newProfileSearchValue =
                this.value;


            renderNewProfileFilteredComments();

        }
    );

}


/* =========================================================
   CLEAR
========================================================= */

if (newProfileClearSearch) {

    newProfileClearSearch.addEventListener(
        "click",
        function () {

            if (
                newProfileSearchInput
            ) {

                newProfileSearchInput.value =
                    "";

            }


            newProfileSearchValue =
                "";

            newProfilePendencyFilter =
                "";

            newProfileStatusFilter =
                "";


            updateNewProfileFilterActiveState();

            renderNewProfileFilteredComments();

        }
    );

}


/* =========================================================
   PENDENCY FILTER BUTTON
========================================================= */

if (newProfilePendencyButton) {

    newProfilePendencyButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const isOpen =
                newProfilePendencyMenu.style.display ===
                "block";


            newProfileStatusMenu.style.display =
                "none";


            newProfilePendencyMenu.style.display =
                isOpen
                    ? "none"
                    : "block";

        }
    );

}


/* =========================================================
   STATUS FILTER BUTTON
========================================================= */

if (newProfileStatusButton) {

    newProfileStatusButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            const isOpen =
                newProfileStatusMenu.style.display ===
                "block";


            newProfilePendencyMenu.style.display =
                "none";


            newProfileStatusMenu.style.display =
                isOpen
                    ? "none"
                    : "block";

        }
    );

}


/* =========================================================
   FILTER OPTION CLICK
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        const option =
            event.target.closest(
                ".comment-filter-option"
            );


        if (!option) {

            return;

        }


        const type =
            option.dataset.filterType;


        const value =
            option.dataset.filterValue ||
            "";


        if (
            type ===
            "pendency"
        ) {

            newProfilePendencyFilter =
                value;


            newProfilePendencyMenu.style.display =
                "none";

        }


        if (
            type ===
            "status"
        ) {

            newProfileStatusFilter =
                value;


            newProfileStatusMenu.style.display =
                "none";

        }


        updateNewProfileFilterActiveState();

        renderNewProfileFilteredComments();

    }
);


/* =========================================================
   CLOSE FILTER MENUS
========================================================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !event.target.closest(
                ".comment-filter-header"
            )
        ) {

            if (
                newProfilePendencyMenu
            ) {

                newProfilePendencyMenu.style.display =
                    "none";

            }


            if (
                newProfileStatusMenu
            ) {

                newProfileStatusMenu.style.display =
                    "none";

            }

        }

    }
);


/* =========================================================
   RIGHT CLICK
========================================================= */

let newProfileSelectedCommentIndex =
    null;

let newProfileConfirmAction =
    null;

let commentEditMode =
    false;

let editingCommentIndex =
    null;


const newProfileContextMenu =
    document.getElementById(
        "newProjectProfileContextMenu"
    );


const newProfileEditButton =
    document.getElementById(
        "editNewProjectProfileContext"
    );


const newProfileDeleteButton =
    document.getElementById(
        "deleteNewProjectProfileContext"
    );


const newProfileConfirmModal =
    document.getElementById(
        "newProjectProfileConfirmModal"
    );


const newProfileConfirmTitle =
    document.getElementById(
        "newProjectProfileConfirmTitle"
    );


const newProfileConfirmMessage =
    document.getElementById(
        "newProjectProfileConfirmMessage"
    );


const newProfileConfirmCancel =
    document.getElementById(
        "newProjectProfileConfirmCancel"
    );


const newProfileConfirmOk =
    document.getElementById(
        "newProjectProfileConfirmOk"
    );


/* =========================================================
   ROW RIGHT CLICK
========================================================= */

if (commentsTableBody) {

    commentsTableBody.addEventListener(
        "contextmenu",
        function (event) {

            const row =
                event.target.closest(
                    "tr"
                );


            if (!row) {

                return;

            }


            event.preventDefault();


            const index =
                Number(
                    row.dataset.commentIndex
                );


            if (
                Number.isNaN(index)
            ) {

                return;

            }


            newProfileSelectedCommentIndex =
                index;


            if (
                newProfileContextMenu
            ) {

                newProfileContextMenu.style.display =
                    "block";


                newProfileContextMenu.style.left =
                    event.clientX + "px";


                newProfileContextMenu.style.top =
                    event.clientY + "px";

            }

        }
    );

}


/* =========================================================
   CLOSE CONTEXT MENU
========================================================= */

document.addEventListener(
    "click",
    function () {

        if (
            newProfileContextMenu
        ) {

            newProfileContextMenu.style.display =
                "none";

        }

    }
);


/* =========================================================
   CONFIRMATION
========================================================= */

function openNewProfileConfirmation(
    action
) {

    newProfileConfirmAction =
        action;


    if (
        newProfileConfirmModal
    ) {

        newProfileConfirmModal.style.display =
            "flex";

    }


    if (
        action ===
        "edit"
    ) {

        if (
            newProfileConfirmTitle
        ) {

            newProfileConfirmTitle.textContent =
                "Edit Comment";

        }


        if (
            newProfileConfirmMessage
        ) {

            newProfileConfirmMessage.textContent =
                "Are you sure you want to edit this comment?";

        }

    }


    if (
        action ===
        "delete"
    ) {

        if (
            newProfileConfirmTitle
        ) {

            newProfileConfirmTitle.textContent =
                "Delete Comment";

        }


        if (
            newProfileConfirmMessage
        ) {

            newProfileConfirmMessage.textContent =
                "Are you sure you want to delete this comment?";

        }

    }

}


/* =========================================================
   EDIT BUTTON
========================================================= */

if (newProfileEditButton) {

    newProfileEditButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (
                newProfileContextMenu
            ) {

                newProfileContextMenu.style.display =
                    "none";

            }


            if (
                newProfileSelectedCommentIndex ===
                null
            ) {

                return;

            }


            openNewProfileConfirmation(
                "edit"
            );

        }
    );

}


/* =========================================================
   DELETE BUTTON
========================================================= */

if (newProfileDeleteButton) {

    newProfileDeleteButton.addEventListener(
        "click",
        function (event) {

            event.stopPropagation();


            if (
                newProfileContextMenu
            ) {

                newProfileContextMenu.style.display =
                    "none";

            }


            if (
                newProfileSelectedCommentIndex ===
                null
            ) {

                return;

            }


            openNewProfileConfirmation(
                "delete"
            );

        }
    );

}


/* =========================================================
   CANCEL CONFIRMATION
========================================================= */

if (newProfileConfirmCancel) {

    newProfileConfirmCancel.addEventListener(
        "click",
        function () {

            if (
                newProfileConfirmModal
            ) {

                newProfileConfirmModal.style.display =
                    "none";

            }


            newProfileConfirmAction =
                null;

        }
    );

}


/* =========================================================
   CONFIRM ACTION
========================================================= */

if (newProfileConfirmOk) {

    newProfileConfirmOk.addEventListener(
        "click",
        function () {

            if (
                newProfileConfirmAction ===
                "edit"
            ) {

                openNewProfileCommentEdit();

            }


            if (
                newProfileConfirmAction ===
                "delete"
            ) {

                deleteNewProfileComment();

            }


            if (
                newProfileConfirmModal
            ) {

                newProfileConfirmModal.style.display =
                    "none";

            }


            newProfileConfirmAction =
                null;

        }
    );

}


/* =========================================================
   OPEN COMMENT EDIT
========================================================= */

function openNewProfileCommentEdit() {

    const comments =
        getProjectComments();


    const comment =
        comments[
            newProfileSelectedCommentIndex
        ];


    if (!comment) {

        return;

    }


    commentEditMode =
        true;


    editingCommentIndex =
        newProfileSelectedCommentIndex;


    const modalTitle =
        document.querySelector(
            ".comment-modal-header h2"
        );

    if (modalTitle) {

        modalTitle.textContent =
            "Edit Comment";

    }


    const saveButton =
        addCommentForm
            ? addCommentForm.querySelector(
                'button[type="submit"]'
            )
            : null;

    if (saveButton) {

        saveButton.textContent =
            "Update Comment";

    }


    if (pendencyType) {

        pendencyType.value =
            comment.pendencyType ||
            "";

    }


    /* =========================
       UPDATE STATUS OPTIONS
       ACCORDING TO PENDENCY
    ========================= */

    updateStatusOptions();


    if (commentText) {

        commentText.value =
            comment.commentText ||
            "";

    }


    if (commentStatus) {

        commentStatus.value =
            comment.status ||
            "";

    }


    if (commentModal) {

        commentModal.style.display =
            "flex";

    }


    if (pendencyType) {

        pendencyType.focus();

    }

}


/* =========================================================
   DELETE COMMENT
========================================================= */

function deleteNewProfileComment() {

    const comments =
        getProjectComments();


    if (
        newProfileSelectedCommentIndex ===
        null
    ) {

        return;

    }


    const commentToDelete =
        comments[
            newProfileSelectedCommentIndex
        ];

    if (
        !commentToDelete
    ) {

        return;

    }


    const sNoToDelete =
        commentToDelete.sNo !== undefined &&
        commentToDelete.sNo !== null &&
        commentToDelete.sNo !== ""
            ? commentToDelete.sNo
            : (newProfileSelectedCommentIndex + 1);

    const dateToDelete =
        commentToDelete.date || "";

    const timeToDelete =
        commentToDelete.time || "";

    const pendencyToDelete =
        commentToDelete.pendencyType || "";

    const commentTextToDelete =
        commentToDelete.commentText || "";

    const statusToDelete =
        commentToDelete.status || "";


    comments.splice(
        newProfileSelectedCommentIndex,
        1
    );


    currentProject.comments =
        comments;


    const projectIndex =
        projects.findIndex(
            function (project) {

                return (
                    String(
                        project.projectId
                    ) ===
                    String(
                        currentProject.projectId
                    )
                );

            }
        );


    if (
        projectIndex !==
        -1
    ) {

        projects[
            projectIndex
        ] =
            currentProject;

    }


    saveProjects();


    syncNewProjectCommentWithGoogleSheet(
        "deleteNewProjectComment",
        currentProject,
        {
            sNo: sNoToDelete,
            date: dateToDelete,
            time: timeToDelete,
            pendencyType: pendencyToDelete,
            commentText: commentTextToDelete,
            status: statusToDelete
        }
    );


    newProfileSelectedCommentIndex =
        null;


    populateNewProfileFilterMenus();

    renderNewProfileFilteredComments();

    showSuccessPopup();

}


/* =========================================================
   INITIALISE
========================================================= */

populateNewProfileFilterMenus();


/* =========================================================
   READ ROADMAP FILTER FROM URL
========================================================= */

if (
    roadmapStatusFilter ||
    roadmapPendencyKey ||
    roadmapPendencyType
) {

    renderNewProfileFilteredComments();

} else {

    renderNewProfileFilteredComments();

}

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
