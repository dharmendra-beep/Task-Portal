/* =========================
   DASHBOARD
========================= */


/* =========================
   LOAD TASK DATA
========================= */

function loadDashboardTasks() {

    const savedTasks =
        localStorage.getItem("crmTasks");

    if (!savedTasks) {
        return [];
    }

    try {

        const parsedTasks =
            JSON.parse(savedTasks);

        return Array.isArray(parsedTasks)
            ? parsedTasks
            : [];

    } catch (error) {

        console.error(
            "Unable to load crmTasks:",
            error
        );

        return [];
    }
}


/* =========================
   ELEMENTS
========================= */

const dashboardMonth =
    document.getElementById("dashboardMonth");

const totalTasks =
    document.getElementById("dashboardTotalTasks");

const pendingTasks =
    document.getElementById("dashboardPendingTasks");

const inProcessTasks =
    document.getElementById("dashboardInProcessTasks");

const closedTasks =
    document.getElementById("dashboardClosedTasks");

const completedTasks =
    document.getElementById("dashboardCompletedTasks");

const completionRate =
    document.getElementById("dashboardCompletionRate");

const averageTime =
    document.getElementById("dashboardAverageTime");

const overdueTasks =
    document.getElementById("dashboardOverdueTasks");

const projectTableBody =
    document.getElementById(
        "dashboardProjectTableBody"
    );

const projectSummaryMonth =
    document.getElementById(
        "projectSummaryMonth"
    );

const donut =
    document.getElementById(
        "taskStatusDonut"
    );

const donutTotal =
    document.getElementById(
        "dashboardDonutTotal"
    );

const pendingPercent =
    document.getElementById(
        "dashboardPendingPercent"
    );

const processPercent =
    document.getElementById(
        "dashboardProcessPercent"
    );

const closedPercent =
    document.getElementById(
        "dashboardClosedPercent"
    );

const issuesRaised =
    document.getElementById(
        "dashboardIssuesRaised"
    );

const issuesResolved =
    document.getElementById(
        "dashboardIssuesResolved"
    );

const resolutionRate =
    document.getElementById(
        "dashboardResolutionRate"
    );


/* =========================
   DATE PARSER
========================= */

function parseTaskDate(dateString) {

    if (!dateString) {
        return null;
    }

    const date =
        new Date(dateString);

    if (isNaN(date.getTime())) {
        return null;
    }

    return date;
}


/* =========================
   SELECTED MONTH TASKS
========================= */

function getSelectedMonthTasks(
    allTasks
) {

    const selectedMonth =
        dashboardMonth.value;

    return allTasks.filter(
        function (task) {

            const taskDate =
                parseTaskDate(
                    task.createdDate
                );

            if (!taskDate) {
                return false;
            }

            const year =
                taskDate.getFullYear();

            const month =
                String(
                    taskDate.getMonth() + 1
                ).padStart(2, "0");

            return (
                `${year}-${month}` ===
                selectedMonth
            );

        }
    );

}


/* =========================
   KPI
========================= */

function updateKPI(allTasks) {

    const total =
        allTasks.length;


    const pending =
        allTasks.filter(
            function (task) {

                return (
                    task.status ===
                    "Pending"
                );

            }
        ).length;


    const inProcess =
        allTasks.filter(
            function (task) {

                return (
                    task.status ===
                    "In Process"
                );

            }
        ).length;


    const closed =
        allTasks.filter(
            function (task) {

                return (
                    task.status ===
                    "Closed"
                );

            }
        ).length;


    totalTasks.textContent =
        total;

    pendingTasks.textContent =
        pending;

    inProcessTasks.textContent =
        inProcess;

    closedTasks.textContent =
        closed;

    completedTasks.textContent =
        closed;


    const rate =
        total > 0
            ? Math.round(
                (closed / total) * 100
            )
            : 0;


    completionRate.textContent =
        rate + "%";


    donutTotal.textContent =
        total;


    updateStatusPercentages(
        total,
        pending,
        inProcess,
        closed
    );


    updateDonut(
        total,
        pending,
        inProcess,
        closed
    );

}


/* =========================
   STATUS PERCENTAGE
========================= */

function updateStatusPercentages(
    total,
    pending,
    inProcess,
    closed
) {

    if (total === 0) {

        pendingPercent.textContent =
            "0%";

        processPercent.textContent =
            "0%";

        closedPercent.textContent =
            "0%";

        return;
    }


    pendingPercent.textContent =
        Math.round(
            (pending / total) * 100
        ) + "%";


    processPercent.textContent =
        Math.round(
            (inProcess / total) * 100
        ) + "%";


    closedPercent.textContent =
        Math.round(
            (closed / total) * 100
        ) + "%";

}


