# DanceBatch Attendance Tracker (with Google Sheets Integration)

Welcome to the DanceBatch Attendance Tracker, a modern application for managing student attendance in dance classes. It provides a beautiful and intuitive interface for instructors and administrators, with role-based permissions and a direct connection to a Google Sheet you control.

All data is saved to and managed by a Google Apps Script connected to a Google Sheet, making it a powerful and free-to-use backend solution.

## Features

- **Google Sheets Backend**: All attendance data is saved directly into a Google Sheet, giving you full ownership and visibility of your data.
- **Role-Based Access**: Pre-configured **Admin** and **Teacher** roles.
  - **Admins**: Can create, edit, view, and delete all batches. Can assign instructors.
  - **Teachers**: Can only view and manage batches they are assigned to. They handle student enrollment and attendance.
- **Batch Management**: Create courses with custom names, schedules, colors, and a fixed number of sessions (8 or 12).
- **Student Enrollment**: Easily add and remove students from batches.
- **Session-Based Attendance**: Mark attendance (Present, Absent, Late) for each class.
- **Visually Rich UI**: A stunning, responsive interface built with Tailwind CSS.
- **Zero Build-Step Frontend**: Runs directly in the browser using ES Modules and CDN-hosted dependencies, making it incredibly easy to deploy.

---

## Deployment Guide: A Two-Part Process

Deploying this application involves setting up the **backend** (your Google Sheet and Apps Script) and then the **frontend** (the React web app).

### Part 1: Backend Setup (Google Sheet & Apps Script API)

This part creates the Google Sheet that will store your data and deploys the script that allows your app to talk to it.

