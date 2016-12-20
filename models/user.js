var mongoose = require('mongoose')
var Schema = mongoose.Schema

mongoose.connect('mongodb://localhost/fotos')

var user_schema = new Schema({
  email: {
    type: String,
    unique: true,
    required: true
  },
  username: {
    type: String,
    required: true,
    minlength: [4, 'Nombre de usuario muy corto'],
    maxlength: [50, 'Nombre de usuario muy largo']
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: (pass) => {
        return pass === this.password_confirmation
      },
      message: 'Las contraseñas no son iguales'
    },
    minlength: [8, 'Password muy corta']
  }
})

user_schema.virtual('password_confirmation')
.get(() => {
  return this.password_confirmation
})
.set((password) => {
  this.password_confirmation = password
})
var User = mongoose.model('User', user_schema)

module.exports.User = User
