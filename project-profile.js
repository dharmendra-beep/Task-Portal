/* =========================
   PROJECT PROFILE
========================= */

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";


/* =========================
   ELEMENTS
========================= */

const editProfileButton =
    document.getElementById("editProjectProfileButton");

const profileCompanyName =
    document.getElementById("profileCompanyName");

const profileProjectName =
    document.getElementById("profileProjectName");

const profileContactPerson =
    document.getElementById("profileContactPerson");

const profileProjectType =
    document.getElementById("profileProjectType");

const saveProfileButton =
    document.getElementById("saveProjectProfile");

const cancelProfileButton =
    document.getElementById("cancelProjectProfileEdit");

const profileSaveActions =
    document.getElementById("projectProfileSaveActions");

const projectStatusBadge =
    document.getElementById("projectStatusBadge");

const addCommentButton =
    document.getElementById("addCommentButton");

const commentModal =
    document.getElementById("commentModal");

const closeCommentForm =
    document.getElementById("closeCommentForm");

const cancelCommentForm =
    document.getElementById("cancelCommentForm");

const addCommentForm =
    document.getElementById("addCommentForm");

const pendencyType =
    document.getElementById("pendencyType");

const commentOf =
    pendencyType;

const commentText =
    document.getElementById("commentText");

const commentStatus =
    document.getElementById("commentStatus");

const commentsTableBody =
    document.getElementById("commentsTableBody");


/* =========================
   PENDENCY STATUS OPTIONS
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
   GET PROJECT
========================= */

const urlParams =
    new URLSearchParams(window.location.search);

const projectNameFromUrl =
    urlParams.get("project");


/* =========================
   LOAD PROJECTS
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


/* =========================
   FIND CURRENT PROJECT
========================= */

let currentProject =
    projects.find(function (project) {

        return (
            project.projectName ===
            projectNameFromUrl
        );

    });


function saveProjects() {

    localStorage.setItem(
        "crmProjects",
        JSON.stringify(projects)
    );

}


function ensureCurrentProjectSheetId() {

    if (!currentProject) {
        return;
    }

    if (!currentProject.sheetRecordId) {

        currentProject.sheetRecordId =
            createSheetRecordId("MYPROJECT");

        saveProjects();

    }

}


/* =========================
   DATE / TIME
========================= */

function getCurrentDate() {

    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(now.getMonth() + 1).padStart(2, "0");

    const day =
        String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


function getCurrentTime() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;

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


function createGoogleSheetCommentRow(project, comment, action) {

    const status =
        action === "deleteComment"
            ? "Deleted"
            : comment.status || project.projectStatus || "Assigned";

    return [
        project.projectName || "",
        comment.date || "",
        comment.time || "",
        comment.pendencyType || comment.commentOf || "",
        comment.commentText || "",
        status
    ];

}


function syncProjectProfileWithGoogleSheet(
    action,
    project,
    extraData = {}
) {

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
        console.log(
            "Google Sheet Project Profile:",
            data
        );
        return data;
    })
    .catch(function (error) {
        console.error(
            "Google Sheet Project Profile Sync Error:",
            error
        );
        return null;
    });

}


/* =========================
   LOAD PROFILE DATA
========================= */

function loadProfile() {

    if (!currentProject) {
        return;
    }

    ensureCurrentProjectSheetId();


    profileCompanyName.value =
        currentProject.companyName || "";

    profileProjectName.value =
        currentProject.profileProjectName ||
        currentProject.projectName ||
        "";

    profileContactPerson.value =
        currentProject.contactPerson || "";

    profileProjectType.value =
        currentProject.profileProjectType ||
        currentProject.projectType ||
        "";

    updateProjectStatus(
        currentProject.projectStatus ||
        "Assigned"
    );

}


/* =========================
   STATUS OPTIONS
========================= */

function updateStatusOptions() {

    if (!pendencyType || !commentStatus) {
        return;
    }

    const statuses =
        PENDENCY_STATUS_MAP[pendencyType.value] || [];

    commentStatus.innerHTML =
        "";

    const defaultOption =
        document.createElement("option");

    defaultOption.value =
        "";

    defaultOption.textContent =
        "Select Status";

    commentStatus.appendChild(
        defaultOption
    );

    statuses.forEach(function (status) {

        const option =
            document.createElement("option");

        option.value =
            status;

        option.textContent =
            status;

        commentStatus.appendChild(
            option
        );

    });

}


