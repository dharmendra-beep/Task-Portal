/* =========================
   MEETING MANAGEMENT
========================= */


/* =========================
   ELEMENTS
========================= */

const meetingTabs = document.querySelectorAll(".meeting-tab");

const meetingSearch = document.getElementById("meetingSearch");
const clearMeetingSearch = document.getElementById("clearMeetingSearch");

const meetingTableBody = document.getElementById("meetingTableBody");

const addMeetingButton = document.getElementById("addMeetingButton");

const meetingModal = document.getElementById("meetingModal");
const closeMeetingForm = document.getElementById("closeMeetingForm");
const cancelMeetingForm = document.getElementById("cancelMeetingForm");

const addMeetingForm = document.getElementById("addMeetingForm");

const meetingType = document.getElementById("meetingType");
const meetingNo = document.getElementById("meetingNo");

const meetingProjectName = document.getElementById("meetingProjectName");
const representativeName = document.getElementById("representativeName");
const numberOfParticipants = document.getElementById("numberOfParticipants");
const participantNames = document.getElementById("participantNames");

const meetingCreatedDate = document.getElementById("meetingCreatedDate");
const meetingCreatedTime = document.getElementById("meetingCreatedTime");

const meetingScheduleDate = document.getElementById("meetingScheduleDate");
const meetingScheduleTime = document.getElementById("meetingScheduleTime");

const meetingAddress = document.getElementById("meetingAddress");
const meetingExpenses = document.getElementById("meetingExpenses");

const meetingAddressGroup = document.getElementById("meetingAddressGroup");
const meetingExpensesGroup = document.getElementById("meetingExpensesGroup");

const meetingSuccessPopup = document.getElementById("meetingSuccessPopup");
const meetingSuccessClose = document.getElementById("meetingSuccessClose");


/* =========================
   GOOGLE SHEET API
========================= */

const GOOGLE_SHEET_API =
    "https://script.google.com/macros/s/AKfycby8cJ4zR8qaMsqQVW2znigEjvnHx2uiOnVfOmY2xpT35or-zpK2MOFPrRRQiZjWfvKH4Q/exec";


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


function syncMeetingWithGoogleSheet(action, meeting) {

    if (!GOOGLE_SHEET_API || !meeting) {

        return Promise.resolve(null);

    }

    const payload = {

        action:
            action,

        meeting: {

            meetingNo:
                meeting.meetingNo || "",

            projectName:
                meeting.projectName || "",

            representativeName:
                meeting.representativeName || "",

            numberOfParticipants:
                meeting.numberOfParticipants !== undefined &&
                meeting.numberOfParticipants !== null
                    ? meeting.numberOfParticipants
                    : "",

            participantNames:
                meeting.participantNames || "",

            createdDate:
                meeting.createdDate || "",

            createdTime:
                meeting.createdTime || "",

            scheduleDate:
                meeting.scheduleDate || "",

            scheduleTime:
                meeting.scheduleTime || "",

            address:
                meeting.address !== undefined &&
                meeting.address !== null &&
                meeting.address !== ""
                    ? meeting.address
                    : "-",

            expenses:
                meeting.expenses !== undefined &&
                meeting.expenses !== null &&
                meeting.expenses !== ""
                    ? meeting.expenses
                    : "-",

            meetingType:
                meeting.meetingType || ""

        }

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
            "Google Sheet Meeting (" + action + "):",
            data
        );

        return data;

    })
    .catch(function (error) {

        console.error(
            "Google Sheet Meeting Sync Error (" + action + "):",
            error
        );

        return null;

    });

}


/* =========================
   DATA
========================= */

let meetings = [];

const savedMeetings = localStorage.getItem("crmMeetings");

if (savedMeetings) {
    try {
        meetings = JSON.parse(savedMeetings);
    } catch (error) {
        meetings = [];
    }
}


/* =========================
   CURRENT TAB
========================= */

let currentMeetingType = "Online Meeting";


/* =========================
   DATE / TIME
========================= */


