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
   GOOGLE DRIVE FOLDERS
========================= */

const driveFolders = {

    Audio:
        "https://drive.google.com/drive/folders/1HOPru8h1Vn6uZum6If8tlbw_b0YS2Diz?usp=sharing",

    Document:
        "https://drive.google.com/drive/folders/1GV2sDgeKrQ_uy_JWg6tD1I2LXnb3GJsN?usp=sharing",

    PDF:
        "https://drive.google.com/drive/folders/1GV2sDgeKrQ_uy_JWg6tD1I2LXnb3GJsN?usp=sharing",

    Image:
        "https://drive.google.com/drive/folders/1lm_EDSzFg_uN5jfQOZkchdZIe9OZWq2R?usp=sharing",

    Other:
        "https://drive.google.com/drive/folders/1iWzQXw_VERU8N0b9WDFsQeahLppixXNX?usp=sharing",

    Screenshot:
        "https://drive.google.com/drive/folders/1Hz16uXIwllb0--HLh6AQRgXcZo5X8dfx?usp=sharing",

    Video:
        "https://drive.google.com/drive/folders/1YJWBJleQ-yeFy3jy8jGJK-5ULbSwOv-l?usp=sharing"

};


/* =========================
   GOOGLE SHEET API
========================= */

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";


function generateDocumentId() {

    return "DOC_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);

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

                    success:
                        response.ok,

                    message:
                        text

                };

            }

        });

}


function syncDocumentWithGoogleSheet(action, documentData, oldDocumentData) {

    if (!GOOGLE_SHEET_API || !documentData) {

        return Promise.resolve(null);

    }

    const payload = {

        action:
            action,

        document: {

            documentId:
                documentData.documentId || "",

            projectName:
                documentData.projectName || "",

            taskId:
                documentData.taskId || "",

            estimationTime:
                documentData.estimationTime || "",

            date:
                documentData.date || "",

            time:
                documentData.time || "",

            contactPerson:
                documentData.contactPerson || "",

            taskType:
                documentData.taskType || "",

            documentType:
                documentData.documentType || "",

            fileName:
                documentData.fileName || ""

        },

        oldDocument:
            oldDocumentData
                ? {

                    documentId:
                        oldDocumentData.documentId || "",

                    projectName:
                        oldDocumentData.projectName || "",

                    taskId:
                        oldDocumentData.taskId || "",

                    estimationTime:
                        oldDocumentData.estimationTime || "",

                    date:
                        oldDocumentData.date || "",

                    time:
                        oldDocumentData.time || "",

                    contactPerson:
                        oldDocumentData.contactPerson || "",

                    taskType:
                        oldDocumentData.taskType || "",

                    documentType:
                        oldDocumentData.documentType || "",

                    fileName:
                        oldDocumentData.fileName || ""

                }
                : null

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
            "Google Sheet Document (" + action + "):",
            data
        );

        return data;

    })
    .catch(function (error) {

        console.error(
            "Google Sheet Document Sync Error (" + action + "):",
            error
        );

        return null;

    });

}


/* =========================
   DATA
========================= */

let documents = [];

const savedDocuments =
    localStorage.getItem("crmDocuments");

if (savedDocuments) {

    try {

        documents =
            JSON.parse(savedDocuments);

    } catch (error) {

        documents = [];

    }

}


function ensureDocumentIds() {

    let updated = false;

    documents.forEach(function (doc) {

        if (!doc.documentId) {

            doc.documentId = generateDocumentId();

            updated = true;

        }

    });

    if (updated) {

        localStorage.setItem(
            "crmDocuments",
            JSON.stringify(documents)
        );

    }

}

ensureDocumentIds();


/* =========================
   DATE
========================= */

function getCurrentDate() {

    const now =
        new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            now.getDate()
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;

}


/* =========================
   TIME
========================= */

function getCurrentTime() {

    const now =
        new Date();

    const hours =
        String(
            now.getHours()
        ).padStart(2, "0");

    const minutes =
        String(
            now.getMinutes()
        ).padStart(2, "0");

    return `${hours}:${minutes}`;

}


/* =========================
   OPEN GOOGLE DRIVE FOLDER
========================= */

function openDriveFolder(type) {

    const driveUrl =
        driveFolders[type];

    if (!driveUrl) {

        alert(
            "Google Drive folder is not configured for this document type."
        );

        return;

    }

    window.open(
        driveUrl,
        "_blank"
    );

}


/* =========================
   OPEN DOCUMENT DRIVE LOCATION
========================= */

