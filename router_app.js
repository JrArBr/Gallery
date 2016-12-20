const express = require('express')
const Imagen = require('./models/imagen')
const router = express.Router()
const find_img = require('./middlewares/find_img')
const fs = require('fs')
const redis = require('redis')
const client = redis.createClient()

router.get('/', (req, res) => {
  Imagen.find()
  .populate('creator')
  .exec((err, imgs) => {
    if (err) {
      console.log(String(err))
      res.redirect('/login')
    } else {
      res.render('app/home', {imgs})
    }
  })
})
// REST
router.get('/imagenes/new', (req, res) => {
  res.render('app/imagenes/new')
})

router.all('/imagenes/:id*', find_img)

router.get('/imagenes/:id/edit', (req, res) => {
  // var img = res.locals.imagen
  res.render('app/imagenes/edit')
})

router.route('/imagenes/:id')
  .get((req, res) => {
    // var img = res.locals.imagen
    client.publish('images', res.locals.img.toString())
    res.render('app/imagenes/show')
  })
  .put((req, res) => {
    var imagen = res.locals.img
    imagen.title = req.fields.title
    imagen.save().then(
      img => {
        res.render('app/imagenes/show', {img})
      },
      (err) => {
        if (err) {
          console.log(err)
          res.render('app/imagenes')
          //res.send(String(err))
        }
      }
    )
  })

  .delete((req, res) => {
    Imagen.findOneAndRemove({_id: req.params.id}, err => {
      if (err) {
        console.log(err)
        res.redirect('/app/imgenes/' + req.params.id)
      } else {
        res.redirect('/app/imagenes')
      }
    })
  })
router.route('/imagenes')
  .get((req, res) => {
    Imagen.find({creator: res.locals.user._id}, (err, all) => {
      if (err) {
        console.log(err)
        res.redirect('/app')
      } else {
        res.render('app/imagenes/all', {all})
      }
    })
  })
  .post((req, res) => {
    var documento_ext = (req.files.archivo.name.split('.').pop())
    console.log(req.files.archivo)
    var img = new Imagen({
      title: req.fields.title,
      creator: res.locals.user._id,
      documento: documento_ext
    })
    img.save().then(
      image => {
        client.publish('images', JSON.stringify(image))
        fs.rename(req.files.archivo.path, 'public/imagenes/' + image._id + '.' + documento_ext)
        res.redirect('/app/imagenes/')
      },
      err => {
        if (err) {
          console.log(String(err))
          res.send(String(err))
        }
      })
  })

module.exports = router