function getStatusClass(status) {

    if (
        status === "Assigned" ||
        status === "Assign"
    ) {

        return "assigned";

    }

    if (
        status === "Development Completed" ||
        status === "Testing Completed" ||
        status === "Final Demo Completed" ||
        status === "Final Demo" ||
        status === "Live"
    ) {

        return "closed";

    }

    return "in-process";

}


function updateProjectStatus(status) {

    if (!projectStatusBadge) {
        return;
    }

    projectStatusBadge.textContent =
        status || "Assigned";

    projectStatusBadge.className =
        "project-status-badge " +
        getStatusClass(status || "Assigned");

}


if (pendencyType) {

    pendencyType.addEventListener(
        "change",
        updateStatusOptions
    );

}


/* =========================
   COMMENTS
========================= */

function getProjectComments() {

    if (!currentProject) {
        return [];
    }

    if (!Array.isArray(currentProject.comments)) {
        currentProject.comments = [];
    }

    return currentProject.comments;

}


function showComments() {

    commentsTableBody.innerHTML = "";

    const comments =
        getProjectComments();

    comments.forEach(function (comment, index) {

        const row =
            document.createElement("tr");

        const serialCell =
            document.createElement("td");

        serialCell.textContent =
            index + 1;

        const dateCell =
            document.createElement("td");

        dateCell.textContent =
            comment.date;

        const timeCell =
            document.createElement("td");

        timeCell.textContent =
            comment.time;

        const commentOfCell =
            document.createElement("td");

        commentOfCell.textContent =
            comment.commentOf;

        const commentCell =
            document.createElement("td");

        commentCell.textContent =
            comment.commentText;

        row.appendChild(serialCell);
        row.appendChild(dateCell);
        row.appendChild(timeCell);
        row.appendChild(commentOfCell);
        row.appendChild(commentCell);

        commentsTableBody.appendChild(row);

    });

}


/* =========================
   EDIT MODE
========================= */

function enableEditMode() {

    profileCompanyName.disabled = false;

    profileProjectName.disabled = false;

    profileContactPerson.disabled = false;

    profileProjectType.disabled = false;

    profileSaveActions.style.display =
        "flex";

    profileCompanyName.focus();

}


/* =========================
   CANCEL EDIT
========================= */

function cancelEditMode() {

    loadProfile();

    profileCompanyName.disabled = true;

    profileProjectName.disabled = true;

    profileContactPerson.disabled = true;

    profileProjectType.disabled = true;

    profileSaveActions.style.display =
        "none";

}


/* =========================
   SAVE PROFILE
========================= */

function saveProfile() {

    if (!currentProject) {
        return;
    }


    const newProjectName =
        profileProjectName.value.trim();


    if (!newProjectName) {

        alert(
            "Project Name cannot be empty."
        );

        return;

    }


    const oldProjectName =
        currentProject.projectName;


    /* =========================
       UPDATE PROFILE DATA
    ========================= */

    currentProject.companyName =
        profileCompanyName.value.trim();

    currentProject.profileProjectName =
        newProjectName;

    currentProject.contactPerson =
        profileContactPerson.value.trim();

    currentProject.profileProjectType =
        profileProjectType.value.trim();


    /*
     * Project Name bhi update hoga.
     */

    currentProject.projectName =
        newProjectName;


    /* =========================
       SAVE TO LOCAL STORAGE
    ========================= */

    localStorage.setItem(
        "crmProjects",
        JSON.stringify(projects)
    );


    syncProjectProfileWithGoogleSheet(
        "updateProject",
        currentProject,
        {
            oldProjectName: oldProjectName
        }
    );


    /* =========================
       UPDATE URL
    ========================= */

    const newUrl =
        "project-profile.HTML?project=" +
        encodeURIComponent(
            newProjectName
        );

    window.history.replaceState(
        {},
        "",
        newUrl
    );


    /* =========================
       LOCK FIELDS
    ========================= */

    profileCompanyName.disabled = true;

    profileProjectName.disabled = true;

    profileContactPerson.disabled = true;

    profileProjectType.disabled = true;

    profileSaveActions.style.display =
        "none";


    currentProject =
        projects.find(function (project) {

            return (
                project.projectName ===
                newProjectName
            );

        });


    /*
     * Agar project name change hua hai,
     * to My Project table mein bhi
     * updated name automatically show hoga
     * kyunki same localStorage data use ho raha hai.
     */

}


