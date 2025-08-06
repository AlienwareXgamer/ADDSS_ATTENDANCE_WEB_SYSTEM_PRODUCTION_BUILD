/**
 * @OnlyCurrentDoc
 * This script generates QR codes for scholars and provides a UI menu.
 */

/**
 * Creates a custom menu in the spreadsheet UI when the document is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Scholarship Tools')
    .addItem('Generate Scholar QR Codes', 'generateQRForScholars')
    .addToUi();
}

/**
 * Reads scholar data, generates QR codes, and saves them to Google Drive.
 */
function generateQRForScholars() {
  const ui = SpreadsheetApp.getUi();

  // --- Configuration ---
  const sheetName = 'SCHOLARS';
  const folderName = 'ADDSS QR 2025-2026';
  const requiredFields = ['NAME', 'SCHOOL', 'COURSE', 'GRANT'];
  // ---------------------

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    ui.alert(`Error: Sheet "${sheetName}" not found.`);
    return;
  }

  const data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    ui.alert('No data found in the sheet. Please add at least one scholar.');
    return;
  }
  
  // Prepare Drive Folder (Create if not exists, or clear if it does)
  const folder = getAndPrepareFolder(folderName);
  
  const headers = data.shift(); // Get headers and remove from data
  const headerMap = {};
  
  // Dynamically find column indices (case-insensitive)
  requiredFields.forEach(field => {
    const index = headers.findIndex(h => h.toString().trim().toUpperCase() === field.toUpperCase());
    if (index !== -1) {
      headerMap[field] = index;
    }
  });

  // Verify all required columns were found
  if (Object.keys(headerMap).length !== requiredFields.length) {
    ui.alert(`Error: Missing one or more required columns. Please ensure your sheet has: ${requiredFields.join(', ')}.`);
    return;
  }

  let successCount = 0;
  let skippedCount = 0;
  let errorCount = 0;

  // Process each scholar row
  for (const row of data) {
    const scholarData = {};
    let isRowComplete = true;

    for (const field of requiredFields) {
      const value = row[headerMap[field]];
      if (!value || value.toString().trim() === '') {
        isRowComplete = false;
        break; // Stop checking this row if any field is empty
      }
      scholarData[field] = value.toString().trim();
    }

    if (!isRowComplete) {
      skippedCount++;
      continue;
    }

    // Generate and save the QR code
    try {
      const jsonString = JSON.stringify(scholarData);
      const encodedData = encodeURIComponent(jsonString);
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;

      const response = UrlFetchApp.fetch(qrUrl);
      const blob = response.getBlob().setName(`${scholarData.NAME}.png`);
      folder.createFile(blob);
      successCount++;
    } catch (error) {
      errorCount++;
      Logger.log(`Error generating QR for ${scholarData.NAME}: ${error}`);
    }
  }

  // Display a final summary message to the user
  let summary = `Process complete!\n\n✅ ${successCount} QR codes generated.\n⏭️ ${skippedCount} rows skipped (missing data).\n`;
  if (errorCount > 0) {
      summary += `❌ ${errorCount} errors occurred (check logs for details).\n`;
  }
  summary += `\nFiles are in the "${folderName}" folder in your Google Drive.`
  
  ui.alert(summary);
}


/**
 * Finds a folder by name. If it exists, it moves all contents to the trash.
 * If it doesn't exist, it creates a new one.
 * @param {string} name The name of the folder.
 * @return {GoogleAppsScript.Drive.Folder} The prepared folder object.
 */
function getAndPrepareFolder(name) {
  const folders = DriveApp.getFoldersByName(name);
  let folder;

  if (folders.hasNext()) {
    folder = folders.next();
    Logger.log(`Folder "${name}" found. Clearing its contents.`);
    const files = folder.getFiles();
    while (files.hasNext()) {
      // **IMPROVEMENT:** Move files to trash instead of orphaning them.
      files.next().setTrashed(true);
    }
  } else {
    folder = DriveApp.createFolder(name);
    Logger.log(`Folder "${name}" created.`);
  }
  return folder;
}
