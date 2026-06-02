const db = require('../config/database');
const bcrypt = require('bcryptjs');
const { randomUUID } = require('crypto');

class UserModel {
  static findAll() {
    db.read();
    return db.data.users;
  }

  static findById(id) {
    db.read();
    return db.data.users.find(u => u.id === id) || null;
  }

  static findByEmail(email) {
    db.read();
    return db.data.users.find(u => u.email === email.toLowerCase()) || null;
  }

  static create({ nome, email, senha, telefone, dataNascimento }) {
    db.read();
    const hash = bcrypt.hashSync(senha, 10);
    const user = {
      id: randomUUID(),
      nome,
      email: email.toLowerCase(),
      senha: hash,
      telefone,
      dataNascimento,
      criadoEm: new Date().toISOString()
    };
    db.data.users.push(user);
    db.write();
    return user;
  }

  static verifyPassword(plain, hash) {
    return bcrypt.compareSync(plain, hash);
  }
}

module.exports = UserModel;