/* =========================
   EDIT BUTTON
========================= */

editProfileButton.addEventListener(
    "click",
    function () {

        enableEditMode();

    }
);


/* =========================
   SAVE BUTTON
========================= */

saveProfileButton.addEventListener(
    "click",
    function () {

        saveProfile();

    }
);


/* =========================
   CANCEL BUTTON
========================= */

cancelProfileButton.addEventListener(
    "click",
    function () {

        cancelEditMode();

    }
);


/* =========================
   ADD COMMENT
========================= */

addCommentButton.addEventListener(
    "click",
    function () {

        addCommentForm.reset();

        updateStatusOptions();

        commentModal.style.display =
            "flex";

        commentOf.focus();

    }
);


closeCommentForm.addEventListener(
    "click",
    function () {

        commentModal.style.display =
            "none";

    }
);


cancelCommentForm.addEventListener(
    "click",
    function () {

        commentModal.style.display =
            "none";

    }
);


addCommentForm.addEventListener(
    "submit",
    function (event) {

        if (commentEditMode) {

            return;

        }


        event.preventDefault();

        if (!currentProject) {
            return;
        }

        const pendencyTypeValue =
            pendencyType.value.trim();

        const commentTextValue =
            commentText.value.trim();

        const commentStatusValue =
            commentStatus.value;

        if (!pendencyTypeValue) {
            alert("Please select Pendency Type.");
            pendencyType.focus();
            return;
        }

        if (!commentTextValue) {
            alert("Please enter Comment.");
            commentText.focus();
            return;
        }

        if (!commentStatusValue) {
            alert("Please select Status.");
            commentStatus.focus();
            return;
        }

        const comments =
            getProjectComments();

        comments.unshift({
            date: getCurrentDate(),
            time: getCurrentTime(),
            commentOf: pendencyTypeValue,
            pendencyType: pendencyTypeValue,
            commentText: commentTextValue,
            status: commentStatusValue
        });

        currentProject.projectStatus =
            commentStatusValue;

        saveProjects();

        syncProjectCommentWithGoogleSheet(
            "addComment",
            currentProject,
            comments[comments.length - 1]
        );

        updateProjectStatus(
            commentStatusValue
        );

        commentModal.style.display =
            "none";

        addCommentForm.reset();

        showFilteredComments(
            currentCommentSearch
        );

    }
);


/* =========================
   INITIAL LOAD
========================= */

loadProfile();

updateStatusOptions();

showComments();


/* ========================================
   COMMENT SEARCH + EDIT + DELETE
======================================== */


/* =========================
   SEARCH ELEMENTS
========================= */

const commentSearchInput =
    document.getElementById(
        "commentSearchInput"
    );

const clearCommentSearch =
    document.getElementById(
        "clearCommentSearch"
    );


/* =========================
   CONTEXT MENU ELEMENTS
========================= */

const commentContextMenu =
    document.getElementById(
        "commentContextMenu"
    );

const editCommentContext =
    document.getElementById(
        "editCommentContext"
    );

const deleteCommentContext =
    document.getElementById(
        "deleteCommentContext"
    );


/* =========================
   CONFIRMATION ELEMENTS
========================= */

const commentConfirmModal =
    document.getElementById(
        "commentConfirmModal"
    );

const commentConfirmIcon =
    document.getElementById(
        "commentConfirmIcon"
    );

const commentConfirmTitle =
    document.getElementById(
        "commentConfirmTitle"
    );

const commentConfirmMessage =
    document.getElementById(
        "commentConfirmMessage"
    );

const commentConfirmCancel =
    document.getElementById(
        "commentConfirmCancel"
    );

const commentConfirmOk =
    document.getElementById(
        "commentConfirmOk"
    );


/* =========================
   SELECTED COMMENT
========================= */

let selectedComment =
    null;

let selectedCommentIndex =
    null;