function openDocumentLocation(item) {

    openDriveFolder(
        item.documentType
    );

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

    documentTableBody.innerHTML =
        "";


    documentList.forEach(
        function (item) {

            const row =
                document.createElement("tr");


            /* =========================
               PROJECT NAME
            ========================= */

            const projectCell =
                document.createElement("td");

            projectCell.textContent =
                item.projectName;


            /* =========================
               TASK ID
            ========================= */

            const taskIdCell =
                document.createElement("td");

            taskIdCell.textContent =
                item.taskId;


            /* =========================
               DATE
            ========================= */

            const dateCell =
                document.createElement("td");

            dateCell.textContent =
                item.date;


            /* =========================
               TIME
            ========================= */

            const timeCell =
                document.createElement("td");

            timeCell.textContent =
                item.time;


            /* =========================
               CONTACT PERSON
            ========================= */

            const contactCell =
                document.createElement("td");

            contactCell.textContent =
                item.contactPerson;


            /* =========================
               TYPE OF TASK
            ========================= */

            const taskTypeCell =
                document.createElement("td");

            taskTypeCell.textContent =
                item.taskType;


            /* =========================
               DOCUMENT TYPE
            ========================= */

            const documentTypeCell =
                document.createElement("td");

            documentTypeCell.textContent =
                item.documentType;


            /* =========================
               FILE UPLOAD
            ========================= */

            const fileCell =
                document.createElement("td");


            if (item.fileName) {

                /* Uploaded */

                const status =
                    document.createElement("span");

                status.className =
                    "document-file-status uploaded";

                status.textContent =
                    "Uploaded";


                /* View File */

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

                        openDocumentLocation(
                            item
                        );

                    }
                );


                /* Open Drive */

                const driveButton =
                    document.createElement("button");

                driveButton.type =
                    "button";

                driveButton.className =
                    "document-file-button";

                driveButton.textContent =
                    "Open Drive";


                driveButton.addEventListener(
                    "click",
                    function () {

                        openDriveFolder(
                            item.documentType
                        );

                    }
                );


                fileCell.appendChild(
                    status
                );

                fileCell.appendChild(
                    document.createTextNode(" ")
                );

                fileCell.appendChild(
                    fileButton
                );

                fileCell.appendChild(
                    document.createTextNode(" ")
                );

                fileCell.appendChild(
                    driveButton
                );


            } else {

                /* Pending */

                const status =
                    document.createElement("span");

                status.className =
                    "document-file-status pending";

                status.textContent =
                    "Pending";


                /* Open Drive */

                const driveButton =
                    document.createElement("button");

                driveButton.type =
                    "button";

                driveButton.className =
                    "document-file-button";

                driveButton.textContent =
                    "Open Drive";


                driveButton.addEventListener(
                    "click",
                    function () {

                        openDriveFolder(
                            item.documentType
                        );

                    }
                );


                fileCell.appendChild(
                    status
                );

                fileCell.appendChild(
                    document.createTextNode(" ")
                );

                fileCell.appendChild(
                    driveButton
                );

            }


            /* =========================
               ADD CELLS
            ========================= */

            row.appendChild(
                projectCell
            );

            row.appendChild(
                taskIdCell
            );

            row.appendChild(
                dateCell
            );

            row.appendChild(
                timeCell
            );

            row.appendChild(
                contactCell
            );

            row.appendChild(
                taskTypeCell
            );

            row.appendChild(
                documentTypeCell
            );

            row.appendChild(
                fileCell
            );


            documentTableBody.appendChild(
                row
            );

        }
    );

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
        documents.filter(
            function (item) {

                const searchMatch =

                    item.projectName
                        .toLowerCase()
                        .includes(
                            searchValue
                        )

                    ||

                    item.taskId
                        .toLowerCase()
                        .includes(
                            searchValue
                        );


                return searchMatch;

            }
        );


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

        documentSearch.value =
            "";

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


        /* =========================
           FILE REQUIRED
        ========================= */

        const selectedFile =
            documentFile.files[0];


        if (!selectedFile) {

            showError("Please select a document file.");

            return;

        }


        /* =========================
           DOCUMENT TYPE REQUIRED
        ========================= */

        const selectedDocumentType =
            documentType.value;


        if (!selectedDocumentType) {

            alert(
                "Please select a document type."
            );

            return;

        }


        /* =========================
           FILE NAME
        ========================= */

        const fileName =
            selectedFile.name;


        /* =========================
           NEW DOCUMENT
        ========================= */

        const newDocument = {

            documentId:
                generateDocumentId(),

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
                selectedDocumentType,

            fileName:
                fileName

        };


        /* =========================
           SAVE DOCUMENT
        ========================= */

        documents.unshift(
            newDocument
        );


        localStorage.setItem(
            "crmDocuments",
            JSON.stringify(
                documents
            )
        );


        syncDocumentWithGoogleSheet(
            "addDocument",
            newDocument
        );


        /* =========================
           CLOSE MODAL
        ========================= */

        documentModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        addDocumentForm.reset();


        /* =========================
           REFRESH TABLE
        ========================= */

        filterDocuments();


        /* =========================
           SUCCESS POPUP
        ========================= */

        documentSuccessPopup.style.display =
            "flex";


        /* =========================
           OPEN DRIVE FOLDER
        ========================= */

        openDriveFolder(
            selectedDocumentType
        );

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


