const pgp = require('pg-promise')({});
const db = pgp('postgres://localhost/blogapi');

const UserService = {};

UserService.create = (name, email) => {
  return db.none('INSERT INTO users (name, email) VALUES (${name}, ${email})', {name, email})
}

UserService.read = (user_id) => {
  return db.one('SELECT name FROM users WHERE user_id=${user_id}', {user_id: user_id});
}

UserService.update = (user_id, name, email) => {
  return db.none('UPDATE users SET name=${name}, email=${email} WHERE user_id=${user_id}', {user_id, name, email});
}

UserService.delete = (user_id) => {
  return db.none('DELETE FROM posts WHERE user=${user_id}; DELETE FROM comments WHERE user=${user_id}; DELETE FROM users WHERE user_id=${user_id}', {user_id});
}

module.exports = UserService;