/* =========================
   EDIT MODE
========================= */

let commentEditMode =
    false;


/* =========================
   PENDING ACTION
========================= */

let commentPendingAction =
    null;


/* =========================
   SEARCH TEXT
========================= */

let currentCommentSearch =
    "";


/* =========================
   SHOW FILTERED COMMENTS
========================= */

function showFilteredComments(
    searchText = ""
) {

    commentsTableBody.innerHTML =
        "";

    const comments =
        getProjectComments();


    const searchValue =
        searchText
            .trim()
            .toLowerCase();


    const filteredComments =
        comments.filter(
            function (comment) {

                if (!searchValue) {

                    return true;

                }


                const date =
                    String(
                        comment.date || ""
                    ).toLowerCase();


                const time =
                    String(
                        comment.time || ""
                    ).toLowerCase();


                const commentOfValue =
                    String(
                        comment.pendencyType ||
                        comment.commentOf ||
                        ""
                    ).toLowerCase();


                const commentTextValue =
                    String(
                        comment.commentText || ""
                    ).toLowerCase();


                const statusValue =
                    String(
                        comment.status || ""
                    ).toLowerCase();


                return (
                    date.includes(
                        searchValue
                    ) ||
                    time.includes(
                        searchValue
                    ) ||
                    commentOfValue.includes(
                        searchValue
                    ) ||
                    commentTextValue.includes(
                        searchValue
                    ) ||
                    statusValue.includes(
                        searchValue
                    )
                );

            }
        );


    filteredComments.forEach(
        function (comment) {

            const originalIndex =
                comments.indexOf(
                    comment
                );


            const row =
                document.createElement(
                    "tr"
                );


            /*
             * Original array index
             * row ke andar save kar rahe hain.
             */

            row.dataset.commentIndex =
                originalIndex;


            /* =========================
               S.NO
            ========================= */

            const serialCell =
                document.createElement(
                    "td"
                );

            serialCell.textContent =
                filteredComments.indexOf(
                    comment
                ) + 1;


            /* =========================
               DATE
            ========================= */

            const dateCell =
                document.createElement(
                    "td"
                );

            dateCell.textContent =
                comment.date || "";


            /* =========================
               TIME
            ========================= */

            const timeCell =
                document.createElement(
                    "td"
                );

            timeCell.textContent =
                comment.time || "";


            /* =========================
               PENDENCY TYPE
            ========================= */

            const pendencyCell =
                document.createElement(
                    "td"
                );

            pendencyCell.textContent =
                comment.pendencyType ||
                comment.commentOf ||
                "";


            /* =========================
               COMMENT
            ========================= */

            const commentCell =
                document.createElement(
                    "td"
                );

            commentCell.textContent =
                comment.commentText || "";


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

            const status =
                comment.status || "";

            statusBadge.className =
                "project-status-badge " +
                getStatusClass(status);

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


/* =========================
   LIVE SEARCH
========================= */

commentSearchInput.addEventListener(
    "input",
    function () {

        currentCommentSearch =
            this.value;

        showFilteredComments(
            currentCommentSearch
        );

    }
);


/* =========================
   CLEAR SEARCH
========================= */

clearCommentSearch.addEventListener(
    "click",
    function () {

        commentSearchInput.value =
            "";

        currentCommentSearch =
            "";

        showFilteredComments();

        commentSearchInput.focus();

    }
);


/* =========================
   RIGHT CLICK COMMENT ROW
========================= */

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


        const originalIndex =
            Number(
                row.dataset.commentIndex
            );


        if (
            Number.isNaN(
                originalIndex
            )
        ) {

            return;

        }


        const comments =
            getProjectComments();


        const foundComment =
            comments[
                originalIndex
            ];


        if (!foundComment) {

            return;

        }


        selectedComment =
            foundComment;


        selectedCommentIndex =
            originalIndex;


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


        commentContextMenu.style.left =
            left + "px";

        commentContextMenu.style.top =
            top + "px";


        commentContextMenu.style.display =
            "block";

    }
);


/* =========================
   SHOW CONFIRMATION
========================= */

function showCommentConfirmation(
    action
) {

    commentPendingAction =
        action;


    if (
        action === "edit"
    ) {

        commentConfirmIcon.textContent =
            "✏️";

        commentConfirmTitle.textContent =
            "Confirm Edit";

        commentConfirmMessage.textContent =
            "Are you sure you want to edit this comment?";

        commentConfirmOk.textContent =
            "Edit";

    }


    if (
        action === "delete"
    ) {

        commentConfirmIcon.textContent =
            "🗑️";

        commentConfirmTitle.textContent =
            "Confirm Delete";

        commentConfirmMessage.textContent =
            "Are you sure you want to delete this comment?";

        commentConfirmOk.textContent =
            "Delete";

    }


    commentConfirmModal.style.display =
        "flex";

}


/* =========================
   EDIT MENU
========================= */

editCommentContext.addEventListener(
    "click",
    function () {

        if (!selectedComment) {

            return;

        }


        commentContextMenu.style.display =
            "none";


        showCommentConfirmation(
            "edit"
        );

    }
);


/* =========================
   DELETE MENU
========================= */

deleteCommentContext.addEventListener(
    "click",
    function () {

        if (!selectedComment) {

            return;

        }


        commentContextMenu.style.display =
            "none";


        showCommentConfirmation(
            "delete"
        );

    }
);


/* =========================
   START COMMENT EDIT
========================= */

function startCommentEdit() {

    if (
        !selectedComment ||
        selectedCommentIndex === null
    ) {

        return;

    }


    commentEditMode =
        true;


    /* =========================
       FILL EXISTING FORM
    ========================= */

    pendencyType.value =
        selectedComment.pendencyType ||
        selectedComment.commentOf ||
        "";

    updateStatusOptions();


    commentText.value =
        selectedComment.commentText || "";


    commentStatus.value =
        selectedComment.status || "";


    /* =========================
       FORM TITLE
    ========================= */

    const commentFormTitle =
        document.querySelector(
            ".comment-modal-header h2"
        );


    if (commentFormTitle) {

        commentFormTitle.textContent =
            "Edit Comment";

    }


    /* =========================
       BUTTON
    ========================= */

    const commentSaveButton =
        addCommentForm.querySelector(
            'button[type="submit"]'
        );


    if (commentSaveButton) {

        commentSaveButton.textContent =
            "Update Comment";

    }


    /* =========================
       OPEN FORM
    ========================= */

    commentModal.style.display =
        "flex";


    pendencyType.focus();

}


/* =========================
   CONFIRM ACTION
========================= */

commentConfirmOk.addEventListener(
    "click",
    function () {

        if (
            commentPendingAction ===
            "edit"
        ) {

            commentConfirmModal.style.display =
                "none";

            commentPendingAction =
                null;

            startCommentEdit();

            return;

        }


        if (
            commentPendingAction ===
            "delete"
        ) {

            commentConfirmModal.style.display =
                "none";

            commentPendingAction =
                null;

            deleteSelectedComment();

        }

    }
);


/* =========================
   DELETE COMMENT
========================= */

function deleteSelectedComment() {

    if (
        selectedCommentIndex === null
    ) {

        return;

    }


    const comments =
        getProjectComments();


    if (
        !comments[
            selectedCommentIndex
        ]
    ) {

        return;

    }


    const deletedComment =
        comments[
            selectedCommentIndex
        ];




    comments.splice(
        selectedCommentIndex,
        1
    );


    saveProjects();


    syncProjectCommentWithGoogleSheet(
        "deleteComment",
        currentProject,
        deletedComment,
        {
            commentIndex: selectedCommentIndex
        }
    );


    selectedComment =
        null;

    selectedCommentIndex =
        null;


    /*
     * Current search ko preserve
     * karte hue table refresh.
     */

    showFilteredComments(
        currentCommentSearch
    );

}


/* =========================
   CANCEL CONFIRMATION
========================= */

commentConfirmCancel.addEventListener(
    "click",
    function () {

        commentPendingAction =
            null;

        commentConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CLOSE CONFIRMATION
========================= */

commentConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            commentConfirmModal
        ) {

            commentPendingAction =
                null;

            commentConfirmModal.style.display =
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
            !commentContextMenu.contains(
                event.target
            )
        ) {

            commentContextMenu.style.display =
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
            event.key ===
            "Escape"
        ) {

            commentContextMenu.style.display =
                "none";

            commentConfirmModal.style.display =
                "none";

            commentPendingAction =
                null;

        }

    }
);