/* ========================================
   LOGOUT
======================================== */

const logoutButton =
    document.getElementById(
        "logoutButton"
    );


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


/* ========================================
   DOCUMENT ROW CONTEXT MENU
======================================== */


/* =========================
   CONTEXT MENU
========================= */

const documentContextMenu =
    document.createElement("div");

documentContextMenu.id =
    "documentContextMenu";

documentContextMenu.innerHTML = `

    <button
        type="button"
        id="editDocumentContext"
    >

        <span>✏️</span>

        <span>
            Edit
        </span>

    </button>


    <button
        type="button"
        id="deleteDocumentContext"
    >

        <span>🗑️</span>

        <span>
            Delete
        </span>

    </button>

`;

document.body.appendChild(
    documentContextMenu
);


/* =========================
   EDIT MODE
========================= */

let editingDocumentIndex =
    null;


/* =========================
   SELECTED DOCUMENT
========================= */

let selectedDocumentItem =
    null;


/* =========================
   GET VISIBLE DOCUMENTS
========================= */

function getVisibleDocuments() {

    const searchValue =
        documentSearch.value
            .trim()
            .toLowerCase();


    return documents.filter(
        function (item) {

            return (

                item.projectName
                    .toLowerCase()
                    .includes(searchValue)

                ||

                item.taskId
                    .toLowerCase()
                    .includes(searchValue)

            );

        }
    );

}


/* =========================
   RIGHT CLICK ON ROW
========================= */

documentTableBody.addEventListener(
    "contextmenu",
    function (event) {

        const row =
            event.target.closest("tr");


        if (!row) {

            return;

        }


        event.preventDefault();


        const rows =
            Array.from(
                documentTableBody.querySelectorAll("tr")
            );


        const rowIndex =
            rows.indexOf(row);


        if (rowIndex === -1) {

            return;

        }


        const visibleDocuments =
            getVisibleDocuments();


        selectedDocumentItem =
            visibleDocuments[rowIndex];


        if (!selectedDocumentItem) {

            return;

        }


        /* =========================
           SHOW MENU
        ========================= */

        documentContextMenu.style.display =
            "block";


        /*
         * Prevent menu from going
         * outside right side of screen
         */

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


        documentContextMenu.style.left =
            left + "px";

        documentContextMenu.style.top =
            top + "px";

    }
);


/* =========================
   EDIT BUTTON
========================= */

document
    .getElementById(
        "editDocumentContext"
    )
    .addEventListener(
        "click",
        function () {

            if (
                !selectedDocumentItem
            ) {

                return;

            }


            /*
             * Find original index
             * inside main documents array
             */

            editingDocumentIndex =
                documents.indexOf(
                    selectedDocumentItem
                );


            if (
                editingDocumentIndex === -1
            ) {

                return;

            }


            /* =========================
               FILL EXISTING FORM
            ========================= */

            documentProjectName.value =
                selectedDocumentItem.projectName;


            documentTaskId.value =
                selectedDocumentItem.taskId;


            documentDate.value =
                selectedDocumentItem.date;


            documentTime.value =
                selectedDocumentItem.time;


            documentContactPerson.value =
                selectedDocumentItem.contactPerson;


            documentTaskType.value =
                selectedDocumentItem.taskType;


            documentType.value =
                selectedDocumentItem.documentType;


            /* =========================
               DISABLE FILE INPUT
            ========================= */

            documentFile.value =
                "";

            documentFile.disabled =
                true;

            documentFile.required =
                false;


            /* =========================
               CHANGE SAVE BUTTON TEXT
            ========================= */

            const saveButton =
                addDocumentForm.querySelector(
                    'button[type="submit"]'
                );


            if (saveButton) {

                saveButton.textContent =
                    "Update Document";

            }


            /* =========================
               OPEN SAME MODAL
            ========================= */

            documentModal.style.display =
                "flex";


            /* =========================
               CLOSE CONTEXT MENU
            ========================= */

            documentContextMenu.style.display =
                "none";

        }
    );