function getCurrentDate() {

    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function getCurrentTime() {

    const now = new Date();

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
}


/* =========================
   MEETING NUMBER
   M001001
   M001002
   M001003 ...
========================= */

function generateMeetingNumber() {

    if (meetings.length === 0) {
        return "M001001";
    }

    let highestNumber = 1000;

    meetings.forEach(function (meeting) {

        if (!meeting.meetingNo) {
            return;
        }

        const numberPart = parseInt(
            meeting.meetingNo.replace("M", ""),
            10
        );

        if (!isNaN(numberPart) && numberPart > highestNumber) {
            highestNumber = numberPart;
        }

    });

    return "M" + String(highestNumber + 1).padStart(6, "0");
}


/* =========================
   FORM DEFAULT VALUES
========================= */

function setDefaultMeetingValues() {

    meetingNo.value = generateMeetingNumber();

    meetingCreatedDate.value = getCurrentDate();

    meetingCreatedTime.value = getCurrentTime();

    meetingType.value = currentMeetingType;

    updateMeetingTypeFields();
}


/* =========================
   ONLINE / PHYSICAL LOGIC
========================= */

function updateMeetingTypeFields() {

    const isPhysical = meetingType.value === "Physical Meeting";

    if (isPhysical) {

        meetingAddress.disabled = false;
        meetingExpenses.disabled = false;

        meetingAddress.required = true;
        meetingExpenses.required = true;

        meetingAddressGroup.style.display = "flex";
        meetingExpensesGroup.style.display = "flex";

    } else {

        meetingAddress.disabled = true;
        meetingExpenses.disabled = true;

        meetingAddress.required = false;
        meetingExpenses.required = false;

        meetingAddress.value = "";
        meetingExpenses.value = "";

        meetingAddressGroup.style.display = "flex";
        meetingExpensesGroup.style.display = "flex";
    }
}


/* =========================
   TAB FILTER
========================= */

function renderMeetings() {

    const searchText = meetingSearch.value
        .trim()
        .toLowerCase();

    const filteredMeetings = meetings.filter(function (meeting) {

        const typeMatch =
            meeting.meetingType === currentMeetingType;

        const searchMatch =
            meeting.meetingNo.toLowerCase().includes(searchText) ||
            meeting.projectName.toLowerCase().includes(searchText);

        return typeMatch && searchMatch;

    });

    showMeetings(filteredMeetings);
}


/* =========================
   SHOW TABLE DATA
========================= */

function showMeetings(meetingList) {

    meetingTableBody.innerHTML = "";

    if (meetingList.length === 0) {
        return;
    }

    meetingList.forEach(function (meeting) {

        const row = document.createElement("tr");


        const meetingNoCell = document.createElement("td");
        meetingNoCell.textContent = meeting.meetingNo;


        const projectCell = document.createElement("td");
        projectCell.textContent = meeting.projectName;


        const representativeCell = document.createElement("td");
        representativeCell.textContent = meeting.representativeName;


        const participantsNumberCell = document.createElement("td");
        participantsNumberCell.textContent =
            meeting.numberOfParticipants;


        const participantsNameCell = document.createElement("td");
        participantsNameCell.textContent =
            meeting.participantNames;


        const createdDateCell = document.createElement("td");
        createdDateCell.textContent = meeting.createdDate;


        const createdTimeCell = document.createElement("td");
        createdTimeCell.textContent = meeting.createdTime;


        const scheduleDateCell = document.createElement("td");
        scheduleDateCell.textContent = meeting.scheduleDate;


        const scheduleTimeCell = document.createElement("td");
        scheduleTimeCell.textContent = meeting.scheduleTime;


        const addressCell = document.createElement("td");
        addressCell.textContent =
            meeting.address || "-";


        const expensesCell = document.createElement("td");
        expensesCell.textContent =
            meeting.expenses !== ""
                ? meeting.expenses
                : "-";


        row.appendChild(meetingNoCell);
        row.appendChild(projectCell);
        row.appendChild(representativeCell);
        row.appendChild(participantsNumberCell);
        row.appendChild(participantsNameCell);
        row.appendChild(createdDateCell);
        row.appendChild(createdTimeCell);
        row.appendChild(scheduleDateCell);
        row.appendChild(scheduleTimeCell);
        row.appendChild(addressCell);
        row.appendChild(expensesCell);

        meetingTableBody.appendChild(row);

    });
}


/* =========================
   TAB CLICK
========================= */

meetingTabs.forEach(function (tab) {

    tab.addEventListener("click", function () {

        meetingTabs.forEach(function (item) {
            item.classList.remove("active");
        });

        tab.classList.add("active");

        currentMeetingType =
            tab.dataset.meetingType;

        meetingType.value =
            currentMeetingType;

        renderMeetings();

    });

});


/* =========================
   MEETING TYPE CHANGE
========================= */

meetingType.addEventListener("change", function () {

    updateMeetingTypeFields();

});


/* =========================
   SEARCH
========================= */

meetingSearch.addEventListener("input", function () {

    renderMeetings();

});


/* =========================
   CLEAR SEARCH
========================= */

clearMeetingSearch.addEventListener("click", function () {

    meetingSearch.value = "";

    renderMeetings();

});


/* =========================
   OPEN MODAL
========================= */

addMeetingButton.addEventListener("click", function () {

    addMeetingForm.reset();

    setDefaultMeetingValues();

    meetingModal.style.display = "flex";

});


/* =========================
   CLOSE MODAL
========================= */

closeMeetingForm.addEventListener("click", function () {

    meetingModal.style.display = "none";

});


cancelMeetingForm.addEventListener("click", function () {

    meetingModal.style.display = "none";

});


/* =========================
   SAVE MEETING
========================= */

addMeetingForm.addEventListener("submit", function (event) {

    event.preventDefault();


    const newMeeting = {

        meetingType: meetingType.value,

        meetingNo: meetingNo.value,

        projectName: meetingProjectName.value.trim(),

        representativeName:
            representativeName.value.trim(),

        numberOfParticipants:
            numberOfParticipants.value,

        participantNames:
            participantNames.value.trim(),

        createdDate:
            meetingCreatedDate.value,

        createdTime:
            meetingCreatedTime.value,

        scheduleDate:
            meetingScheduleDate.value,

        scheduleTime:
            meetingScheduleTime.value,

        address:
            meetingAddress.value.trim(),

        expenses:
            meetingExpenses.value

    };


    meetings.unshift(newMeeting);


    localStorage.setItem(
        "crmMeetings",
        JSON.stringify(meetings)
    );


    syncMeetingWithGoogleSheet(
        "addMeeting",
        newMeeting
    );


    currentMeetingType = newMeeting.meetingType;


    meetingTabs.forEach(function (tab) {

        tab.classList.remove("active");

        if (
            tab.dataset.meetingType ===
            currentMeetingType
        ) {
            tab.classList.add("active");
        }

    });


    meetingModal.style.display = "none";


    addMeetingForm.reset();


    renderMeetings();


    meetingSuccessPopup.style.display = "flex";

});


/* =========================
   SUCCESS POPUP
========================= */

meetingSuccessClose.addEventListener("click", function () {

    meetingSuccessPopup.style.display = "none";

});


/* =========================
   INITIAL LOAD
========================= */

meetingTabs.forEach(function (tab) {

    if (
        tab.dataset.meetingType ===
        currentMeetingType
    ) {
        tab.classList.add("active");
    } else {
        tab.classList.remove("active");
    }

});




renderMeetings();

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

/* ========================================
   MEETING RIGHT CLICK MENU
======================================== */


/* =========================
   ELEMENTS
========================= */

const meetingContextMenu =
    document.getElementById(
        "meetingContextMenu"
    );

const editMeetingContext =
    document.getElementById(
        "editMeetingContext"
    );

const deleteMeetingContext =
    document.getElementById(
        "deleteMeetingContext"
    );


const meetingConfirmModal =
    document.getElementById(
        "meetingConfirmModal"
    );

const meetingConfirmIcon =
    document.getElementById(
        "meetingConfirmIcon"
    );

const meetingConfirmTitle =
    document.getElementById(
        "meetingConfirmTitle"
    );

const meetingConfirmMessage =
    document.getElementById(
        "meetingConfirmMessage"
    );

const meetingConfirmCancel =
    document.getElementById(
        "meetingConfirmCancel"
    );

const meetingConfirmOk =
    document.getElementById(
        "meetingConfirmOk"
    );


/* =========================
   SELECTED MEETING
========================= */

let selectedMeeting =
    null;

let selectedMeetingIndex =
    null;


/* =========================
   EDIT MODE
========================= */

let meetingEditMode =
    false;


/* =========================
   PENDING ACTION
========================= */

let meetingPendingAction =
    null;


/* =========================
   RIGHT CLICK ON TABLE ROW
========================= */

meetingTableBody.addEventListener(
    "contextmenu",
    function (event) {

        const row =
            event.target.closest("tr");


        if (!row) {

            return;

        }


        event.preventDefault();


        /*
         * Meeting number is the
         * first cell of every row.
         */

        const firstCell =
            row.querySelector("td");


        if (!firstCell) {

            return;

        }


        const meetingNumber =
            firstCell.textContent.trim();


        if (!meetingNumber) {

            return;

        }


        /*
         * Find the original meeting
         * inside the main array.
         */

        const foundMeeting =
            meetings.find(
                function (meeting) {

                    return (
                        meeting.meetingNo ===
                        meetingNumber
                    );

                }
            );


        if (!foundMeeting) {

            return;

        }


        selectedMeeting =
            foundMeeting;


        selectedMeetingIndex =
            meetings.indexOf(
                foundMeeting
            );


        if (
            selectedMeetingIndex === -1
        ) {

            return;

        }


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


        meetingContextMenu.style.left =
            left + "px";

        meetingContextMenu.style.top =
            top + "px";


        meetingContextMenu.style.display =
            "block";

    }
);


/* =========================
   SHOW CONFIRMATION
========================= */

function showMeetingConfirmation(
    action
) {

    meetingPendingAction =
        action;


    if (action === "edit") {

        meetingConfirmIcon.textContent =
            "✏️";

        meetingConfirmTitle.textContent =
            "Confirm Edit";

        meetingConfirmMessage.textContent =
            "Are you sure you want to edit this meeting?";

        meetingConfirmOk.textContent =
            "Edit";

    }


    if (action === "delete") {

        meetingConfirmIcon.textContent =
            "🗑️";

        meetingConfirmTitle.textContent =
            "Confirm Delete";

        meetingConfirmMessage.textContent =
            "Are you sure you want to delete this meeting?";

        meetingConfirmOk.textContent =
            "Delete";

    }


    meetingConfirmModal.style.display =
        "flex";

}


/* =========================
   EDIT MENU BUTTON
========================= */

editMeetingContext.addEventListener(
    "click",
    function () {

        if (!selectedMeeting) {

            return;

        }


        meetingContextMenu.style.display =
            "none";


        showMeetingConfirmation(
            "edit"
        );

    }
);


/* =========================
   DELETE MENU BUTTON
========================= */

deleteMeetingContext.addEventListener(
    "click",
    function () {

        if (!selectedMeeting) {

            return;

        }


        meetingContextMenu.style.display =
            "none";


        showMeetingConfirmation(
            "delete"
        );

    }
);


/* =========================
   START MEETING EDIT
========================= */

function startMeetingEdit() {

    if (
        !selectedMeeting ||
        selectedMeetingIndex === null
    ) {

        return;

    }


    meetingEditMode =
        true;


    /* =========================
       FILL EXISTING FORM
    ========================= */

    meetingType.value =
        selectedMeeting.meetingType;


    meetingNo.value =
        selectedMeeting.meetingNo;


    meetingProjectName.value =
        selectedMeeting.projectName;


    representativeName.value =
        selectedMeeting.representativeName;


    numberOfParticipants.value =
        selectedMeeting.numberOfParticipants;


    participantNames.value =
        selectedMeeting.participantNames;


    meetingCreatedDate.value =
        selectedMeeting.createdDate;


    meetingCreatedTime.value =
        selectedMeeting.createdTime;


    meetingScheduleDate.value =
        selectedMeeting.scheduleDate;


    meetingScheduleTime.value =
        selectedMeeting.scheduleTime;


    meetingAddress.value =
        selectedMeeting.address || "";


    meetingExpenses.value =
        selectedMeeting.expenses || "";


    /*
     * Re-apply Online / Physical
     * field conditions.
     */

    updateMeetingTypeFields();


    /* =========================
       MEETING NUMBER
       =========================
       
       Existing meeting number remains
       unchanged during edit.
    */

    meetingNo.value =
        selectedMeeting.meetingNo;


    /* =========================
       FORM TITLE
    ========================= */

    const meetingFormTitle =
        document.querySelector(
            ".meeting-form-header h2"
        );


    if (meetingFormTitle) {

        meetingFormTitle.textContent =
            "Edit Meeting";

    }


    /* =========================
       SAVE BUTTON
    ========================= */

    const meetingSaveButton =
        addMeetingForm.querySelector(
            'button[type="submit"]'
        );


    if (meetingSaveButton) {

        meetingSaveButton.textContent =
            "Update Meeting";

    }


    /* =========================
       OPEN MODAL
    ========================= */

    meetingModal.style.display =
        "flex";

}


/* =========================
   CONFIRM BUTTON
========================= */

meetingConfirmOk.addEventListener(
    "click",
    function () {

        if (
            meetingPendingAction ===
            "edit"
        ) {

            meetingConfirmModal.style.display =
                "none";

            meetingPendingAction =
                null;


            startMeetingEdit();

            return;

        }


        if (
            meetingPendingAction ===
            "delete"
        ) {

            meetingConfirmModal.style.display =
                "none";

            meetingPendingAction =
                null;


            deleteSelectedMeeting();

        }

    }
);


/* =========================
   DELETE MEETING
========================= */

function deleteSelectedMeeting() {

    if (
        selectedMeetingIndex === null
    ) {

        return;

    }

    const meetingToDelete =
        meetings[selectedMeetingIndex];

    if (!meetingToDelete) {
        return;
    }

    meetings.splice(
        selectedMeetingIndex,
        1
    );


    localStorage.setItem(
        "crmMeetings",
        JSON.stringify(
            meetings
        )
    );


    syncMeetingWithGoogleSheet(
        "deleteMeeting",
        meetingToDelete
    );


    selectedMeeting =
        null;

    selectedMeetingIndex =
        null;


    /*
     * Existing tab/search system
     * refresh karega.
     */

    renderMeetings();

}


/* =========================
   CANCEL CONFIRMATION
========================= */

meetingConfirmCancel.addEventListener(
    "click",
    function () {

        meetingPendingAction =
            null;

        meetingConfirmModal.style.display =
            "none";

    }
);


/* =========================
   CLOSE ON BACKDROP
========================= */

meetingConfirmModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            meetingConfirmModal
        ) {

            meetingPendingAction =
                null;

            meetingConfirmModal.style.display =
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
            !meetingContextMenu.contains(
                event.target
            )
        ) {

            meetingContextMenu.style.display =
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

            meetingContextMenu.style.display =
                "none";

            meetingConfirmModal.style.display =
                "none";

            meetingPendingAction =
                null;

        }

    }
);


