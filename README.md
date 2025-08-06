<!--
@license
Copyright 2025 Francis Extor & Ateneo de Davao Scholars Society (ADDSS)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Ateneo de Davao Scholars Society - QR Attendance System

A comprehensive, serverless attendance system built entirely on Google Apps Script. This project provides tools to generate unique QR codes for scholars and a web-based scanner to record their attendance directly into a Google Sheet.

---

## Features

- **Dynamic QR Code Generation:** Automatically creates QR codes for each scholar listed in a Google Sheet.
- **JSON Data Embedding:** Each QR code contains scholar data (Name, School, Course, Grant) in a secure JSON format.
- **Google Drive Integration:** Generated QR codes are automatically saved as PNG images to a specified Google Drive folder.
- **Web-Based QR Scanner:** A mobile-friendly web app that uses a device's camera to scan QR codes.
- **Automated Data Logging:** Scanned attendance is instantly recorded with a timestamp in a designated Google Sheet.
- **Progressive Web App (PWA):** The scanner can be "installed" on a phone's home screen for a seamless, fullscreen experience without the browser's address bar.
- **User-Friendly Interface:** The project includes a custom menu in Google Sheets for easy operation.

---

## Project Structure

This project consists of four main files working together within the Google Apps Script environment:

- **qr-GeneratorCode.gs:** Reads scholar data from the `SCHOLARS` sheet and generates the corresponding QR codes.
- **Code.gs:** The server-side backend for the web app. Serves HTML pages and appends scanned data to the `ATTENDANCE` sheet.
- **HTML.html:** The frontend of the web app. Contains the structure, styling, and client-side JavaScript for the QR code scanner interface.
- **manifest.html:** A JSON configuration file that defines the web app as a Progressive Web App (PWA), allowing it to be installed on mobile devices for a native, fullscreen feel.

---

## Setup and Usage

### Part 1: Generating Scholar QR Codes

1. **Prepare the SCHOLARS Sheet:**
   - In your main Google Sheet, create a sheet (tab) named exactly `SCHOLARS`.
   - Create columns with the following headers (case-insensitive, order does not matter): `NAME`, `SCHOOL`, `COURSE`, `GRANT`.
   - Fill in the details for each scholar. The script will skip any rows with missing information in these required columns.

2. **Run the QR Generator:**
   - Reload your Google Sheet. A new menu item named **Scholarship Tools** will appear.
   - Click `Scholarship Tools > Generate Scholar QR Codes`.
   - The first time you run this, you will need to grant the script permission to access your Google Sheets and Google Drive.
   - The script will create a folder in your Google Drive named `ADDSS QR 2025-2026` and save all the generated QR code images inside it.

---

### Part 2: Using the Attendance Scanner

1. **Deploy the Web App:**
   - In the Apps Script editor, click the blue **Deploy** button at the top right and select **New deployment**.
   - Click the gear icon (⚙️) next to "Select type" and choose **Web app**.
   - In the configuration settings:
     - **Description:** Give it a name, e.g., "Attendance Scanner v1".
     - **Execute as:** Select **Me (your-email@addu.edu.ph)**. This is critical for allowing the app to write to your sheet.
     - **Who has access:** Select **Anyone**. This makes the scanner URL public so anyone can use it for attendance.
   - Click **Deploy**. Copy the provided Web app URL. This is the link to your scanner.

2. **Using the Scanner on a Phone:**
   - Open the copied Web app URL on your mobile device.
   - The app will request permission to use your camera. Grant this permission.
   - Point the camera at a scholar's QR code to log their attendance.

3. **(Recommended) Add to Home Screen for Fullscreen Mode:**
   - **On Android (Chrome):** Open the URL, tap the three-dot menu, and select "Install app" or "Add to Home screen".
   - **On iOS (Safari):** Open the URL, tap the "Share" icon, and select "Add to Home Screen".
   - Opening the app from the new icon on your home screen will launch it in a fluent, fullscreen view without the browser's address bar.

---

## Dependencies

- **[html5-qrcode](https://github.com/mebjas/html5-qrcode):** A client-side JavaScript library used for implementing the QR code scanning functionality within the web app.

---

## License

Apache License 2.0  
See the [LICENSE](LICENSE) file for details.

---

**Ateneo de Davao Scholars Society**  
For inquiries, contact the project maintainer.
