// jshint esversion:6

// modulos requeridos
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

// nueva instancia de app usando express
const app = express();
// view engine usara ejs
app.set('view engine', 'ejs');

// para analizar solicitudes (requests)
app.use(bodyParser.urlencoded({
  extended: true
}));
// directorio public almacenar archivos estáticos
app.use(express.static("public"));

// ajustes mongodb
// conexión por medio de mongoose a bd: bttestDB
mongoose.connect("mongodb://localhost:27017/bttestDB", {useNewUrlParser: true, useUnifiedTopology: true});

// Usuario Schema
const usuarioSchema = {
  nombre: String,
  clave: String,
  correo: String
};
// Usuario Modelo ("Usuario" es convertido al nombre correspondiente "usuarios" en la bd)
const Usuario = mongoose.model("Usuario", usuarioSchema);



// ROUTES (RUTAS)

////// Sobre /usuarios (Todos los usuarios) //////

app.route("/usuarios")
// get (lista todos los usuarios)
.get(function(req, res){
  Usuario.find(function(err, foundUsers){
    if(!err) {

      var html = "<h1>Usuarios</h1>";
      foundUsers.forEach(function(item){
        html += "<p><a href='http://localhost:3000/usuarios/" + item.nombre + "'>" + item + "</a></p>";
      });

      //console.log(html);
      res.send(html);
    } else {
      res.send(err);
    }
  });
})
// post (nuevo usuario)
.post(function(req, res){
  const nuevoUsuario = new Usuario({
    nombre: req.body.nombre,
    clave: req.body.clave,
    correo: req.body.correo
  });

  nuevoUsuario.save(function(err){
    if (!err){
      res.send("Nuevo usuario agregado.");
    } else {
      res.send(err);
    }
  });
})
// delete (borra todos los usuarios)
.delete(function(req, res){
  Usuario.deleteMany(function(err){
    if (!err){
      res.send("Todos los usuarios borrados.");
    } else {
      res.send(err);
    }
  });
});



////// Sobre /usuarios/:nombreUsuario (Usuarios específicos) //////

app.route("/usuarios/:nombreUsuario")

// obtener un usuario específico
.get(function(req, res){
  Usuario.findOne({nombre: req.params.nombreUsuario}, function(err, foundUser){
    if (foundUser) {
      res.send("<h1>Usuario</h1>" + foundUser);
    } else {
      res.send("No se encontro usario que coincida.");
    }
  });
})

// reemplazar un usuario
.put(function(req, res){
  Usuario.update(
    {nombre: req.params.nombreUsuario},
    {nombre: req.body.nombre, clave: req.body.clave, correo: req.body.correo},
    {overwrite: true},
    function(err){
      if(!err){
        res.send("Usuario reemplazado correctamente.");
      }
    }
  );
})

// actualizar un usuario
.patch(function(req, res){
  Usuario.update(
    {nombre: req.params.nombreUsuario},
    {$set: req.body},
    function(err){
      if(!err){
        res.send("Usuario actualizado correctamente.");
      } else {
        res.send(err);
      }
    }
  );
})

// borrar un usuario
.delete(function(req, res){
  Usuario.deleteOne(
    {nombre: req.params.nombreUsuario},
    function(err){
      if (!err){
        res.send("Usuario borrado correctamente.");
      } else {
        res.send(err);
      }
    }
  );
});



// Inicio
app.get("/", function(req, res){
  res.sendFile(__dirname + "/index.html");
});

// ajusta la app para escuchar en el puerto 3000
app.listen(3000, function(){
  console.log("Servidor iniciado en el puerto 3000");
});



// CARGAR DATOS DE PRUEBA
/* Crear nuevos usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  clave: String,
  correo: String
});

const Usuario = mongoose.model("Usuario", usuarioSchema);

const usuario1 = new Usuario({
  nombre: "GiovanniDS",
  clave: "123456789",
  correo: "giovanni@mail.com"
});

const usuario2 = new Usuario({
  nombre: "MarcoM",
  clave: "222222222",
  correo: "marcom@mail.com"
});

const usuario3 = new Usuario({
  nombre: "Invitado",
  clave: "333333333",
  correo: "invitado@mail.com"
});

Usuario.insertMany([usuario1, usuario2, usuario3], function(err){
  if(err){
    console.log(err);
  }
});
*/
