/* ==================================================
   PROJECT ROADMAP
================================================== */

const urlParams = new URLSearchParams(window.location.search);
const projectIdFromUrl = urlParams.get("projectId");
const projectNameFromUrl = urlParams.get("project");

const roadmapProjectName = document.getElementById("roadmapProjectName");
const roadmapCenterProjectName = document.getElementById("roadmapCenterProjectName");
const roadmapCurrentStatus = document.getElementById("roadmapCurrentStatus");
const roadmapEstimationDate = document.getElementById("roadmapEstimationDate");
const roadmapStages = document.getElementById("roadmapStages");
const roadmapCanvas = document.getElementById("roadmapCanvas");
const roadmapWires = document.getElementById("roadmapWires");
const roadmapDate = document.getElementById("roadmapDate");
const roadmapDay = document.getElementById("roadmapDay");

const ROADMAP_STAGES = [
    { title: "Project Assign", statuses: ["Assigned"] },
    { title: "Kick-off Call Done", statuses: ["Kick-off Call Done"] },
    { title: "Internal Meeting Done", statuses: ["Internal Meeting Done"] },
    { title: "Assigned to Developer", statuses: ["Assign to Developer"] },
    { title: "Development Completed", statuses: ["Development Completed"] },
    { title: "Testing Completed", statuses: ["Testing Pending", "Testing Completed"] },
    { title: "First Demo Completed", statuses: ["First Demo"] },
    { title: "Final Demo Completed", statuses: ["Final Demo"] },
    { title: "Account Approval", statuses: ["Account Approval"] },
    { title: "Live", statuses: ["Live"] }
];

let projects = [];
let currentProject = null;
let completedStageIndex = 0;