/* =========================
   EDIT SUBMIT INTERCEPT
========================= */

addMeetingForm.addEventListener(
    "submit",
    function (event) {

        if (!meetingEditMode) {

            return;

        }


        /*
         * Existing ADD logic ko
         * edit mode mein run nahi hone denge.
         */

        event.preventDefault();

        event.stopImmediatePropagation();


        if (
            selectedMeetingIndex === null
        ) {

            return;

        }


        const meeting =
            meetings[
                selectedMeetingIndex
            ];


        if (!meeting) {

            return;

        }


        /* =========================
           UPDATE SAME MEETING
        ========================= */

        meeting.meetingType =
            meetingType.value;


        /*
         * Meeting number intentionally
         * same rakha gaya hai.
         */

        meeting.meetingNo =
            selectedMeeting.meetingNo;


        meeting.projectName =
            meetingProjectName.value.trim();


        meeting.representativeName =
            representativeName.value.trim();


        meeting.numberOfParticipants =
            numberOfParticipants.value;


        meeting.participantNames =
            participantNames.value.trim();


        meeting.createdDate =
            meetingCreatedDate.value;


        meeting.createdTime =
            meetingCreatedTime.value;


        meeting.scheduleDate =
            meetingScheduleDate.value;


        meeting.scheduleTime =
            meetingScheduleTime.value;


        meeting.address =
            meetingAddress.value.trim();


        meeting.expenses =
            meetingExpenses.value;


        /* =========================
           SAVE
        ========================= */

        localStorage.setItem(
            "crmMeetings",
            JSON.stringify(
                meetings
            )
        );


        syncMeetingWithGoogleSheet(
            "updateMeeting",
            meeting
        );


        /* =========================
           UPDATE CURRENT TAB
        ========================= */

        currentMeetingType =
            meeting.meetingType;


        meetingTabs.forEach(
            function (tab) {

                tab.classList.remove(
                    "active"
                );


                if (
                    tab.dataset.meetingType ===
                    currentMeetingType
                ) {

                    tab.classList.add(
                        "active"
                    );

                }

            }
        );


        /* =========================
           EXIT EDIT MODE
        ========================= */

        meetingEditMode =
            false;


        selectedMeeting =
            null;

        selectedMeetingIndex =
            null;


        /* =========================
           CLOSE MODAL
        ========================= */

        meetingModal.style.display =
            "none";


        /* =========================
           RESET FORM
        ========================= */

        addMeetingForm.reset();


        /* =========================
           RESTORE DEFAULT VALUES
        ========================= */

        


        /* =========================
           RESTORE FORM TITLE
        ========================= */

        const meetingFormTitle =
            document.querySelector(
                ".meeting-form-header h2"
            );


        if (meetingFormTitle) {

            meetingFormTitle.textContent =
                "Add New Meeting";

        }


        /* =========================
           RESTORE BUTTON
        ========================= */

        const meetingSaveButton =
            addMeetingForm.querySelector(
                'button[type="submit"]'
            );


        if (meetingSaveButton) {

            meetingSaveButton.textContent =
                "Save Meeting";

        }


        /* =========================
           REFRESH TABLE
        ========================= */

        renderMeetings();


        /* =========================
           SUCCESS POPUP
        ========================= */

        meetingSuccessPopup.style.display =
            "flex";

    },
    true
);


/* =========================
   RESET EDIT MODE
========================= */

function resetMeetingEditMode() {

    meetingEditMode =
        false;

    selectedMeeting =
        null;

    selectedMeetingIndex =
        null;


    const meetingFormTitle =
        document.querySelector(
            ".meeting-form-header h2"
        );


    if (meetingFormTitle) {

        meetingFormTitle.textContent =
            "Add New Meeting";

    }


    const meetingSaveButton =
        addMeetingForm.querySelector(
            'button[type="submit"]'
        );


    if (meetingSaveButton) {

        meetingSaveButton.textContent =
            "Save Meeting";

    }

}


/* =========================
   CANCEL EDIT
========================= */

cancelMeetingForm.addEventListener(
    "click",
    function () {

        resetMeetingEditMode();

    }
);


/* =========================
   CLOSE EDIT
========================= */

closeMeetingForm.addEventListener(
    "click",
    function () {

        resetMeetingEditMode();

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
