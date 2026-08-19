/* =========================
   DOCUMENT MANAGEMENT
========================= */


/* =========================
   ELEMENTS
========================= */

const documentSearch =
    document.getElementById("documentSearch");

const clearDocumentSearch =
    document.getElementById("clearDocumentSearch");

const documentTableBody =
    document.getElementById("documentTableBody");

const addDocumentButton =
    document.getElementById("addDocumentButton");

const documentModal =
    document.getElementById("documentModal");

const closeDocumentForm =
    document.getElementById("closeDocumentForm");

const cancelDocumentForm =
    document.getElementById("cancelDocumentForm");

const addDocumentForm =
    document.getElementById("addDocumentForm");

const documentProjectName =
    document.getElementById("documentProjectName");

const documentTaskId =
    document.getElementById("documentTaskId");

const documentDate =
    document.getElementById("documentDate");

const documentTime =
    document.getElementById("documentTime");

const documentContactPerson =
    document.getElementById("documentContactPerson");

const documentTaskType =
    document.getElementById("documentTaskType");

const documentType =
    document.getElementById("documentType");

const documentFile =
    document.getElementById("documentFile");

const documentSuccessPopup =
    document.getElementById("documentSuccessPopup");

const documentSuccessClose =
    document.getElementById("documentSuccessClose");


/* =========================
   DATA
========================= */

let documents = [];

const savedDocuments =
    localStorage.getItem("crmDocuments");

if (savedDocuments) {

    try {

        documents = JSON.parse(savedDocuments);

    } catch (error) {

        documents = [];

    }

}


/* =========================
   DATE
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


/* =========================
   TIME
========================= */

function getCurrentTime() {

    const now = new Date();

    const hours =
        String(now.getHours()).padStart(2, "0");

    const minutes =
        String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;

}


/* =========================
   OPEN ADD DOCUMENT MODAL
========================= */

addDocumentButton.addEventListener(
    "click",
    function () {

        addDocumentForm.reset();

        documentDate.value =
            getCurrentDate();

        documentTime.value =
            getCurrentTime();

        documentModal.style.display =
            "flex";

    }
);


/* =========================
   CLOSE MODAL
========================= */

closeDocumentForm.addEventListener(
    "click",
    function () {

        documentModal.style.display =
            "none";

    }
);


cancelDocumentForm.addEventListener(
    "click",
    function () {

        documentModal.style.display =
            "none";

    }
);


/* =========================
   SHOW DOCUMENTS
========================= */

function showDocuments(documentList) {

    documentTableBody.innerHTML = "";


    documentList.forEach(function (item) {

        const row =
            document.createElement("tr");


        /* Project Name */

        const projectCell =
            document.createElement("td");

        projectCell.textContent =
            item.projectName;


        /* Task ID */

        const taskIdCell =
            document.createElement("td");

        taskIdCell.textContent =
            item.taskId;


        /* Date */

        const dateCell =
            document.createElement("td");

        dateCell.textContent =
            item.date;


        /* Time */

        const timeCell =
            document.createElement("td");

        timeCell.textContent =
            item.time;


        /* Contact Person */

        const contactCell =
            document.createElement("td");

        contactCell.textContent =
            item.contactPerson;


        /* Type Of Task */

        const taskTypeCell =
            document.createElement("td");

        taskTypeCell.textContent =
            item.taskType;


        /* Document Type */

        const documentTypeCell =
            document.createElement("td");

        documentTypeCell.textContent =
            item.documentType;


        /* File Upload */

        const fileCell =
            document.createElement("td");


        if (item.fileName) {

            const status =
                document.createElement("span");

            status.className =
                "document-file-status uploaded";

            status.textContent =
                "Uploaded";


            const fileButton =
                document.createElement("button");

            fileButton.type =
                "button";

            fileButton.className =
                "document-file-button";

            fileButton.textContent =
                "View File";


            fileButton.addEventListener(
                "click",
                function () {

                    /*
                     * Abhi browser local file ko
                     * permanently store nahi karta.
                     *
                     * Google Drive integration ke baad
                     * yahan actual Drive file URL open hoga.
                     */

                    alert(
                        "File: " +
                        item.fileName
                    );

                }
            );


            fileCell.appendChild(status);

            fileCell.appendChild(
                document.createTextNode(" ")
            );

            fileCell.appendChild(
                fileButton
            );


        } else {

            const status =
                document.createElement("span");

            status.className =
                "document-file-status pending";

            status.textContent =
                "Pending";

            fileCell.appendChild(
                status
            );

        }


        row.appendChild(projectCell);

        row.appendChild(taskIdCell);

        row.appendChild(dateCell);

        row.appendChild(timeCell);

        row.appendChild(contactCell);

        row.appendChild(taskTypeCell);

        row.appendChild(documentTypeCell);

        row.appendChild(fileCell);


        documentTableBody.appendChild(row);

    });

}


/* =========================
   FILTER DOCUMENTS
========================= */

function filterDocuments() {

    const searchValue =
        documentSearch.value
            .trim()
            .toLowerCase();


    const filteredDocuments =
        documents.filter(function (item) {


            const searchMatch =

                item.projectName
                    .toLowerCase()
                    .includes(searchValue)

                ||

                item.taskId
                    .toLowerCase()
                    .includes(searchValue);


            return searchMatch;

        });


    showDocuments(
        filteredDocuments
    );

}


/* =========================
   MAIN SEARCH
========================= */

documentSearch.addEventListener(
    "input",
    function () {

        filterDocuments();

    }
);


/* =========================
   CLEAR SEARCH
========================= */

clearDocumentSearch.addEventListener(
    "click",
    function () {

        documentSearch.value = "";

        filterDocuments();

    }
);


/* =========================
   SAVE DOCUMENT
========================= */

addDocumentForm.addEventListener(
    "submit",
    function (event) {

        event.preventDefault();


        let selectedFile =
            documentFile.files[0];


        let fileName = "";


        if (selectedFile) {

            fileName =
                selectedFile.name;

        }


        const newDocument = {

            projectName:
                documentProjectName.value.trim(),

            taskId:
                documentTaskId.value.trim(),

            date:
                documentDate.value,

            time:
                documentTime.value,

            contactPerson:
                documentContactPerson.value.trim(),

            taskType:
                documentTaskType.value,

            documentType:
                documentType.value,

            fileName:
                fileName

        };


        documents.push(
            newDocument
        );


        localStorage.setItem(
            "crmDocuments",
            JSON.stringify(documents)
        );


        documentModal.style.display =
            "none";


        addDocumentForm.reset();


        filterDocuments();


        documentSuccessPopup.style.display =
            "flex";

    }
);


/* =========================
   SUCCESS POPUP
========================= */

documentSuccessClose.addEventListener(
    "click",
    function () {

        documentSuccessPopup.style.display =
            "none";

    }
);


/* =========================
   INITIAL LOAD
========================= */

documentDate.value =
    getCurrentDate();

documentTime.value =
    getCurrentTime();

showDocuments(
    documents
);
