const path = require('path')
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync(path.resolve(__dirname, 'db.json'))
const db = low(adapter)

function getUserByName(username) {
    return db.get('users')
        .find({ login: username })
        .value()
}

function getUserByAuth(login, password) {
    const user = db.get('users').find({ login }).value();
    const isPassword = user ? bcrypt.compareSync(password, user.password) : null

    if (isPassword) {
        return { ...user };
    } else {
        return null
    }
}

function createUser(user) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    const id = uuidv4()

    db.get('users')
        .push({
            id,
            login: user.login,
            name: user.name,
            password: hash,
            image: ''
        })
        .write()

    const checkUser = db.get('users').find({ id }).value()
    
    if (checkUser) {
        return checkUser
    } else {
        throw new Error('Ошибка в базе данных :( Попробуйте еще!')
    }
}

function getUsersById(ids) {
    return db.get('users')
        .value()
        .filter((user) => ids.includes(user.id))
}

function updatePhoto(id, path) {
    db.get('users').find({ id }).set('image', path).write()
}

function getUserById (id) {
    return db.get('users').find({ id }).value()
}

module.exports = {
    getUserByAuth,
    getUserByName,
    getUsersById,
    getUserById,
    updatePhoto,
    createUser
}