function createProjectId() {
    if (window.crypto && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return Date.now().toString(36) + "-" + Math.random().toString(36).slice(2);
}

function loadProjects() {
    const savedProjects = localStorage.getItem("crmProjects");

    if (!savedProjects) {
        projects = [];
        return;
    }

    try {
        const parsed = JSON.parse(savedProjects);
        projects = Array.isArray(parsed) ? parsed : [];
    } catch (error) {
        projects = [];
    }

    let changed = false;

    projects.forEach(function (project) {
        if (!project.projectId) {
            project.projectId = createProjectId();
            changed = true;
        }

        if (!Array.isArray(project.comments)) {
            project.comments = [];
            changed = true;
        }
    });

    if (changed) {
        localStorage.setItem("crmProjects", JSON.stringify(projects));
    }
}

function findCurrentProject() {
    if (projectIdFromUrl) {
        currentProject = projects.find(function (project) {
            return project.projectId === projectIdFromUrl;
        });
    }

    if (!currentProject && projectNameFromUrl) {
        currentProject = projects.find(function (project) {
            return project.projectName === projectNameFromUrl;
        });
    }
}

function getCompletedStageIndex() {
    let highest = 0;

    if (currentProject.projectStatus) {
        ROADMAP_STAGES.forEach(function (stage, index) {
            if (stage.statuses.includes(currentProject.projectStatus)) {
                highest = Math.max(highest, index + 1);
            }
        });
    }

    const comments = Array.isArray(currentProject.comments)
        ? currentProject.comments
        : [];

    comments.forEach(function (comment) {
        const status = comment.status || "";

        ROADMAP_STAGES.forEach(function (stage, index) {
            if (stage.statuses.includes(status)) {
                highest = Math.max(highest, index + 1);
            }
        });
    });

    return highest;
}

function isEstimationDateReached() {
    if (!currentProject.estimationDate) {
        return false;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const estimationDate = new Date(currentProject.estimationDate + "T00:00:00");
    estimationDate.setHours(0, 0, 0, 0);

    return today >= estimationDate;
}

function getStageState(index) {
    const stageNumber = index + 1;

    if (stageNumber <= completedStageIndex) {
        return "completed";
    }

    if (isEstimationDateReached()) {
        return "overdue";
    }

    return "pending";
}

function getFilterStatuses(stage) {
    return stage.statuses;
}

function openStageProfile(stageIndex) {
    const stage = ROADMAP_STAGES[stageIndex];

    if (!stage || !currentProject) {
        return;
    }

    const params = new URLSearchParams();
    params.set("projectId", currentProject.projectId);
    params.set("status", getFilterStatuses(stage).join("|"));

    window.location.href =
        "profile-new-project.html?" + params.toString();
}

function renderStages() {
    roadmapStages.innerHTML = "";

    ROADMAP_STAGES.forEach(function (stage, index) {
        const state = getStageState(index);

        const stageWrapper = document.createElement("div");
        stageWrapper.className = "roadmap-stage " + state;
        stageWrapper.dataset.stageIndex = index;

        const button = document.createElement("button");
        button.type = "button";
        button.className = "roadmap-stage-card";
        button.dataset.stageIndex = index;

        const number = document.createElement("span");
        number.className = "roadmap-stage-number";
        number.textContent = state === "completed" ? "✓" : String(index + 1);

        const text = document.createElement("span");
        text.className = "roadmap-stage-text";

        const title = document.createElement("strong");
        title.textContent = stage.title;

        const status = document.createElement("span");
        status.textContent =
            state === "completed"
                ? "Completed"
                : state === "overdue"
                    ? "Overdue"
                    : "Pending";

        text.appendChild(title);
        text.appendChild(status);

        button.appendChild(number);
        button.appendChild(text);

        button.addEventListener("click", function () {
            openStageProfile(index);
        });

        stageWrapper.appendChild(button);
        roadmapStages.appendChild(stageWrapper);
    });
}

function drawWires() {
    if (!roadmapCanvas || !roadmapWires) {
        return;
    }

    if (window.innerWidth <= 700) {
        roadmapWires.innerHTML = "";
        return;
    }

    const center = document.getElementById("roadmapCenterNode");
    const stageCards = roadmapStages.querySelectorAll(".roadmap-stage-card");

    if (!center || stageCards.length !== ROADMAP_STAGES.length) {
        return;
    }

    const canvasRect = roadmapCanvas.getBoundingClientRect();
    const centerRect = center.getBoundingClientRect();

    const startX = centerRect.right - canvasRect.left;
    const startY = centerRect.top - canvasRect.top + centerRect.height / 2;

    roadmapWires.setAttribute("viewBox", "0 0 " + canvasRect.width + " " + canvasRect.height);
    roadmapWires.innerHTML = "";

    stageCards.forEach(function (card, index) {
        const cardRect = card.getBoundingClientRect();
        const endX = cardRect.left - canvasRect.left;
        const endY = cardRect.top - canvasRect.top + cardRect.height / 2;

        const horizontalGap = Math.max(30, endX - startX);
        const bendX = startX + Math.min(180, horizontalGap * 0.48);
        const state = getStageState(index);

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute(
            "d",
            "M " + startX + " " + startY +
            " C " + bendX + " " + startY +
            ", " + bendX + " " + endY +
            ", " + endX + " " + endY
        );
        path.classList.add("roadmap-wire-path", state);

        roadmapWires.appendChild(path);
    });
}

function loadHeaderDate() {
    const now = new Date();

    roadmapDate.textContent = now.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
    });

    roadmapDay.textContent = now.toLocaleDateString("en-US", {
        weekday: "long"
    });
}

function loadRoadmap() {
    if (!currentProject) {
        alert("Project not found.");
        window.location.href = "new-project.html";
        return;
    }

    completedStageIndex = getCompletedStageIndex();

    roadmapProjectName.textContent = currentProject.projectName || "-";
    roadmapCenterProjectName.textContent = currentProject.projectName || "-";
    roadmapCurrentStatus.textContent = currentProject.projectStatus || "Assigned";
    roadmapEstimationDate.textContent =
        "Estimation: " + (currentProject.estimationDate || "-");

    renderStages();

    requestAnimationFrame(function () {
        drawWires();
    });
}

window.addEventListener("resize", drawWires);

loadHeaderDate();
loadProjects();
findCurrentProject();
loadRoadmap();
