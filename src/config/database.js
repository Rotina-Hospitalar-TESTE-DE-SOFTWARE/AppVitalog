const path = require('path');
const fs = require('fs');

const dataDir = path.join(__dirname, '../../data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, 'db.json');

const defaultData = {
  users: [],
  medicoes: []
};

const db = {
  data: defaultData,

  read() {
    if (!fs.existsSync(dbPath)) {
      this.data = { ...defaultData };
      return;
    }

    const content = fs.readFileSync(dbPath, 'utf8').trim();
    this.data = content ? JSON.parse(content) : { ...defaultData };
    this.data.users = this.data.users || [];
    this.data.medicoes = this.data.medicoes || [];
  },

  write() {
    fs.writeFileSync(dbPath, JSON.stringify(this.data, null, 2));
  }
};

db.read();
if (!db.data) db.data = defaultData;
db.write();

module.exports = db;