/* =========================
   UPDATE DOCUMENT
========================= */

addDocumentForm.addEventListener(
    "submit",
    function (event) {

        /*
         * Capture mode ka main purpose:
         *
         * Existing SAVE handler se pehle
         * Edit ko handle karna.
         */

    },
    true
);


/*
 * Separate capture listener
 * actual edit logic ke liye.
 */

addDocumentForm.addEventListener(
    "submit",
    function (event) {

        if (
            editingDocumentIndex === null
        ) {

            return;

        }


        /*
         * Existing normal SAVE handler
         * ko stop karo.
         */

        event.preventDefault();

        event.stopImmediatePropagation();


        const currentDocument =
            documents[
                editingDocumentIndex
            ];


        if (!currentDocument) {

            return;

        }


        /* =========================
           UPDATE EXISTING DATA
        ========================= */

        const oldDocument = {

            documentId:
                currentDocument.documentId || "",

            projectName:
                currentDocument.projectName || "",

            taskId:
                currentDocument.taskId || "",

            estimationTime:
                currentDocument.estimationTime || "",

            date:
                currentDocument.date || "",

            time:
                currentDocument.time || "",

            contactPerson:
                currentDocument.contactPerson || "",

            taskType:
                currentDocument.taskType || "",

            documentType:
                currentDocument.documentType || "",

            fileName:
                currentDocument.fileName || ""

        };


        currentDocument.projectName =
            documentProjectName.value.trim();


        currentDocument.taskId =
            documentTaskId.value.trim();


        currentDocument.date =
            documentDate.value;


        currentDocument.time =
            documentTime.value;


        currentDocument.contactPerson =
            documentContactPerson.value.trim();


        currentDocument.taskType =
            documentTaskType.value;


        currentDocument.documentType =
            documentType.value;


        /*
         * IMPORTANT:
         *
         * File name ko change nahi kar rahe.
         *
         * Existing document ka
         * original fileName preserve rahega.
         */


        /* =========================
           SAVE UPDATED DATA
        ========================= */

        localStorage.setItem(
            "crmDocuments",
            JSON.stringify(
                documents
            )
        );


        syncDocumentWithGoogleSheet(
            "updateDocument",
            currentDocument,
            oldDocument
        );


        /* =========================
           EXIT EDIT MODE
        ========================= */

        editingDocumentIndex =
            null;


        selectedDocumentItem =
            null;


        /* =========================
           ENABLE FILE INPUT
        ========================= */

        documentFile.disabled =
            false;

        documentFile.required =
            true;


        /* =========================
           RESTORE BUTTON TEXT
        ========================= */

        const saveButton =
            addDocumentForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.textContent =
                "Save Document";

        }


        /* =========================
           CLOSE MODAL
        ========================= */

        documentModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        addDocumentForm.reset();


        /* =========================
           RESTORE DATE & TIME
        ========================= */

        documentDate.value =
            getCurrentDate();

        documentTime.value =
            getCurrentTime();


        /* =========================
           REFRESH TABLE
        ========================= */

        filterDocuments();


        /* =========================
           SUCCESS POPUP
        ========================= */

        documentSuccessPopup.style.display =
            "flex";

    },
    true
);


/* =========================
   DELETE SELECTED DOCUMENT
========================= */

function deleteSelectedDocument() {

    if (
        !selectedDocumentItem
    ) {

        return;

    }

    const documentIndex =
        documents.indexOf(
            selectedDocumentItem
        );

    if (
        documentIndex === -1
    ) {

        return;

    }

    const documentToDelete =
        documents[
            documentIndex
        ];

    /* =========================
       DELETE DOCUMENT
    ========================= */

    documents.splice(
        documentIndex,
        1
    );

    /* =========================
       UPDATE LOCAL STORAGE
    ========================= */

    localStorage.setItem(
        "crmDocuments",
        JSON.stringify(
            documents
        )
    );

    /* =========================
       GOOGLE SHEET SYNC
    ========================= */

    syncDocumentWithGoogleSheet(
        "deleteDocument",
        documentToDelete
    );

    /* =========================
       CLEAR SELECTION
    ========================= */

    selectedDocumentItem =
        null;

    /* =========================
       CLOSE MENU
    ========================= */

    if (documentContextMenu) {

        documentContextMenu.style.display =
            "none";

    }

    /* =========================
       REFRESH TABLE
    ========================= */

    filterDocuments();

}


