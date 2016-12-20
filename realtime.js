
module.exports = (server, sessionMidle) => {
  var io = require('socket.io')(server)
  var redis = require('redis')
  var client = redis.createClient()

  client.subscribe('images')

  io.use((socket, next) => {
    sessionMidle(socket.request, socket.request.res, next)
  })

  client.on('message', (channel, msg) => {
    if (channel === 'images') {
      io.emit('new img', msg)
    }
  })

  io.sockets.on('connection', (socket) => {
    console.log(socket.request.session.user_id)
  })
}
