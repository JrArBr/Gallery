// const Imagen = require('../models/imagen')

module.exports = (imagen, req, res) => {
  if (req.method === 'GET' && req.path.indexOf('edit') < 0) {
    return true
  }
  if (imagen.creator._id.toString() === res.locals.user._id.toString()) {
    return true
  }
  return false
}
