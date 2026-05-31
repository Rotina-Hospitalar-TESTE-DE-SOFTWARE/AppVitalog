const { LowSync } = require('lowdb');
const { JSONFileSync } = require('lowdb/node');
const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'db.json');

const defaultData = {
  users: [],
  medicoes: []
};

const adapter = new JSONFileSync(dbPath);
const db = new LowSync(adapter, defaultData);

db.read();
if (!db.data) db.data = defaultData;
db.write();

module.exports = db;
