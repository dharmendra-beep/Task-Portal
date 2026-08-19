/* =========================
   PROJECT PROFILE
========================= */

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

    const savedProjects =
        localStorage.getItem(
            "crmProjects"
        );


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


    } catch (error) {

        projects = [];

    }

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


            /*
               Testing Pending ko
               Testing Completed maana jayega
            */

            if (
                status ===
                "Testing Pending"
            ) {

                status =
                    "Testing Completed";

            }


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
        "crmProjects",
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
   CLOSE COMMENT FORM
========================= */

if (closeCommentForm) {

    closeCommentForm.addEventListener(
        "click",
        function () {

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

            if (commentModal) {

                commentModal.style.display =
                    "none";

            }

        }
    );

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


            /* =========================
               TESTING PENDING
               → TESTING COMPLETED
            ========================= */

            if (
                commentStatusValue ===
                "Testing Pending"
            ) {

                commentStatusValue =
                    "Testing Completed";

            }


            /* =========================
               DATE
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


            /* =========================
               TIME
            ========================= */

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


            /* =========================
               NEW COMMENT
            ========================= */

            const newComment = {

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


            /* =========================
               COMMENT ARRAY
            ========================= */

            if (
                !Array.isArray(
                    currentProject.comments
                )
            ) {

                currentProject.comments =
                    [];

            }


            currentProject.comments.push(
                newComment
            );


            /* =========================
               PROJECT STATUS
            ========================= */

            currentProject.projectStatus =
                commentStatusValue;


            /* =========================
               FIND PROJECT
            ========================= */

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


            /* =========================
               UPDATE PROJECT
            ========================= */

            if (
                projectIndex !== -1
            ) {

                projects[
                    projectIndex
                ] =
                    currentProject;

            }


            /* =========================
               SAVE
            ========================= */

            saveProjects();


            /* =========================
               UPDATE STATUS
            ========================= */

            updateProjectStatus(
                commentStatusValue
            );


            /* =========================
               SHOW COMMENTS
            ========================= */

            showComments();


            /* =========================
               CLOSE MODAL
            ========================= */

            if (commentModal) {

                commentModal.style.display =
                    "none";

            }


            /* =========================
               RESET FORM
            ========================= */

            addCommentForm.reset();


            /* =========================
               SUCCESS
            ========================= */

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