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


    meetings.push(newMeeting);


    localStorage.setItem(
        "crmMeetings",
        JSON.stringify(meetings)
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


setDefaultMeetingValues();

renderMeetings();
