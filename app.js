const express = require('express')
// const bodyParser = require('body-parser')
const session = require('express-session')
const User = require('./models/user').User
const router_app = require('./router_app')
const session_middle = require('./middlewares/session')
const methodOverride = require('method-override')
const formidable = require('express-formidable')
const RedisStore = require('connect-redis')(session)
const http = require('http')
const realtime = require('./realtime')
const EventEmitter = require('events')

const app = express()

var server = http.Server(app)

const emitter = new EventEmitter()
emitter.setMaxListeners(100)

var sessionMidd = session({
  store: new RedisStore(),
  secret: 'keyboard cat'
})
//  Parsing
app.use(formidable({
  encoding: 'utf-8',
  multiples: true // req.files to be arrays of files
}))

realtime(server, sessionMidd)
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended: true}))
// estaticos
app.use(express.static('public'))
// middleware
// Override methodos
app.use(methodOverride('_method'))
// Manejamos las sesiones
app.use(sessionMidd)
// session
app.use('/app', session_middle)
// Routing
app.use('/app', router_app)

// Vistas
app.set('view engine', 'pug')
// Archivos estaticos

// Routing
app.get('/', (req, res) => {
  // console.log(req.session.user_id)
  res.render('index')
})
app.get('/login', (req, res) => {
  res.render('login')
})
app.get('/singup', (req, res) => {
  res.render('singup')
})

app.post('/users', (req, res) => {
  var user = new User({
    email: req.fields.email,
    username: req.fields.username,
    password: req.fields.password,
    password_confirmation: req.fields.password_confirmation
  })
  user.save().then(
    (user) => {
      res.send('Datos Guardados Correctamente')
    },
    err => {
      if (err) {
        console.log(String(err))
        res.send(((String(err)).split(':'))[1])
      }
    })
})
app.post('/sessions', (req, res) => {
  User.findOne({email: req.fields.email, password: req.fields.password},
    (err, user) => {
      if (err) {
        console.log(String(err))
        res.send(String(err))
      } else {
        req.session.user_id = user._id
        res.redirect('/app')
      }
    })
})

server.listen(8080)
