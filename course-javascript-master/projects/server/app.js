
const express = require('express')
const http = require("http")
const WebSocket = require( "ws")
const jwt = require('jsonwebtoken');
const db = require('./database')
const formidable = require('formidable');
const app = express()
const path = require('path');
const Socket = require('./socket');
const server = http.createServer(app)
const wss = new WebSocket.Server({server})
const fs =  require('fs');


const socket = new Socket(wss)

socket.on('users:connect', (data, ws) =>{
    ws.id = data.id
    socket.emit('users:list', db.getUsersById(Array.from(socket.connections).map(ws => ws.id)))
    socket.broadcast('users:add', db.getUserById(data.id), false)
})

socket.on('disconnect', (id) => {
    socket.broadcast('users:leave', db.getUserById(id))
})
app.use(express.static(path.join(__dirname, 'upload')))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE')
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    )
    next()
})

// reqiest api
app.get('/api/profile', auth, (req, res) => {
    res.json({
        status: 1,
        user: req.user
    })
})
app.post('/api/login', (req, res) => {
    const {login, password} = req.body
    const user = db.getUserByAuth(login, password)
    
    if (user) {
        res.status(200).json({
            id: user.id,
            token: jwt.sign({ user: {id: user.id} }, 'chat', { expiresIn: '1m' })
        })
    } else {
        res.status(200).json({
            status: 0,
            message: 'Не правильный логин или пароль!'
        })
    }
})
app.post('/api/registration', (req, res) => {
    const data = req.body
    const findUser = db.getUserByName(data.login)

    if (findUser) {
        res.status(200).json({
            status: 0,
            message: 'Такой пользователь уже существует!'
        })
    } else {
        try {
            const user = db.createUser(data)

            res.status(201).json({
                status: 1,
                message: 'Вы успешно зарегистрированы :)'
            })
        } catch (error) {
            res.status(200).json({
                status: 0,
                message: error.message
            })
        }
    }
})
app.post('/api/upload', (req, res)=>{
    const form = new formidable.IncomingForm()

    form.uploadDir = path.join(__dirname, 'upload')
    form.parse(req, (err, fields, files) => {
        if (err) {
            throw err
        }

        fs.rename(files.photo.path, path.join(__dirname, 'upload', files.photo.name), (err)=> {
            if (err) {
                throw err
            }

            const pathPhoto = `http://localhost:3000/${files.photo.name}`;

            db.updatePhoto(fields.id, pathPhoto)

            socket.broadcast('users:photo', {
                id: fields.id, 
                path: pathPhoto
            })

            res.status(200).json({
                status: 1,
                message: 'Картинка успешно загружена'
            })
        })  
    })

})
app.use('*', (req, res) => {
    res.json({
        status: 0,
        message: 'Уппс, путь не найден :('
    })
})
server.listen(3000, () => console.log('server run on port 3000'))

//middle
function auth(req, res, next) {
    const token = req.headers.authorization

    try {
        const decoded = jwt.verify(token, 'chat');

        req.user = decoded.user
        next()
      } catch(err) {
        res.status(401).json({
            status: 0,
            error: {
                type: err.message,
                message: 'Сессия истекла!'
            }
        })
      }
}