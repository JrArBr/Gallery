
const socket = io()

socket.on('new img', (data) => {
  data = JSON.parse(data)

  var container = document.querySelector('#all-images')
  var source = $("#img-template").html()
  var template = Handlebars.compile(source)
  container.innerHTML += template(data)
})