/* =========================
   DONUT
========================= */

function updateDonut(
    total,
    pending,
    inProcess,
    closed
) {

    if (total === 0) {

        donut.style.background =
            "#e5e7eb";

        return;
    }


    const pendingDegree =
        (pending / total) * 360;


    const processDegree =
        (inProcess / total) * 360;


    const closedDegree =
        (closed / total) * 360;


    const processEnd =
        pendingDegree +
        processDegree;


    const closedEnd =
        processEnd +
        closedDegree;


    donut.style.background =
        `conic-gradient(
            #f59e0b 0deg ${pendingDegree}deg,
            #6366f1 ${pendingDegree}deg ${processEnd}deg,
            #22c55e ${processEnd}deg ${closedEnd}deg
        )`;

}


/* =========================
   TOP 10 PROJECTS
========================= */

function updateProjectSummary(
    monthTasks
) {

    projectTableBody.innerHTML =
        "";


    const projectMap = {};


    monthTasks.forEach(
        function (task) {

            const projectName =
                task.projectName ||
                "Unknown Project";


            if (!projectMap[projectName]) {

                projectMap[projectName] = {

                    total: 0,
                    pending: 0,
                    inProcess: 0,
                    closed: 0

                };

            }


            projectMap[
                projectName
            ].total++;


            if (
                task.status ===
                "Pending"
            ) {

                projectMap[
                    projectName
                ].pending++;

            }


            if (
                task.status ===
                "In Process"
            ) {

                projectMap[
                    projectName
                ].inProcess++;

            }


            if (
                task.status ===
                "Closed"
            ) {

                projectMap[
                    projectName
                ].closed++;

            }

        }
    );


    const projects =
        Object.keys(projectMap)
            .map(
                function (projectName) {

                    return {

                        projectName:
                            projectName,

                        ...projectMap[
                            projectName
                        ]

                    };

                }
            )
            .sort(
                function (a, b) {

                    return (
                        b.total -
                        a.total
                    );

                }
            )
            .slice(0, 10);


    if (projects.length === 0) {

        projectTableBody.innerHTML = `
            <tr>
                <td colspan="6">
                    No project data available
                </td>
            </tr>
        `;

        return;
    }


    projects.forEach(
        function (
            project,
            index
        ) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${project.projectName}
                </td>

                <td>
                    ${project.total}
                </td>

                <td>
                    ${project.closed}
                </td>

                <td>
                    ${project.inProcess}
                </td>

                <td>
                    ${project.pending}
                </td>

            `;


            projectTableBody.appendChild(
                row
            );

        }
    );

}


/* =========================
   AVERAGE WORKING TIME
========================= */

function updateAverageWorkingTime(
    monthTasks
) {

    let totalMinutes = 0;

    let validTasks = 0;


    monthTasks.forEach(
        function (task) {

            if (!task.workingTime) {
                return;
            }


            const match =
                String(
                    task.workingTime
                )
                .toLowerCase()
                .match(
                    /([\d.]+)\s*(hour|hours|hr|hrs|minute|minutes|min|mins)/
                );


            if (!match) {
                return;
            }


            const value =
                parseFloat(
                    match[1]
                );


            const unit =
                match[2];


            if (
                unit.includes("hour") ||
                unit.includes("hr")
            ) {

                totalMinutes +=
                    value * 60;

            } else {

                totalMinutes +=
                    value;

            }


            validTasks++;

        }
    );


    if (validTasks === 0) {

        averageTime.textContent =
            "0 Hours";

        return;
    }


    const averageMinutes =
        totalMinutes /
        validTasks;


    const hours =
        Math.floor(
            averageMinutes / 60
        );


    const minutes =
        Math.round(
            averageMinutes % 60
        );


    if (hours > 0) {

        averageTime.textContent =
            minutes > 0
                ? `${hours}h ${minutes}m`
                : `${hours} Hours`;

    } else {

        averageTime.textContent =
            `${minutes} Minutes`;

    }

}


/* =========================
   OVERDUE
========================= */

function updateOverdueTasks(
    monthTasks
) {

    const today =
        new Date();


    today.setHours(
        0,
        0,
        0,
        0
    );


    const overdue =
        monthTasks.filter(
            function (task) {

                if (
                    task.status ===
                    "Closed"
                ) {

                    return false;

                }


                const estimationDate =
                    parseTaskDate(
                        task.estimationDate
                    );


                if (!estimationDate) {
                    return false;
                }


                estimationDate.setHours(
                    0,
                    0,
                    0,
                    0
                );


                return (
                    estimationDate <
                    today
                );

            }
        ).length;


    overdueTasks.textContent =
        overdue;

}


/* =========================
   MONTH LABEL
========================= */

function updateMonthLabel() {

    const selectedOption =
        dashboardMonth.options[
            dashboardMonth.selectedIndex
        ];


    if (!selectedOption) {
        return;
    }


    projectSummaryMonth.textContent =
        selectedOption.textContent +
        " Task Summary";

}


/* =========================
   PENDING VS COMPLETED
========================= */

function updateIssues(
    monthTasks
) {

    /*
        Pending:
        Pending + In Process

        Completed:
        Closed

        Reject:
        Completely ignored
    */


    const pendingCount =
        monthTasks.filter(
            function (task) {

                return (
                    task.status ===
                    "Pending" ||

                    task.status ===
                    "In Process"
                );

            }
        ).length;


    const completedCount =
        monthTasks.filter(
            function (task) {

                return (
                    task.status ===
                    "Closed"
                );

            }
        ).length;


    const countedTasks =
        pendingCount +
        completedCount;


    const rate =
        countedTasks > 0
            ? Math.round(
                (
                    completedCount /
                    countedTasks
                ) * 100
            )
            : 0;


    issuesRaised.textContent =
        pendingCount;


    issuesResolved.textContent =
        completedCount;


    resolutionRate.textContent =
        rate + "%";


    updateTaskStatusChart(
        pendingCount,
        completedCount
    );

}


/* =========================
   PENDING VS COMPLETED CHART
========================= */

function updateTaskStatusChart(
    pendingCount,
    completedCount
) {

    const chart =
        document.getElementById(
            "issueChart"
        );


    if (!chart) {
        return;
    }


    const maxValue =
        Math.max(
            pendingCount,
            completedCount,
            1
        );


    const pendingHeight =
        pendingCount > 0
            ? (pendingCount / maxValue) * 100
            : 0;


    const completedHeight =
        completedCount > 0
            ? (completedCount / maxValue) * 100
            : 0;


    chart.innerHTML = `

        <div class="task-chart">

            <div class="task-chart-y">

                <span>${maxValue}</span>

                <span>
                    ${Math.round(
                        maxValue / 2
                    )}
                </span>

                <span>0</span>

            </div>


            <div class="task-chart-area">

                <div
                    class="task-chart-gridline"
                ></div>

                <div
                    class="task-chart-gridline"
                ></div>

                <div
                    class="task-chart-gridline"
                ></div>


                <div
                    class="task-chart-columns"
                >


                    <!-- PENDING -->

                    <div
                        class="task-chart-column"
                    >

                        


                        <div
                            class="
                                task-chart-bar
                                pending-chart-bar
                            "
                            style="
                                height:
                                ${pendingHeight}%;
                            "
                        ></div>


                        <div
                            class="task-chart-label"
                        >
                            Pending Tasks
                        </div>

                    </div>


                    <!-- COMPLETED -->

                    <div
                        class="task-chart-column"
                    >

                        


                        <div
                            class="
                                task-chart-bar
                                completed-chart-bar
                            "
                            style="
                                height:
                                ${completedHeight}%;
                            "
                        ></div>


                        <div
                            class="task-chart-label"
                        >
                            Completed Tasks
                        </div>

                    </div>


                </div>

            </div>

        </div>

    `;

}


/* =========================
   REFRESH DASHBOARD
========================= */

function refreshDashboard() {

    const allTasks =
        loadDashboardTasks();


    /*
        KPI uses all task data
    */

    updateKPI(
        allTasks
    );


    /*
        Selected month data
    */

    const monthTasks =
        getSelectedMonthTasks(
            allTasks
        );


    /*
        Top 10 Projects
    */

    updateProjectSummary(
        monthTasks
    );


    /*
        Average Working Time
    */

    updateAverageWorkingTime(
        monthTasks
    );


    /*
        Overdue Tasks
    */

    updateOverdueTasks(
        monthTasks
    );


    /*
        Month Label
    */

    updateMonthLabel();


    /*
        Pending vs Completed
        Reject is ignored
    */

    updateIssues(
        monthTasks
    );

}


/* =========================
   MONTH CHANGE
========================= */

dashboardMonth.addEventListener(
    "change",
    function () {

        refreshDashboard();

    }
);


/* =========================
   INITIAL LOAD
========================= */

refreshDashboard();


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