/* =========================
   EDIT SUBMIT INTERCEPT
========================= */

addCommentForm.addEventListener(
    "submit",
    function (event) {

        /*
         * Normal Add Comment mode mein
         * existing code ko bilkul touch
         * nahi karna hai.
         */

        if (!commentEditMode) {

            return;

        }


        event.preventDefault();

        event.stopImmediatePropagation();


        if (
            selectedCommentIndex === null
        ) {

            return;

        }


        const comments =
            getProjectComments();


        const comment =
            comments[
                selectedCommentIndex
            ];


        if (!comment) {

            return;

        }


    


        /* =========================
           UPDATE SAME COMMENT
        ========================= */

        comment.commentOf =
            pendencyType.value.trim();


        comment.pendencyType =
            pendencyType.value.trim();


        comment.commentText =
            commentText.value.trim();


        comment.status =
            commentStatus.value;


        currentProject.projectStatus =
            commentStatus.value;


        /*
         * Date aur Time ko change
         * nahi kar rahe.
         */

        /* =========================
           SAVE
        ========================= */

        saveProjects();


        syncProjectCommentWithGoogleSheet(
            "updateComment",
            currentProject,
            comment,
            {
                commentIndex: selectedCommentIndex
            }
        );


        updateProjectStatus(
            commentStatus.value
        );


        /* =========================
           RESET EDIT MODE
        ========================= */

        commentEditMode =
            false;


        selectedComment =
            null;

        selectedCommentIndex =
            null;


        /* =========================
           CLOSE MODAL
        ========================= */

        commentModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        addCommentForm.reset();


        /* =========================
           RESTORE TITLE
        ========================= */

        const commentFormTitle =
            document.querySelector(
                ".comment-modal-header h2"
            );


        if (commentFormTitle) {

            commentFormTitle.textContent =
                "Add Comment";

        }


        /* =========================
           RESTORE BUTTON
        ========================= */

        const commentSaveButton =
            addCommentForm.querySelector(
                'button[type="submit"]'
            );


        if (commentSaveButton) {

            commentSaveButton.textContent =
                "Save Comment";

        }


        /* =========================
           REFRESH TABLE
        ========================= */

        showFilteredComments(
            currentCommentSearch
        );

    },
    true
);


