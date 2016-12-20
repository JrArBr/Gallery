var Imagen = require('../models/imagen')
const Permisos = require('./img_permission')
module.exports = (req, res, next) => {
  Imagen.findById(req.params.id)
    .populate('creator')
    .exec((err, img) => {
      if (err || !Permisos(img, req, res)) {
        res.redirect('/app/imagenes')
        console.log(String(err))
      } else {
        res.locals.img = img
        next()
      }
    })
}
