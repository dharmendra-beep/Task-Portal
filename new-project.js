/* =========================
   NEW PROJECT FORM
========================= */

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
            "crmProjects"
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
            "crmProjects",
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
                "crmProjects"
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

        projects.push(
            newProject
        );


        /* =========================
           SAVE PROJECTS
        ========================= */

        localStorage.setItem(
            "crmProjects",
            JSON.stringify(
                projects
            )
        );


        /* =========================
           UPDATE TABLE
        ========================= */

        showProjects();


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