import fs from "fs";
import { parse } from "csv-parse/sync";
import path from "path";

// Read CSV file
const csvPath = path.join(__dirname, "locations.csv");

// Define the type for a location row in CSV
type LocationRow = {
  Location: string;
  State: string;
  Latitude: string;
  Longitude: string;
};

async function convertCsvToJson(csvFilePath: string, jsonFilePath: string) {
  const stateCityMap: Record<string, string[]> = {};

  // Read the CSV file
  const fileContent = fs.readFileSync(csvFilePath, "utf8");

  // Parse CSV
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
  }) as LocationRow[];

  // Process each record (row)
  records.forEach((record) => {
    const state = record.State; // Assuming 'State' is a column header in your CSV
    const city = record.Location; // Assuming 'City' is a column header in your CSV

    if (state && city) {
      if (!stateCityMap[state]) {
        stateCityMap[state] = [];
      }
      stateCityMap[state].push(city);
    }
  });

  // Convert the map to JSON string
  const jsonOutput = JSON.stringify(stateCityMap, null, 2); // null, 2 for pretty printing

  // Write the JSON to a file
  fs.writeFileSync(jsonFilePath, jsonOutput, "utf8");
  console.log(`Conversion complete. JSON written to ${jsonFilePath}`);
}

// Output file:
const outputJson = "states_cities.json"; // Your desired output JSON file

// Run if called directly
if (require.main === module) {
  convertCsvToJson(csvPath, outputJson).then(() => process.exit(0));
}