/* =========================
   DELETE BUTTON
========================= */

document
    .getElementById(
        "deleteDocumentContext"
    )
    .addEventListener(
        "click",
        function () {

            if (
                !selectedDocumentItem
            ) {

                return;

            }

            if (documentContextMenu) {

                documentContextMenu.style.display =
                    "none";

            }

            showDocumentConfirmation(
                "delete"
            );

        }
    );


/* =========================
   CLOSE CONTEXT MENU
========================= */

document.addEventListener(
    "click",
    function (event) {

        if (
            !documentContextMenu.contains(
                event.target
            )
        ) {

            documentContextMenu.style.display =
                "none";

        }

    }
);


/* =========================
   ESCAPE KEY
========================= */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key === "Escape"
        ) {

            documentContextMenu.style.display =
                "none";

        }

    }
);


/* =========================
   RESTORE FORM AFTER CANCEL
========================= */

cancelDocumentForm.addEventListener(
    "click",
    function () {

        editingDocumentIndex =
            null;

        selectedDocumentItem =
            null;


        documentFile.disabled =
            false;

        documentFile.required =
            true;


        const saveButton =
            addDocumentForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.textContent =
                "Save Document";

        }

    }
);


/* =========================
   RESTORE FORM AFTER CLOSE
========================= */

closeDocumentForm.addEventListener(
    "click",
    function () {

        editingDocumentIndex =
            null;

        selectedDocumentItem =
            null;


        documentFile.disabled =
            false;

        documentFile.required =
            true;


        const saveButton =
            addDocumentForm.querySelector(
                'button[type="submit"]'
            );


        if (saveButton) {

            saveButton.textContent =
                "Save Document";

        }

    }
);

/* ========================================
   DOCUMENT ACTION CONFIRMATION
======================================== */


/* =========================
   ELEMENTS
========================= */

const documentConfirmModal =
    document.getElementById(
        "documentConfirmModal"
    );

const documentConfirmTitle =
    document.getElementById(
        "documentConfirmTitle"
    );

const documentConfirmMessage =
    document.getElementById(
        "documentConfirmMessage"
    );

const documentConfirmIcon =
    document.getElementById(
        "documentConfirmIcon"
    );

const documentConfirmCancel =
    document.getElementById(
        "documentConfirmCancel"
    );

const documentConfirmOk =
    document.getElementById(
        "documentConfirmOk"
    );


/* =========================
   PENDING ACTION
========================= */

let documentPendingAction =
    null;


/* =========================
   SHOW CONFIRMATION
========================= */

function showDocumentConfirmation(
    action
) {

    documentPendingAction =
        action;


    if (action === "edit") {

        documentConfirmIcon.textContent =
            "✏️";

        documentConfirmTitle.textContent =
            "Confirm Edit";

        documentConfirmMessage.textContent =
            "Are you sure you want to edit this document?";

        documentConfirmOk.textContent =
            "Edit";

    }


    if (action === "delete") {

        documentConfirmIcon.textContent =
            "🗑️";

        documentConfirmTitle.textContent =
            "Confirm Delete";

        documentConfirmMessage.textContent =
            "Are you sure you want to delete this document?";

        documentConfirmOk.textContent =
            "Delete";

    }


    documentConfirmModal.style.display =
        "flex";

}


/* =========================
   CANCEL
========================= */

documentConfirmCancel.addEventListener(
    "click",
    function () {

        documentPendingAction =
            null;

        documentConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CONFIRM
========================= */

documentConfirmOk.addEventListener(
    "click",
    function () {

        if (
            documentPendingAction === "edit"
        ) {

            documentConfirmModal.style.display =
                "none";

            documentPendingAction =
                null;


            /*
             * Existing Edit button ko
             * programmatically trigger
             * karenge.
             */

            document
                .getElementById(
                    "editDocumentContext"
                )
                .click();

        }


        else if (
            documentPendingAction === "delete"
        ) {

            documentConfirmModal.style.display =
                "none";

            documentPendingAction =
                null;

            deleteSelectedDocument();

        }

    }
);


/* =========================
   CLOSE ON BACKDROP
========================= */

documentConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            documentConfirmModal
        ) {

            documentPendingAction =
                null;

            documentConfirmModal.style.display =
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
            event.key === "Escape" &&
            documentConfirmModal.style.display ===
                "flex"
        ) {

            documentPendingAction =
                null;

            documentConfirmModal.style.display =
                "none";

        }

    }
);



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