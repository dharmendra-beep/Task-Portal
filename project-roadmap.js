/* ==================================================
   PROJECT ROADMAP
================================================== */


/* ==================================================
   URL
================================================== */

const urlParams =
    new URLSearchParams(window.location.search);

const projectIdFromUrl =
    urlParams.get("projectId");

const projectNameFromUrl =
    urlParams.get("project");


/* ==================================================
   ELEMENTS
================================================== */

const roadmapProjectName =
    document.getElementById("roadmapProjectName");

const roadmapPieProjectName =
    document.getElementById("roadmapPieProjectName");

const roadmapCurrentStatus =
    document.getElementById("roadmapCurrentStatus");

const roadmapEstimationDate =
    document.getElementById("roadmapEstimationDate");

const roadmapStages =
    document.getElementById("roadmapStages");

const roadmapDate =
    document.getElementById("roadmapDate");

const roadmapDay =
    document.getElementById("roadmapDay");

const pendencyPieChart =
    document.getElementById("pendencyPieChart");

const roadmapAssignDate =
    document.getElementById("roadmapAssignDate");

const roadmapTimelineEstimationDate =
    document.getElementById(
        "roadmapTimelineEstimationDate"
    );

const roadmapTotalTime =
    document.getElementById("roadmapTotalTime");

const roadmapRemainingTime =
    document.getElementById("roadmapRemainingTime");

const roadmapEstimationAssign =
    document.getElementById(
        "roadmapEstimationAssign"
    );

const roadmapPendencyTableBody =
    document.getElementById(
        "roadmapPendencyTableBody"
    );


/* ==================================================
   PROJECT DATA
================================================== */

let projects = [];

let currentProject = null;


/* ==================================================
   10 ROADMAP STATUSES
================================================== */

const ROADMAP_STAGES = [

    {
        title: "Project Assign",
        statuses: ["Assigned"]
    },

    {
        title: "Kick-off Call Done",
        statuses: ["Kick-off Call Done"]
    },

    {
        title: "Internal Meeting Done",
        statuses: ["Internal Meeting Done"]
    },

    {
        title: "Assigned to Developer",
        statuses: ["Assigned to Developer"]
    },

    {
        title: "Development Completed",
        statuses: ["Development Completed"]
    },

    {
        title: "Testing Completed",
        statuses: ["Testing Completed"]
    },

    {
        title: "First Demo Completed",
        statuses: ["First Demo Completed"]
    },

    {
        title: "Final Demo Completed",
        statuses: ["Final Demo Completed"]
    },

    {
        title: "Account Approval",
        statuses: ["Account Approval"]
    },

    {
        title: "Live",
        statuses: ["Live"]
    }

];

/* ==================================================
   5 PENDENCY TYPES
================================================== */

const PENDENCY_TYPES = [

    {
        key: "ba",

        name: "B.A Pendency",

        color: "#3b82f6",

        statuses: [
            "Kick-off Call Pending",
            "Demo Pending",
            "Kick Off Call Pending"
        ],

        pendingTypes: [
            "Kick-off Call Pending",
            "Demo Pending",
            "BA Pendency",
            "B.A Pendency"
        ]
    },


    {
        key: "development",

        name: "Development Pendency",

        color: "#22c55e",

        statuses: [
            "Task Assignment Pending",
            "Development Pending"
        ],

        pendingTypes: [
            "Task Assignment Pending",
            "Task Assigning Pending",
            "Development Pending",
            "Development Pendency"
        ]
    },


    {
        key: "client",

        name: "Client Side Pendency",

        color: "#f59e0b",

        statuses: [
            "Client Side Pending",
            "Account Approval Pending"
        ],

        pendingTypes: [
            "Client Side Pending",
            "Account Approval Pending",
            "Client Side Pendency"
        ]
    },


    {
        key: "review",

        name: "In Review",

        color: "#8b5cf6",

        statuses: [
            "In Review",
            "Review Pending"
        ],

        pendingTypes: [
            "In Review",
            "Review Pending"
        ]
    },


    {
        key: "testing",

        name: "Testing Pendency",

        color: "#ef4444",

        statuses: [
            "Testing Pending"
        ],

        pendingTypes: [
            "Testing Pending",
            "Testing Pendency"
        ]
    }

];


