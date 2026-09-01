function doPost(e) {

  try {

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    if (!e || !e.postData || !e.postData.contents) {
      return response("No post data received", false);
    }

    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    // Helper: Find sheet case/space-insensitively or insert
    function getTargetSheet(candidateNames, defaultNameToCreate) {
      for (let i = 0; i < candidateNames.length; i++) {
        const s = ss.getSheetByName(candidateNames[i]);
        if (s) return s;
      }
      const allSheets = ss.getSheets();
      for (let i = 0; i < allSheets.length; i++) {
        const cleanName = allSheets[i].getName().trim().toLowerCase().replace(/[-_ ]+/g, " ");
        for (let j = 0; j < candidateNames.length; j++) {
          const cleanTarget = candidateNames[j].trim().toLowerCase().replace(/[-_ ]+/g, " ");
          if (cleanName === cleanTarget) {
            return allSheets[i];
          }
        }
      }
      if (defaultNameToCreate) {
        return ss.insertSheet(defaultNameToCreate);
      }
      return null;
    }

    // =====================================================
    // TASK PORTAL DB
    // =====================================================

    if (
      action === "add" ||
      action === "update" ||
      action === "delete"
    ) {

      const sheet = getTargetSheet(["Task Portal DB"], "Task Portal DB");
      const task = data.task || {};

      if (action === "add") {

        sheet.appendRow([
          task.projectName || "",
          task.taskId || "",
          task.createdDate || "",
          task.estimationDate || "",
          task.estimationAssign || "",
          task.developer || "",
          task.workingTime || "",
          task.receiveDate || "",
          task.receiveTime || "",
          task.apkDate || "",
          task.apkTime || "",
          task.relatedTo || "",
          task.contactPerson || "",
          task.status || "",
          task.pendingType || ""
        ]);

        return response("Task added successfully");
      }

      if (action === "update") {

        const values = sheet.getDataRange().getValues();

        for (let i = 1; i < values.length; i++) {

          if (String(values[i][1]) === String(task.taskId)) {

            sheet
              .getRange(i + 1, 1, 1, 15)
              .setValues([[
                task.projectName || "",
                task.taskId || "",
                task.createdDate || "",
                task.estimationDate || "",
                task.estimationAssign || "",
                task.developer || "",
                task.workingTime || "",
                task.receiveDate || "",
                task.receiveTime || "",
                task.apkDate || "",
                task.apkTime || "",
                task.relatedTo || "",
                task.contactPerson || "",
                task.status || "",
                task.pendingType || ""
              ]]);

            return response("Task updated successfully");
          }
        }

        return response("Task not found");
      }

      if (action === "delete") {

        const values = sheet.getDataRange().getValues();

        for (let i = 1; i < values.length; i++) {

          if (String(values[i][1]) === String(task.taskId)) {

            sheet.deleteRow(i + 1);
            return response("Task deleted successfully");
          }
        }

        return response("Task not found");
      }
    }

    // =====================================================
    // PROJECTS
    // =====================================================

    if (
      action === "addProject" ||
      action === "updateProject" ||
      action === "deleteProject"
    ) {

      const sheet = getTargetSheet(["Projects"], "Projects");
      const project = data.project || {};

      if (action === "addProject") {

        const row = Array.isArray(data.sheetRow) && data.sheetRow.length
          ? data.sheetRow
          : [
              project.projectName || "",
              project.pastBA || "",
              project.presentBA || "",
              project.salesPerson || "",
              project.projectType || "",
              project.totalUser || "",
              project.businessType || "",
              project.webPortalUrl || ""
            ];

        sheet.appendRow(row);

        return response("Project added successfully");
      }

      if (action === "updateProject") {

        const values = sheet.getDataRange().getValues();
        const oldProjectName = data.oldProjectName || project.projectName;
        const row = Array.isArray(data.sheetRow) && data.sheetRow.length
          ? data.sheetRow
          : [
              project.projectName || "",
              project.pastBA || "",
              project.presentBA || "",
              project.salesPerson || "",
              project.projectType || "",
              project.totalUser || "",
              project.businessType || "",
              project.webPortalUrl || ""
            ];

        for (let i = 1; i < values.length; i++) {

          if (String(values[i][0]) === String(oldProjectName)) {

            sheet
              .getRange(i + 1, 1, 1, 8)
              .setValues([row.slice(0, 8)]);

            return response("Project updated successfully");
          }
        }

        sheet.appendRow(row.slice(0, 8));

        return response("Project added because old row was not found");
      }

      if (action === "deleteProject") {

        const values = sheet.getDataRange().getValues();

        for (let i = 1; i < values.length; i++) {

          if (String(values[i][0]) === String(project.projectName)) {

            sheet.deleteRow(i + 1);
            return response("Project deleted successfully");
          }
        }

        return response("Project not found");
      }
    }

    // =====================================================
    // NEW PROJECTS
    // =====================================================

    if (
      action === "addNewProject" ||
      action === "updateNewProject" ||
      action === "deleteNewProject"
    ) {

      const sheet = getTargetSheet(["New Project", "New Projects", "New-Project", "New-Projects"], "New Project");
      const project = data.project || {};

      const row = [
        project.projectName || "",
        project.assignDate || "",
        project.estimationTime || "",
        project.salesPerson || "",
        project.contactPerson || "",
        project.frontendDeveloper || "",
        project.backendDeveloper || "",
        project.projectStatus || "Assigned"
      ];

      if (action === "addNewProject") {
        sheet.appendRow(row);
        return response("New project added successfully");
      }

      if (action === "updateNewProject") {
        const values = sheet.getDataRange().getValues();
        const targetName = String(data.oldProjectName || project.projectName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const currentName = String(values[i][0] || "").trim().toLowerCase();

          if (currentName && currentName === targetName) {
            sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
            return response("New project updated successfully");
          }
        }

        sheet.appendRow(row);
        return response("New project added because old row was not found");
      }

      if (action === "deleteNewProject") {
        const values = sheet.getDataRange().getValues();
        const targetName = String(project.projectName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const currentName = String(values[i][0] || "").trim().toLowerCase();

          if (currentName && currentName === targetName) {
            sheet.deleteRow(i + 1);
            return response("New project deleted successfully");
          }
        }

        return response("New project not found");
      }
    }

    // =====================================================
    // NEW PROJECT COMMENTS
    // =====================================================

    if (
      action === "addNewProjectComment" ||
      action === "updateNewProjectComment" ||
      action === "deleteNewProjectComment"
    ) {

      const sheet = getTargetSheet([
        "New-Project Comment",
        "New Project Comment",
        "New-Project Comments",
        "New Project Comments",
        "New Project Profile Comment",
        "New Project Profile Comments",
        "New-Project Profile Comments"
      ], "New-Project Comment");

      const project = data.project || {};
      const comment = data.comment || {};

      const commentRow = [
        comment.sNo !== undefined && comment.sNo !== null ? comment.sNo : "",
        project.projectName || "",
        comment.date || "",
        comment.time || "",
        comment.pendencyType || "",
        comment.commentText || "",
        comment.status || ""
      ];

      if (action === "addNewProjectComment") {
        sheet.appendRow(commentRow);
        return response("New project comment added successfully");
      }

      if (action === "updateNewProjectComment") {
        const values = sheet.getDataRange().getValues();
        const targetSNo = String(comment.sNo || "").trim();
        const targetProjectName = String(project.projectName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowSNo = String(values[i][0] || "").trim();
          const rowProjectName = String(values[i][1] || "").trim().toLowerCase();

          const matchesSNoAndProject = Boolean(targetSNo) && rowSNo === targetSNo && rowProjectName === targetProjectName;
          const matchesCommentTextFallback = !targetSNo && rowProjectName === targetProjectName &&
            String(values[i][2] || "") === String(comment.date || "") &&
            String(values[i][3] || "") === String(comment.time || "");

          if (matchesSNoAndProject || matchesCommentTextFallback) {
            sheet.getRange(i + 1, 1, 1, commentRow.length).setValues([commentRow]);
            return response("New project comment updated successfully");
          }
        }

        sheet.appendRow(commentRow);
        return response("New project comment added because old row was not found");
      }

      if (action === "deleteNewProjectComment") {
        const values = sheet.getDataRange().getValues();
        const targetSNo = String(comment.sNo || "").trim();
        const targetProjectName = String(project.projectName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowSNo = String(values[i][0] || "").trim();
          const rowProjectName = String(values[i][1] || "").trim().toLowerCase();

          const matchesSNoAndProject = Boolean(targetSNo) && rowSNo === targetSNo && rowProjectName === targetProjectName;
          const matchesCommentTextFallback = !targetSNo && rowProjectName === targetProjectName &&
            String(values[i][2] || "") === String(comment.date || "") &&
            String(values[i][3] || "") === String(comment.time || "") &&
            String(values[i][5] || "") === String(comment.commentText || "");

          if (matchesSNoAndProject || matchesCommentTextFallback) {
            sheet.deleteRow(i + 1);
            return response("New project comment deleted successfully");
          }
        }

        return response("New project comment not found");
      }
    }

    // =====================================================
    // PROJECT COMMENTS
    // =====================================================

    if (
      action === "addComment" ||
      action === "updateComment" ||
      action === "deleteComment"
    ) {

      const sheet = getTargetSheet(["Project Comments", "Project Comment"], "Project Comments");
      const project = data.project || {};
      const comment = data.comment || {};

      if (action === "addComment") {

        const row = Array.isArray(data.sheetRow) && data.sheetRow.length
          ? data.sheetRow
          : [
              project.projectName || "",
              comment.date || "",
              comment.time || "",
              comment.pendencyType || comment.commentOf || "",
              comment.commentText || "",
              comment.status || ""
            ];

        sheet.appendRow(row);

        return response("Project comment added successfully");
      }

      if (action === "updateComment") {

        const values = sheet.getDataRange().getValues();
        const commentId = comment.commentId || "";
        const fallbackRow = Array.isArray(data.sheetRow) && data.sheetRow.length
          ? data.sheetRow
          : [
              project.projectName || "",
              comment.date || "",
              comment.time || "",
              comment.pendencyType || comment.commentOf || "",
              comment.commentText || "",
              comment.status || ""
            ];

        for (let i = 1; i < values.length; i++) {

          const matchesCommentId =
            commentId &&
            String(values[i][6] || "") === String(commentId);

          const matchesCommentText =
            String(values[i][0] || "") === String(project.projectName || "") &&
            String(values[i][1] || "") === String(comment.date || "") &&
            String(values[i][2] || "") === String(comment.time || "") &&
            String(values[i][3] || "") === String(comment.pendencyType || comment.commentOf || "") &&
            String(values[i][4] || "") === String(comment.commentText || "");

          if (matchesCommentId || matchesCommentText) {

            sheet
              .getRange(i + 1, 1, 1, 6)
              .setValues([fallbackRow.slice(0, 6)]);

            return response("Project comment updated successfully");
          }
        }

        sheet.appendRow(fallbackRow.slice(0, 6));

        return response("Project comment added because old row was not found");
      }

      if (action === "deleteComment") {

        const values = sheet.getDataRange().getValues();
        const commentId = comment.commentId || "";

        for (let i = 1; i < values.length; i++) {

          const matchesCommentId =
            commentId &&
            String(values[i][6] || "") === String(commentId);

          const matchesCommentText =
            String(values[i][0] || "") === String(project.projectName || "") &&
            String(values[i][1] || "") === String(comment.date || "") &&
            String(values[i][2] || "") === String(comment.time || "") &&
            String(values[i][3] || "") === String(comment.pendencyType || comment.commentOf || "") &&
            String(values[i][4] || "") === String(comment.commentText || "");

          if (matchesCommentId || matchesCommentText) {

            sheet.deleteRow(i + 1);
            return response("Project comment deleted successfully");
          }
        }

        return response("Project comment not found");
      }
    }

    // =====================================================
    // MEETING
    // =====================================================

    if (
      action === "addMeeting" ||
      action === "updateMeeting" ||
      action === "deleteMeeting"
    ) {

      const sheet = getTargetSheet(["Meeting", "Meetings"], "Meeting");
      const meeting = data.meeting || {};

      const meetingRow = [
        meeting.meetingNo || "",
        meeting.projectName || "",
        meeting.representativeName || "",
        meeting.numberOfParticipants !== undefined && meeting.numberOfParticipants !== null ? meeting.numberOfParticipants : "",
        meeting.participantNames || "",
        meeting.createdDate || "",
        meeting.scheduleDate || "",
        meeting.scheduleTime || "",
        meeting.address !== undefined && meeting.address !== null && meeting.address !== "" ? meeting.address : "-",
        meeting.expenses !== undefined && meeting.expenses !== null && meeting.expenses !== "" ? meeting.expenses : "-",
        meeting.meetingType || ""
      ];

      if (action === "addMeeting") {
        sheet.appendRow(meetingRow);
        return response("Meeting added successfully");
      }

      if (action === "updateMeeting") {
        const values = sheet.getDataRange().getValues();
        const targetMeetingNo = String(meeting.meetingNo || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowMeetingNo = String(values[i][0] || "").trim().toLowerCase();

          if (rowMeetingNo && rowMeetingNo === targetMeetingNo) {
            sheet.getRange(i + 1, 1, 1, meetingRow.length).setValues([meetingRow]);
            return response("Meeting updated successfully");
          }
        }

        sheet.appendRow(meetingRow);
        return response("Meeting added because old row was not found");
      }

      if (action === "deleteMeeting") {
        const values = sheet.getDataRange().getValues();
        const targetMeetingNo = String(meeting.meetingNo || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowMeetingNo = String(values[i][0] || "").trim().toLowerCase();

          if (rowMeetingNo && rowMeetingNo === targetMeetingNo) {
            sheet.deleteRow(i + 1);
            return response("Meeting deleted successfully");
          }
        }

        return response("Meeting not found");
      }
    }

    // =====================================================
    // DOCUMENT
    // =====================================================

    if (
      action === "addDocument" ||
      action === "updateDocument" ||
      action === "deleteDocument"
    ) {

      const sheet = getTargetSheet(["Document", "Documents"], "Document");
      const doc = data.document || {};
      const oldDoc = data.oldDocument || {};

      const docRow = [
        doc.projectName || "",
        doc.taskId || "",
        doc.estimationTime || "",
        doc.date || "",
        doc.time || "",
        doc.contactPerson || "",
        doc.taskType || "",
        doc.documentType || "",
        doc.fileName || doc.fileUpload || ""
      ];

      if (action === "addDocument") {
        sheet.appendRow(docRow);
        return response("Document added successfully");
      }

      if (action === "updateDocument") {
        const values = sheet.getDataRange().getValues();
        const targetTaskId = String(oldDoc.taskId || doc.taskId || "").trim().toLowerCase();
        const targetDocType = String(oldDoc.documentType || doc.documentType || "").trim().toLowerCase();
        const targetDate = String(oldDoc.date || doc.date || "").trim();
        const targetTime = String(oldDoc.time || doc.time || "").trim();
        const targetFileName = String(oldDoc.fileName || doc.fileName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowTaskId = String(values[i][1] || "").trim().toLowerCase();
          const rowDate = String(values[i][3] || "").trim();
          const rowTime = String(values[i][4] || "").trim();
          const rowDocType = String(values[i][7] || "").trim().toLowerCase();
          const rowFileName = String(values[i][8] || "").trim().toLowerCase();

          const matchesTaskAndTypeAndDateTime =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            rowDocType === targetDocType &&
            rowDate === targetDate &&
            rowTime === targetTime;

          const matchesTaskAndFile =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            targetFileName &&
            rowFileName === targetFileName;

          const matchesTaskAndDocType =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            rowDocType === targetDocType;

          if (matchesTaskAndTypeAndDateTime || matchesTaskAndFile || matchesTaskAndDocType) {
            sheet.getRange(i + 1, 1, 1, docRow.length).setValues([docRow]);
            return response("Document updated successfully");
          }
        }

        sheet.appendRow(docRow);
        return response("Document added because old row was not found");
      }

      if (action === "deleteDocument") {
        const values = sheet.getDataRange().getValues();
        const targetTaskId = String(doc.taskId || "").trim().toLowerCase();
        const targetDocType = String(doc.documentType || "").trim().toLowerCase();
        const targetDate = String(doc.date || "").trim();
        const targetTime = String(doc.time || "").trim();
        const targetFileName = String(doc.fileName || "").trim().toLowerCase();

        for (let i = 1; i < values.length; i++) {
          const rowTaskId = String(values[i][1] || "").trim().toLowerCase();
          const rowDate = String(values[i][3] || "").trim();
          const rowTime = String(values[i][4] || "").trim();
          const rowDocType = String(values[i][7] || "").trim().toLowerCase();
          const rowFileName = String(values[i][8] || "").trim().toLowerCase();

          const matchesTaskAndTypeAndDateTime =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            rowDocType === targetDocType &&
            rowDate === targetDate &&
            rowTime === targetTime;

          const matchesTaskAndFile =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            targetFileName &&
            rowFileName === targetFileName;

          const matchesTaskAndDocType =
            targetTaskId &&
            rowTaskId === targetTaskId &&
            rowDocType === targetDocType;

          if (matchesTaskAndTypeAndDateTime || matchesTaskAndFile || matchesTaskAndDocType) {
            sheet.deleteRow(i + 1);
            return response("Document deleted successfully");
          }
        }

        return response("Document not found");
      }
    }

    return response("Invalid action", false);

  } catch (err) {

    return ContentService
      .createTextOutput(
        JSON.stringify({
          success: false,
          error: err.toString(),
          message: err.message
        })
      )
      .setMimeType(ContentService.MimeType.JSON);

  }

}


function response(message, isSuccess) {

  return ContentService
    .createTextOutput(
      JSON.stringify({
        success: isSuccess !== undefined ? isSuccess : true,
        message: message
      })
    )
    .setMimeType(ContentService.MimeType.JSON);
}
