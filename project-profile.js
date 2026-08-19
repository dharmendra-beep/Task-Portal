/* =========================
   PROJECT PROFILE
========================= */


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

const commentOf =
    document.getElementById("commentOf");

const commentText =
    document.getElementById("commentText");

const commentsTableBody =
    document.getElementById("commentsTableBody");


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

if (savedProjects) {

    try {

        projects =
            JSON.parse(savedProjects);

    } catch (error) {

        projects = [];

    }

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


/* =========================
   LOAD PROFILE DATA
========================= */

function loadProfile() {

    if (!currentProject) {
        return;
    }


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


    /* =========================
       UPDATE URL
    ========================= */

    const newUrl =
        "project-profile.html?project=" +
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

        event.preventDefault();

        if (!currentProject) {
            return;
        }

        const comments =
            getProjectComments();

        comments.push({
            date: getCurrentDate(),
            time: getCurrentTime(),
            commentOf: commentOf.value.trim(),
            commentText: commentText.value.trim()
        });

        localStorage.setItem(
            "crmProjects",
            JSON.stringify(projects)
        );

        commentModal.style.display =
            "none";

        addCommentForm.reset();

        showComments();

    }
);


/* =========================
   INITIAL LOAD
========================= */

loadProfile();

showComments();
