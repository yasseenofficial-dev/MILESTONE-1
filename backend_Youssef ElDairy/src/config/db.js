const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '../../data/database.json');

function ensureDatabaseExists() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(emptyDatabase(), null, 2));
  }
}

function emptyDatabase() {
  return {
    users: [],
    events: [],
    eventStaff: [],
    tasks: [],
    guests: [],
    vendors: [],
    eventVendors: [],
    communications: [],
    communicationStatuses: [],
    feedback: [],
    layouts: [],
    expenses: []
  };
}

function readDB() {
  ensureDatabaseExists();
  return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
}

function writeDB(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

function nextId(items, prefix) {
  const numbers = items
    .map(item => item.id)
    .filter(id => typeof id === 'string' && id.startsWith(prefix))
    .map(id => parseInt(id.replace(prefix, ''), 10))
    .filter(Number.isFinite);
  const next = numbers.length ? Math.max(...numbers) + 1 : 1;
  return `${prefix}${next}`;
}

module.exports = { DB_PATH, ensureDatabaseExists, emptyDatabase, readDB, writeDB, nextId };