/* =========================
   RESET EDIT MODE
========================= */

function resetCommentEditMode() {

    commentEditMode =
        false;

    selectedComment =
        null;

    selectedCommentIndex =
        null;


    const commentFormTitle =
        document.querySelector(
            ".comment-modal-header h2"
        );


    if (commentFormTitle) {

        commentFormTitle.textContent =
            "Add Comment";

    }


    const commentSaveButton =
        addCommentForm.querySelector(
            'button[type="submit"]'
        );


    if (commentSaveButton) {

        commentSaveButton.textContent =
            "Save Comment";

    }


    updateStatusOptions();

}


/* =========================
   RESET ON CANCEL
========================= */

cancelCommentForm.addEventListener(
    "click",
    function () {

        resetCommentEditMode();

    }
);


/* =========================
   RESET ON CLOSE
========================= */

closeCommentForm.addEventListener(
    "click",
    function () {

        resetCommentEditMode();

    }
);


/* =========================
   INITIAL SEARCH RENDER
========================= */

showFilteredComments();


function syncProjectCommentWithGoogleSheet(
    action,
    project,
    comment,
    extraData = {}
) {
    if (!GOOGLE_SHEET_API || !project || !comment) {
        return Promise.resolve(null);
    }

    const googleSheetAction =
        getGoogleSheetAction(action);

    const sheetRow =
        createGoogleSheetCommentRow(
            project,
            comment,
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
                    recordType: "comment",
                    project: project,
                    comment: comment,
                    sheetRow: sheetRow
                },
                extraData
            )
        )
    })
    .then(parseGoogleSheetResponse)
    .then(function (data) {
        console.log(
            "Google Sheet Comment:",
            data
        );
        return data;
    })
    .catch(function (error) {
        console.error(
            "Google Sheet Comment Sync Error:",
            error
        );
        return null;
    });
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