/* ==================================================
   LOAD PROJECTS
================================================== */

function loadProjects() {

    let savedProjects =
        localStorage.getItem("crmNewProjects");

    const shouldFilterLegacyProjects =
        !savedProjects;

    if (!savedProjects) {

        savedProjects =
            localStorage.getItem("crmProjects");

    }


    if (!savedProjects) {

        projects = [];

        return;

    }


    try {

        const parsed =
            JSON.parse(savedProjects);

        projects =
            Array.isArray(parsed)
                ? parsed
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


/* ==================================================
   FIND PROJECT
================================================== */

function findCurrentProject() {

    currentProject = null;


    if (projectIdFromUrl) {

        currentProject =
            projects.find(function (project) {

                return (
                    String(project.projectId) ===
                    String(projectIdFromUrl)
                );

            });

    }


    if (
        !currentProject &&
        projectNameFromUrl
    ) {

        currentProject =
            projects.find(function (project) {

                return (
                    project.projectName ===
                    projectNameFromUrl
                );

            });

    }

}


/* ==================================================
   DATE ONLY
================================================== */

function normalizeDate(value) {

    if (!value) {

        return null;

    }


    if (
        typeof value === "string" &&
        value.length >= 10
    ) {

        const datePart =
            value.substring(0, 10);

        const date =
            new Date(
                datePart + "T00:00:00"
            );

        if (!isNaN(date.getTime())) {

            return date;

        }

    }


    const date =
        new Date(value);

    if (isNaN(date.getTime())) {

        return null;

    }


    date.setHours(0, 0, 0, 0);

    return date;

}


/* ==================================================
   DAYS BETWEEN
   ONLY FULL CALENDAR DAYS
================================================== */

function daysBetween(
    startDate,
    endDate
) {

    const start =
        normalizeDate(startDate);

    const end =
        normalizeDate(endDate);


    if (!start || !end) {

        return 0;

    }


    const difference =
        end.getTime() -
        start.getTime();


    if (difference <= 0) {

        return 0;

    }


    return Math.floor(
        difference /
        (1000 * 60 * 60 * 24)
    );

}


/* ==================================================
   TODAY
================================================== */

function getToday() {

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);

    return today;

}


/* ==================================================
   FORMAT DATE
================================================== */

function formatDate(value) {

    const date =
        normalizeDate(value);


    if (!date) {

        return "--";

    }


    return date.toLocaleDateString(
        "en-GB",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* ==================================================
   HEADER DATE
================================================== */

function loadHeaderDate() {

    const now =
        new Date();


    roadmapDate.textContent =
        now.toLocaleDateString(
            "en-GB",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );


    roadmapDay.textContent =
        now.toLocaleDateString(
            "en-US",
            {
                weekday: "long"
            }
        );

}


/* ==================================================
   GET COMMENTS
================================================== */

function getComments() {

    if (
        !currentProject ||
        !Array.isArray(
            currentProject.comments
        )
    ) {

        return [];

    }


    return currentProject.comments;

}


/* ==================================================
   COMMENT STATUS
================================================== */

function getCommentStatus(comment) {

    return String(
        comment.status ||
        comment.commentStatus ||
        ""
    ).trim();

}


/* ==================================================
   COMMENT PENDENCY TYPE
================================================== */

function getCommentPendencyType(comment) {

    return String(
        comment.pendencyType ||
        comment.pendingType ||
        comment.pendency ||
        ""
    ).trim();

}


/* ==================================================
   FIND PENDENCY CATEGORY
================================================== */

function getPendencyTypeForComment(comment) {

    const status =
        getCommentStatus(comment);

    const pendingType =
        getCommentPendencyType(comment);


    /*
       New canonical Pendency Type is the primary
       source for the five roadmap categories.
    */
    for (
        let i = 0;
        i < PENDENCY_TYPES.length;
        i++
    ) {

        const type =
            PENDENCY_TYPES[i];


        if (
            type.name ===
            pendingType
        ) {

            return type;

        }

    }


    /*
       Existing status / legacy pendency logic is
       kept as the fallback.
    */
    for (
        let i = 0;
        i < PENDENCY_TYPES.length;
        i++
    ) {

        const type =
            PENDENCY_TYPES[i];


        if (
            type.statuses.includes(status) ||
            type.pendingTypes.includes(pendingType)
        ) {

            return type;

        }

    }


    return null;

}


/* ==================================================
   COMMENT DATE
================================================== */

function getCommentDate(comment) {

    return (
        comment.date ||
        comment.createdDate ||
        comment.commentDate ||
        null
    );

}


/* ==================================================
   COMMENT TIME
================================================== */

function getCommentTime(comment) {

    return (
        comment.time ||
        comment.createdTime ||
        comment.commentTime ||
        "00:00"
    );

}   

/* ==================================================
   COMMENT DATETIME
================================================== */

function getCommentDateTime(comment) {

    const date =
        getCommentDate(comment);

    const time =
        getCommentTime(comment);


    if (!date) {

        return null;

    }


    const result =
        new Date(
            String(date).substring(0, 10) +
            "T" +
            String(time).substring(0, 5) +
            ":00"
        );


    if (isNaN(result.getTime())) {

        return normalizeDate(date);

    }


    return result;

}


/* ==================================================
   PENDENCY DAYS
================================================== */

function calculatePendencyDays() {

    const result = {};


    PENDENCY_TYPES.forEach(
        function (type) {

            result[type.key] = 0;

        }
    );


    const comments =
        getComments()
            .filter(function (comment) {

                return (
                    getCommentDateTime(comment)
                    !== null
                );

            })
            .sort(function (a, b) {

                return (
                    getCommentDateTime(a).getTime() -
                    getCommentDateTime(b).getTime()
                );

            });


    if (!comments.length) {

        return result;

    }


    /*
       Last pendency ka end time
       current exact time hoga.
    */

    const now =
        new Date();


    for (
        let i = 0;
        i < comments.length;
        i++
    ) {

        const comment =
            comments[i];


        const type =
            getPendencyTypeForComment(
                comment
            );


        if (!type) {

            continue;

        }


        const start =
            getCommentDateTime(
                comment
            );


        let end = null;


        /*
           Agar next comment hai,
           to uska exact date + time end hoga.
        */

        if (
            i <
            comments.length - 1
        ) {

            end =
                getCommentDateTime(
                    comments[i + 1]
                );

        } else {

            /*
               Last/current pendency abhi tak
               chal rahi hai.
            */

            end = now;

        }


        if (!start || !end) {

            continue;

        }


        const difference =
            end.getTime() -
            start.getTime();


        if (difference <= 0) {

            continue;

        }


        /*
           Yahan value DAYS nahi,
           MILLISECONDS mein store hogi.
        */

        result[type.key] +=
            difference;

    }


    return result;

}


function formatPendencyDuration(
    milliseconds
) {

    const totalHours =
        Math.floor(
            milliseconds /
            (1000 * 60 * 60)
        );


    const days =
        Math.floor(
            totalHours / 24
        );


    const hours =
        totalHours % 24;


    return (
        days +
        " Days : " +
        hours +
        " H"
    );

}

/* ==================================================
   TOTAL TRACKED PENDENCY DAYS
================================================== */

function getTotalPendencyDays(
    values
) {

    return PENDENCY_TYPES.reduce(
        function (total, type) {

            return (
                total +
                (values[type.key] || 0)
            );

        },
        0
    );

}


/* ==================================================
   PENDENCY %
================================================== */

function getPendencyPercentage(
    value,
    total
) {

    if (!total) {

        return 0;

    }


    return (
        value /
        total *
        100
    );

}


/* ==================================================
   TIMELINE CALCULATION
================================================== */

function calculateTimeline() {

    const assignDate =
        currentProject.assignDate ||
        currentProject.projectAssignDate ||
        currentProject.createdDate ||
        currentProject.createdAt ||
        null;


    const estimationDate =
        currentProject.estimationDate ||
        currentProject.estimatedDate ||
        null;


    roadmapAssignDate.textContent =
        formatDate(assignDate);


    roadmapTimelineEstimationDate.textContent =
        formatDate(estimationDate);


    roadmapEstimationDate.textContent =
        "Estimation: " +
        formatDate(estimationDate);


    if (
        !assignDate ||
        !estimationDate
    ) {

        roadmapTotalTime.textContent =
            "0 Days";

        roadmapRemainingTime.textContent =
            "0 Days";

        roadmapEstimationAssign.textContent =
            "0 Days";

        return;

    }


    const totalTime =
        daysBetween(
            assignDate,
            estimationDate
        );


    const today =
        getToday();


    const estimation =
        normalizeDate(
            estimationDate
        );


    let remaining =
        daysBetween(
            today,
            estimation
        );


    let late =
        daysBetween(
            estimation,
            today
        );


    /*
       Remaining time:
       estimation date future ho
       tabhi positive value.
    */

    if (today >= estimation) {

        remaining = 0;

    }


    /*
       Estimation Assign:
       estimation cross hone se
       pehle 0.
    */

    if (today <= estimation) {

        late = 0;

    }


    roadmapTotalTime.textContent =
        totalTime + " Days";


    roadmapRemainingTime.textContent =
        remaining + " Days";


    roadmapEstimationAssign.textContent =
        late + " Days";

}


/* ==================================================
   GET CURRENT ROADMAP STAGE
================================================== */

function getCompletedStageIndex() {

    if (!currentProject) {
        return 0;
    }

    let highest = 0;


    /* =========================================
       1. NEW PROJECT → ASSIGNED
       ========================================= */

    const projectStatus =
        String(
            currentProject.projectStatus ||
            currentProject.status ||
            ""
        ).trim();


    /*
       Project create hote hi
       Assigned status Stage 1 complete karega.
    */

    if (projectStatus === "Assigned") {

        highest = 1;

    }


    /* =========================================
       2. ONLY "COMPLITED" PENDENCY
       ========================================= */

    getComments().forEach(
        function (comment) {

            const pendencyType =
                String(
                    comment.pendencyType ||
                    comment.pendingType ||
                    comment.pendency ||
                    ""
                ).trim();


            /*
               Sirf Complited Pendency ke
               status roadmap ko update karenge.
            */

            if (
                pendencyType !== "Complited"
            ) {

                return;

            }


            const status =
                String(
                    comment.status ||
                    comment.commentStatus ||
                    ""
                ).trim();


            /* =================================
               3. STATUS → ROADMAP STAGE
               ================================= */

            ROADMAP_STAGES.forEach(
                function (stage, index) {

                    if (
                        stage.statuses.includes(
                            status
                        )
                    ) {

                        highest =
                            Math.max(
                                highest,
                                index + 1
                            );

                    }

                }
            );

        }
    );


    return highest;

}

/* ==================================================
   ESTIMATION REACHED
================================================== */

function isEstimationDateReached() {

    const estimationDate =
        currentProject
            ? currentProject.estimationDate
            : null;


    if (!estimationDate) {

        return false;

    }


    const today =
        getToday();


    const estimation =
        normalizeDate(
            estimationDate
        );


    if (!estimation) {

        return false;

    }


    return today >= estimation;

}


/* ==================================================
   STAGE STATE
================================================== */

function getStageState(
    index,
    completedStageIndex
) {

    const number =
        index + 1;


    if (
        number <=
        completedStageIndex
    ) {

        return "completed";

    }


    if (
        isEstimationDateReached()
    ) {

        return "overdue";

    }


    return "pending";

}


/* ==================================================
   OPEN STATUS FILTER
================================================== */

function openStatusProfile(
    statuses
) {

    if (!currentProject) {

        return;

    }


    const params =
        new URLSearchParams();


    if (currentProject.projectId) {

        params.set(
            "projectId",
            currentProject.projectId
        );

    }


    if (currentProject.projectName) {

        params.set(
            "project",
            currentProject.projectName
        );

    }


    params.set(
        "status",
        statuses.join("|")
    );


    params.set(
        "filterType",
        "status"
    );


    window.location.href =
        "profile-new-project.html?" +
        params.toString();

}


/* ==================================================
   OPEN PENDENCY FILTER
================================================== */

function openPendencyProfile(
    type
) {

    if (!currentProject) {

        return;

    }


    const params =
        new URLSearchParams();


    if (currentProject.projectId) {

        params.set(
            "projectId",
            currentProject.projectId
        );

    }


    if (currentProject.projectName) {

        params.set(
            "project",
            currentProject.projectName
        );

    }


    /*
       Multiple parameter names are sent
       so the existing profile filter
       can use the matching one.
    */

    params.set(
        "pendency",
        type.key
    );


    params.set(
        "pendencyType",
        type.name
    );


    params.set(
        "pendingType",
        type.name
    );


    params.set(
        "filterType",
        "pendency"
    );


    window.location.href =
        "profile-new-project.html?" +
        params.toString();

}


/* ==================================================
   CREATE ROADMAP STAGES
================================================== */

function renderStages() {

    roadmapStages.innerHTML = "";


    const completedStageIndex =
        getCompletedStageIndex();


    ROADMAP_STAGES.forEach(
        function (stage, index) {

            const state =
                getStageState(
                    index,
                    completedStageIndex
                );


            const wrapper =
                document.createElement(
                    "div"
                );


            wrapper.className =
                "roadmap-stage " +
                state;


            const button =document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "roadmap-stage-card";


            const number =
                document.createElement(
                    "span"
                );


            number.className =
                "roadmap-stage-number";


            number.textContent =
                state === "completed"
                    ? "✓"
                    : String(index + 1);


            const text =
                document.createElement(
                    "span"
                );


            text.className =
                "roadmap-stage-text";


            const title =
                document.createElement(
                    "strong"
                );


            title.textContent =
                stage.title;


            const status =
                document.createElement(
                    "span"
                );


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


            button.addEventListener(
                "click",
                function () {

                    openStatusProfile(
                        stage.statuses
                    );

                }
            );


            wrapper.appendChild(
                button
            );


            roadmapStages.appendChild(
                wrapper
            );

        }
    );

}


/* ==================================================
   SVG PIE CHART
================================================== */

function polarToCartesian(
    centerX,
    centerY,
    radius,
    angleInDegrees
) {

    const angle =
        (angleInDegrees - 90) *
        Math.PI /
        180;


    return {

        x:
            centerX +
            radius *
            Math.cos(angle),

        y:
            centerY +
            radius *
            Math.sin(angle)

    };

}


/* ==================================================
   SVG ARC PATH
================================================== */

function describeArc(
    centerX,
    centerY,
    radius,
    startAngle,
    endAngle,
    innerRadius
) {

    const startOuter =
        polarToCartesian(
            centerX,
            centerY,
            radius,
            endAngle
        );


    const endOuter =
        polarToCartesian(
            centerX,
            centerY,
            radius,
            startAngle
        );


    const startInner =
        polarToCartesian(
            centerX,
            centerY,
            innerRadius,
            endAngle
        );


    const endInner =
        polarToCartesian(
            centerX,
            centerY,
            innerRadius,
            startAngle
        );


    const largeArcFlag =
        endAngle - startAngle <= 180
            ? "0"
            : "1";


    return [

        "M",
        startOuter.x,
        startOuter.y,

        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        endOuter.x,
        endOuter.y,

        "L",
        endInner.x,
        endInner.y,

        "A",
        innerRadius,
        innerRadius,
        0,
        largeArcFlag,
        1,
        startInner.x,
        startInner.y,

        "Z"

    ].join(" ");

}


/* ==================================================
   RENDER PIE
================================================== */

function renderPieChart() {

    if (!pendencyPieChart) {
        return;
    }

    pendencyPieChart.innerHTML = "";

    const values = calculatePendencyDays();
    const total = getTotalPendencyDays(values);

    const center = 110;
    const radius = 88;
    const innerRadius = 52;

    let currentAngle = 0;

    /*
       Pie chart mein 5 sections hamesha visible rahenge.

       Agar total time 0 hai:
       → 5 equal sections

       Agar total time available hai:
       → actual time ke according size
       → lekin 0-day category ko bhi chhota visible section
         diya jayega.
    */

    const MIN_ANGLE = 8;

    let chartValues = [];

    if (total === 0) {

        PENDENCY_TYPES.forEach(function () {

            chartValues.push(1);

        });

    } else {

        let nonZeroTotal = 0;
        let zeroCount = 0;

        PENDENCY_TYPES.forEach(function (type) {

            const value =
                Number(values[type.key]) || 0;

            if (value > 0) {

                nonZeroTotal += value;

            } else {

                zeroCount++;

            }

        });

        /*
           Zero categories ke liye minimum angle reserve.
        */
        const reservedAngle =
            zeroCount * MIN_ANGLE;

        const remainingAngle =
            360 - reservedAngle;

        PENDENCY_TYPES.forEach(function (type) {

            const value =
                Number(values[type.key]) || 0;

            if (value > 0) {

                chartValues.push({
                    value: value,
                    angle:
                        nonZeroTotal > 0
                            ? (value / nonZeroTotal) *
                              remainingAngle
                            : 0
                });

            } else {

                chartValues.push({
                    value: 0,
                    angle: MIN_ANGLE
                });

            }

        });

    }


    PENDENCY_TYPES.forEach(function (type, index) {

        let angle;

        /*
           Total 0 hone par equal 5 sections.
        */
        if (total === 0) {

            angle = 72;

        } else {

            angle =
                chartValues[index].angle;

        }


        const path =
            document.createElementNS(
                "http://www.w3.org/2000/svg",
                "path"
            );


        const pathData =
            describeArc(
                center,
                center,
                radius,
                currentAngle,
                currentAngle + angle,
                innerRadius
            );


        path.setAttribute(
            "d",
            pathData
        );


        path.setAttribute(
            "fill",
            type.color
        );


        path.setAttribute(
            "stroke",
            "#ffffff"
        );


        path.setAttribute(
            "stroke-width",
            "3"
        );


        path.classList.add(
            "pendency-pie-segment"
        );


        path.dataset.pendency =
            type.key;


        path.style.cursor =
            "pointer";


        /*
           Pie section click
           → Profile
           → Correct pendency filter
        */
        path.addEventListener(
            "click",
            function () {

                openPendencyProfile(type);

            }
        );


        path.setAttribute(
            "tabindex",
            "0"
        );


        path.addEventListener(
            "keydown",
            function (event) {

                if (
                    event.key === "Enter" ||
                    event.key === " "
                ) {

                    event.preventDefault();

                    openPendencyProfile(type);

                }

            }
        );


        pendencyPieChart.appendChild(
            path
        );


        currentAngle += angle;

    });

}
/* ==================================================
   PENDENCY TABLE
================================================== */
/* ==================================================
   PENDENCY PIE CALLOUTS
================================================== */

function renderPendencyCallouts() {

    const calloutContainer =
        document.getElementById(
            "pendencyPieCallouts"
        );

    if (!calloutContainer || !pendencyPieChart) {
        return;
    }

    calloutContainer.innerHTML = "";

    const values =
        calculatePendencyDays();

    const total =
        getTotalPendencyDays(values);

    const wrapper =
    calloutContainer.parentElement;

    if (!wrapper) {
        return;
    }

    const wrapperRect =
        wrapper.getBoundingClientRect();

    const chartRect =
        pendencyPieChart.getBoundingClientRect();

    /*
       Pie chart ka actual center
    */
    const centerX =
        chartRect.left -
        wrapperRect.left +
        chartRect.width / 2;

    const centerY =
        chartRect.top -
        wrapperRect.top +
        chartRect.height / 2;

    /*
       Pie ka outer radius
    */
    const radius =
        (Math.min(
            chartRect.width,
            chartRect.height
        ) / 2) * 0.80;

    /*
       Angular connector ke liye SVG
    */
   /*
   Angular connector ke liye SVG
*/
const lineSvg =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

lineSvg.classList.add(
    "pendency-callout-lines"
);

lineSvg.setAttribute(
    "width",
    "100%"
);

lineSvg.setAttribute(
    "height",
    "100%"
);

lineSvg.setAttribute(
    "aria-hidden",
    "true"
);

lineSvg.style.position =
    "absolute";

lineSvg.style.left = "0";
lineSvg.style.top = "0";
lineSvg.style.width = "100%";
lineSvg.style.height = "100%";
lineSvg.style.overflow = "visible";
lineSvg.style.pointerEvents = "none";

calloutContainer.appendChild(
    lineSvg
);


    /*
       5 labels ki position
    */
  const positions = [
    // B.A Pendency
    {
        left: "8%",
        top: "8%",
        anchor: "left"
    },

    // Development Pendency
    {
        left: "62%",
        top: "10%",
        anchor: "left"
    },

    // Client Side Pendency
    {
        left: "70%",
        top: "58%",
        anchor: "left"
    },

    // In Review
    {
        left: "2%",
        top: "43%",
        anchor: "right"
    },

    // Testing Pendency
    {
        left: "8%",
        top: "62%",
        anchor: "right"
    }
];/*
       Pie ke angles calculate karna
    */
    let currentAngle = 0;


    PENDENCY_TYPES.forEach(
        function (type, index) {

            const value =
                Number(
                    values[type.key]
                ) || 0;

            let angle;


            /*
               Agar total 0 hai
               to 5 equal sections.
            */
            if (total === 0) {

                angle = 72;

            } else {

                angle =
                    (value / total) * 360;

            }


            /*
               Zero value ke liye
               small visible section.
            */
            if (
                total !== 0 &&
                angle <= 0
            ) {

                angle = 8;

            }


            const middleAngle =
                currentAngle +
                angle / 2;


            const radians =
                (middleAngle - 90) *
                Math.PI /
                180;


            /*
               Pie ke outer edge ka point
            */
            const startX =
                centerX +
                radius *
                Math.cos(radians);

            const startY =
                centerY +
                radius *
                Math.sin(radians);


            /*
               Label
            */
            const label =
                document.createElement(
                    "div"
                );

            label.className =
                "pendency-callout";


            label.style.setProperty(
                "--callout-color",
                type.color
            );


            label.style.left =
                positions[index].left;

            label.style.top =
                positions[index].top;


            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "pendency-callout-title";

            title.textContent =
                type.name;


            const percentage =
                getPendencyPercentage(
                    value,
                    total
                );


            const info =
                document.createElement(
                    "div"
                );

            info.className =
                "pendency-callout-info";

            info.textContent =
                value +
                " Days  •  " +
                percentage.toFixed(1) +
                "%";


            label.appendChild(
                title
            );

            label.appendChild(
                info
            );

            calloutContainer.appendChild(
                label
            );


            /*
               Label ki position milne ke baad
               uska actual rectangle.
            */
            const labelRect =
                label.getBoundingClientRect();


            const labelLeft =
                labelRect.left -
                wrapperRect.left;

            const labelTop =
                labelRect.top -
                wrapperRect.top;


            const labelRight =
                labelLeft +
                labelRect.width;

            const labelCenterY =
                labelTop +
                labelRect.height / 2;

            const labelCenterX =
                labelLeft +
                labelRect.width / 2;


            let endX;
            let endY;
            let elbowX;
            let elbowY;


            /*
               Label ke side ke according
               connector ka elbow.
            */
            if (
                positions[index].anchor ===
                "left"
            ) {

                endX =
                    labelLeft;

                endY =
                    labelCenterY;

                elbowX = endX - 55;

                elbowY =
                    endY;

            } else if (
                positions[index].anchor ===
                "right"
            ) {

                endX =
                    labelRight;

                endY =
                    labelCenterY;

                elbowX = endX + 55;

                elbowY =
                    endY;

            } else {

                endX =
                    labelCenterX;

                endY =
                    labelTop;

                elbowX =
                    endX;

                elbowY =
                    endY - 25;

            }


            /*
               Angular line - first part
            */
           /*
   Angular connector - common branch style
*/

const line1 =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );

const line2 =
    document.createElementNS(
        "http://www.w3.org/2000/svg",
        "polyline"
    );


/*
   Pie se elbow point tak
*/
let points1;

if (
    positions[index].anchor === "left"
) {

    points1 =
        startX + "," + startY + " " +
        elbowX + "," + elbowY;

} else {

    points1 =
        startX + "," + startY + " " +
        elbowX + "," + elbowY;
}


/*
   Elbow se box tak
*/
let points2 =
    elbowX + "," + elbowY + " " +
    endX + "," + endY;


/*
   First line
*/
line1.setAttribute(
    "points",
    points1
);

line1.setAttribute(
    "stroke",
    type.color
);

line1.setAttribute(
    "stroke-width",
    "2"
);

line1.setAttribute(
    "fill",
    "none"
);

line1.setAttribute(
    "stroke-linecap",
    "round"
);

line1.setAttribute(
    "stroke-linejoin",
    "round"
);


/*
   Second line
*/
line2.setAttribute(
    "points",
    points2
);

line2.setAttribute(
    "stroke",
    type.color
);

line2.setAttribute(
    "stroke-width",
    "2"
);

line2.setAttribute(
    "fill",
    "none"
);

line2.setAttribute(
    "stroke-linecap",
    "round"
);

line2.setAttribute(
    "stroke-linejoin",
    "round"
);


lineSvg.appendChild(
    line1
);

lineSvg.appendChild(
    line2
);


            /*
               Pie touch point
            */
            const dot =
                document.createElement(
                    "span"
                );

            dot.className =
                "pendency-callout-dot";

            dot.style.setProperty(
                "--callout-color",
                type.color
            );

            dot.style.left =
                (startX - 5) +
                "px";

            dot.style.top =
                (startY - 5) +
                "px";


            calloutContainer.appendChild(
                dot
            );


            currentAngle += angle;

        }
    );
}
function renderPendencyTable() {

    roadmapPendencyTableBody.innerHTML = "";


    const values =
        calculatePendencyDays();


    const total =
        getTotalPendencyDays(
            values
        );


    PENDENCY_TYPES.forEach(
        function (type) {

            const row =
                document.createElement(
                    "tr"
                );


            const typeCell =
                document.createElement(
                    "td"
                );


            typeCell.textContent =
                type.name;


            const timeCell =
                document.createElement(
                    "td"
                );


            const duration =
    values[type.key] || 0;

timeCell.textContent =
    formatPendencyDuration(
        duration
    );


            const percentageCell =
    document.createElement(
        "td"
    );

const percentage =
    getPendencyPercentage(
        duration,
        total
    );

const percentageWrapper =
    document.createElement(
        "div"
    );

percentageWrapper.className =
    "pendency-progress-wrapper";


const percentageBar =
    document.createElement(
        "div"
    );

percentageBar.className =
    "pendency-progress-bar";


const percentageFill =
    document.createElement(
        "div"
    );

percentageFill.className =
    "pendency-progress-fill " +
    type.key;

const percentageText =
    document.createElement(
        "span"
    );

percentageText.className =
    "pendency-progress-text";


percentageFill.style.width =
    Math.min(
        100,
        Math.max(
            0,
            percentage
        )
    ) + "%";


percentageText.textContent =
    percentage.toFixed(1) +
    "%";


percentageBar.appendChild(
    percentageFill
);

percentageWrapper.appendChild(
    percentageBar
);

percentageWrapper.appendChild(
    percentageText
);

percentageCell.appendChild(
    percentageWrapper
);


            const actionCell =
                document.createElement(
                    "td"
                );


            const button =
                document.createElement(
                    "button"
                );


            button.type =
                "button";


            button.className =
                "roadmap-view-comment";


            button.textContent =
                "View Comment";


            button.addEventListener(
                "click",
                function () {

                    openPendencyProfile(
                        type
                    );

                }
            );


            actionCell.appendChild(
                button
            );


            row.appendChild(
                typeCell
            );


            row.appendChild(
                timeCell
            );


            row.appendChild(
                percentageCell
            );


            row.appendChild(
                actionCell
            );


            roadmapPendencyTableBody.appendChild(
                row
            );

        }
    );

}


/* ==================================================
   LOAD ROADMAP
================================================== */

function loadRoadmap() {

    if (!currentProject) {

        alert(
            "Project not found."
        );

        window.location.href =
            "new-project.html";

        return;

    }


    roadmapProjectName.textContent =
        currentProject.projectName ||
        "-";


    roadmapPieProjectName.textContent =
        currentProject.projectName ||
        "-";


    roadmapCurrentStatus.textContent =
        currentProject.projectStatus ||
        currentProject.status ||
        "Assigned";


    roadmapEstimationDate.textContent =
        "Estimation: " +
        formatDate(
            currentProject.estimationDate
        );


    calculateTimeline();

    renderPieChart();




    renderStages();

    renderPendencyTable();

   

}


/* ==================================================
   START
================================================== */

loadHeaderDate();

loadProjects();

findCurrentProject();

loadRoadmap();
