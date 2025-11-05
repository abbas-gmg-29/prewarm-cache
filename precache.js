import fs from "fs";
import fetch from "node-fetch";

const CSV_FILE = "./prewarm_urls.csv";

// Simple CSV reader (assumes one column 'url')
const urls = fs
  .readFileSync(CSV_FILE, "utf-8")
  .split("\n")
  .slice(1)
  .map(line => line.trim())
  .filter(line => line.length > 0);

console.log(`Starting pre-cache job. Total URLs: ${urls.length}`);

let success = 0;
let fail = 0;

for (const url of urls) {
  try {
    const res = await fetch(url, { method: "GET" });
    if (res.ok) {
      success++;
    } else {
      console.log(`${url} (${res.status})`);
      fail++;
    }
  } catch (err) {
    console.log(`${url} - ${err.message}`);
    fail++;
  }
  // Optional delay between hits (500 ms)
  await new Promise(r => setTimeout(r, 500));
}

console.log(`\n Done. Success: ${success}, Failed: ${fail}`);