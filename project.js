/* =========================
   MY PROJECT MANAGEMENT
========================= */


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

if (savedProjects) {

    try {

        projects =
            JSON.parse(savedProjects);

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


/* =========================
   SHOW PROJECTS
========================= */

function showProjects(projectList) {

    projectTableBody.innerHTML = "";


    projectList.forEach(function (project, index) {

        const row =
            document.createElement("tr");


        /* =========================
           PROJECT NAME
        ========================= */

        const projectNameCell =
            document.createElement("td");

        const projectNameLink =
    document.createElement("a");

projectNameLink.href =
    "project-profile.html?project=" +
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

        event.preventDefault();


        const newProject = {

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


        projects.push(
            newProject
        );


        saveProjects();


        projectModal.style.display =
            "none";


        addProjectForm.reset();


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