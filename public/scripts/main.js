import Papa from "https://esm.sh/papaparse@5.4.1";

async function fetchCSV(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.text();
}

async function getWebRing() {
  const sheetId = "1aQ2nvKz79467alAwtmCz2vXYqNPmLt0mz0qcMzVZUUE";
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv`;

  try {
    const csvData = await fetchCSV(url);
    return new Promise((resolve, reject) => {
      Papa.parse(csvData, {
        header: true, // Set to true if your CSV has column headers
        complete: (results) => resolve(results.data),
        error: (error) => reject(error),
      });
    });
  } catch (error) {
    console.error("Error fetching or parsing CSV:", error);
  }
}

export { getWebRing };