**Step 1: Create the Google Sheet**
1.  Go to [sheets.new](https://sheets.new) to create a new, blank Google Sheet.
2.  Rename the sheet to something memorable, like `Dance Attendance Backend`.

**Step 2: Add and Deploy the Apps Script**
1.  In your new sheet, click `Extensions` > `Apps Script`. A new browser tab will open with the script editor.
2.  Delete any existing code in the `Code.gs` file.
3.  **Copy the entire script below** and paste it into the empty `Code.gs` file in the script editor.
4.  Click the **Save project** icon (looks like a floppy disk).
5.  At the top right of the script editor, click the blue **Deploy** button and select **New deployment**.
6.  A dialog box will appear. Click the gear icon next to "Select type" and choose **Web app**.
7.  Fill in the deployment details:
    -   **Description**: `Dance Attendance API` (or anything you like).
    -   **Execute as**: `Me`.
    -   **Who has access**: **Anyone**. (This is important for the web app to be able to call it).
8.  Click **Deploy**.
9.  **Authorize Permissions (CRUCIAL STEP)**: Google will prompt you to authorize the script.
    -   Click **Authorize access**.
    -   Choose your Google account.
    -   You may see a "Google hasn't verified this app" screen. This is normal. Click **Advanced**, then click **Go to [Your Project Name] (unsafe)**.
    -   Review the permissions and click **Allow**.
10. **Copy the Web App URL**: After successful deployment, you will see a dialog box with a **Web app URL**. Click the **Copy** button. This is the URL to your new backend API. Keep it safe for the next part.

#### Backend Script Code (`Code.gs`)
```javascript
/**
 * Handles POST requests to the web app. This function serves as the API endpoint
 * for the frontend application to save attendance data.
 *
 * @param {object} e The event parameter for a POST request.
 * @returns {ContentService.TextOutput} A JSON response indicating success or failure.
 */
function doPost(e) {
  // Check if the script is being called by the web app, which provides postData.
  if (!e || !e.postData || !e.postData.contents) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: "This script must be called as a web app with a POST request. It cannot be run directly from the editor." }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  try {
    // 1. PARSE INCOMING DATA
    var payload = JSON.parse(e.postData.contents);
    var { batchName, sessionDate, classNumber, attendance, students } = payload;

    if (!batchName || !sessionDate || !classNumber || !attendance || !students) {
      throw new Error("Missing required data in the request payload.");
    }

    // 2. GET OR CREATE THE CORRECT SHEET (TAB)
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(batchName);
    if (!sheet) {
      sheet = ss.insertSheet(batchName);
    }

    // 3. DEFINE AND FIND THE COLUMN FOR THIS CLASS
    var classHeader = "Class " + classNumber + " (" + sessionDate + ")";
    var dataRange = sheet.getDataRange();
    var values = dataRange.getValues();
    var headers = values.length > 0 ? values[0] : [];
    var classColumnIndex = headers.indexOf(classHeader);

    if (classColumnIndex === -1) {
      if (headers.length === 0) {
        sheet.getRange(1, 1, 1, 3).setValues([["Student ID", "Student Name", classHeader]]).setFontWeight("bold");
        classColumnIndex = 2; // 0-indexed
      } else {
        classColumnIndex = headers.length;
        sheet.getRange(1, classColumnIndex + 1).setValue(classHeader).setFontWeight("bold");
      }
      values = sheet.getDataRange().getValues();
    }

    // 4. CREATE A MAP OF EXISTING STUDENTS FOR QUICK LOOKUP
    var studentIdToRowIndex = {};
    for (var i = 1; i < values.length; i++) {
      var studentId = values[i][0];
      if (studentId) {
        studentIdToRowIndex[studentId] = i + 1; // 1-indexed for sheets
      }
    }

    // 5. UPDATE ATTENDANCE DATA
    attendance.forEach(function(record) {
      var studentId = record.studentId;
      var status = record.status;
      var studentInfo = students.find(s => s.id === studentId);
      var studentName = studentInfo ? studentInfo.name : "Unknown Student";
      var rowIndex = studentIdToRowIndex[studentId];

      if (rowIndex) {
        sheet.getRange(rowIndex, classColumnIndex + 1).setValue(status);
      } else {
        var newRowIndex = sheet.getLastRow() + 1;
        sheet.getRange(newRowIndex, 1).setValue(studentId);
        sheet.getRange(newRowIndex, 2).setValue(studentName);
        sheet.getRange(newRowIndex, classColumnIndex + 1).setValue(status);
        studentIdToRowIndex[studentId] = newRowIndex;
      }
    });

    // 6. AUTO-RESIZE COLUMNS for better readability.
    sheet.autoResizeColumn(2); // Student Name
    sheet.autoResizeColumn(classColumnIndex + 1);

    // 7. RETURN A SUCCESS RESPONSE
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'Attendance saved for ' + batchName }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log(error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Part 2: Frontend Setup (React App)

This part connects your user interface to the backend you just deployed.

**Step 1: Configure the Frontend**
1.  Open the project files you downloaded.
2.  Find and open the `config.ts` file.
3.  You will see a line of code:
    ```typescript
    export const APPS_SCRIPT_URL = 'PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE';
    ```
4.  **Replace `PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE` with the Web app URL you copied in the previous section.** Make sure the URL is inside the single quotes.
5.  Save the `config.ts` file.

**Step 2: Deploy the Frontend**
1.  The frontend is a "static site," meaning you can host it on any modern static hosting provider. **Netlify** and **Vercel** are excellent free options.
2.  Go to [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/) and sign up for a free account.
3.  Deploying is as simple as dragging and dropping the **entire project folder** (the one containing `index.html`, `App.tsx`, etc.) into the deployment area of their site.
4.  The service will build and host your site, giving you a public URL. This URL is your final, live application!

---

## Login Credentials

The application is pre-populated with demo users. Use the following credentials to log in:

-   **Admin Login**:
    -   Username: `admin`
    -   Password: `dance123`
-   **Instructor "Neha" Login**:
    -   Username: `neha`
    -   Password: `dance123`
-   **Instructor "Raj" Login**:
    -   Username: `raj`
    -   Password: `dance123`
---

## Troubleshooting

- **Error: `TypeError: Cannot read properties of undefined (reading 'postData')`**: This error appears in your Google Sheet's execution log if you try to run the `doPost` function directly from the Apps Script editor. This is expected. The script is designed to be run *only* by your web app sending it data. Test the functionality through your deployed web app, not the editor.
- **Changes not appearing in the sheet?**: 
    1. Double-check you copied the correct Web App URL into `config.ts`.
    2. Make sure you re-deployed the Apps Script after any changes.
    3. Check the execution logs in the Apps Script editor for any red error messages.