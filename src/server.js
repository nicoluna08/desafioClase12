const fs = require('fs');

const moment = require('moment');
     
class Productos{
    constructor(nombre){
this.NombreArchivo = nombre;
    }

 async save(producto){
    try {
       const productosTotal = await this.getAll();
       if (productosTotal != "EL ARCHIVO ESTA VACIO" && productosTotal !== [] ){
        const ultimoID = productosTotal[productosTotal.length-1].id+1;
        producto.id = ultimoID;
        productosTotal.push(producto);
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(productosTotal,null,2));
    }else {
        producto.id = 1;
     await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify([producto],null,2));
    }
       

    } catch (error) {
        return "el producto no se puede grabar"
    }
 }


  async getAll(){
  try {
    const resultado = await fs.promises.readFile(this.NombreArchivo,"utf-8");
  if (resultado.length > 0){
    const prodJson = JSON.parse(resultado);
    return prodJson;    
  
  } else{
    console.log("no hay productos");
    return "EL ARCHIVO ESTA VACIO"
  }   
   
  } catch (error) {
    const archivoNuevo=  await fs.promises.writeFile(this.NombreArchivo,"");  
    return ""
  }

    }

    async getById(unID){
      try {
        const productosTotal = await this.getAll();

        const unProducto = productosTotal.find(elemnto=>elemnto.id === unID)
   if (unProducto){
    return unProducto;
    
   }else{
return "NO SE ENCUENTRA PRODUCTO"
   }
      } catch (error) {
        console.log("no se encuentra el producto");
      }
    }


    async deleteById(unID){
      try {
        const productosTotal = await this.getAll();
        const Productos = productosTotal.filter(elemnto=>elemnto.id !== unID)
        await fs.promises.writeFile(this.NombreArchivo,JSON.stringify(Productos,null,2));
    
        return `Producto ID: ${id}  fue eliminado con exito`
      } catch (error) {
        console.log("no se encuentra el producto para eliminar");
      }
    }


    async deleteAll(){
      try {
        const productosTotal = await this.getAll();
        
        await fs.promises.writeFile(this.NombreArchivo,"");
    
        return `Se Eliminaron Todos Los Productos`
      } catch (error) {
        console.log("no se puede eliminar los productos");
      }
    }



}



class Mensajes{
  constructor(nombre){
this.NombreArchivo = nombre;
  }

async save(mensaje){
  try {
     const mensajesTotal = await this.getAll();
     if (mensajesTotal != "EL ARCHIVO ESTA VACIO" && mensajesTotal !== [] ){
      const ultimoID = mensajesTotal[mensajesTotal.length-1].id+1;
      mensaje.id = ultimoID;
      const fechaActual = moment().format('DD/MM/YYYY HH:mm:ss');
      mensaje.fecha = fechaActual;
    
      mensajesTotal.push(mensaje);
   await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify(mensajesTotal,null,2));
  }else {
      mensaje.id = 1;
      const fechaActual = moment().format();
      mensaje.fecha = fechaActual;
    
   await   fs.promises.writeFile(this.NombreArchivo,JSON.stringify([mensaje],null,2));
  }
     

  } catch (error) {
      return "el mensaje no se puede grabar"
  }
}


async getAll(){
try {
  const resultado = await fs.promises.readFile(this.NombreArchivo,"utf-8");
if (resultado.length > 0){
  const mensaJson = JSON.parse(resultado);
  return mensaJson;    

} else{
  console.log("no hay mensajes");
  return "EL ARCHIVO ESTA VACIO"
}   
 
} catch (error) {
  const archivoNuevo=  await fs.promises.writeFile(this.NombreArchivo,"");  
  return ""
}

  }

}



const producto = new Productos("Listado.txt");

const listaMensajes = new Mensajes("Mensajes.txt");


const express = require('express');
const handlebars = require('express-handlebars');

const app = express();
const puerto = 8080;

const path = require ('path');
const dirViews = path.join(__dirname, "views");

const {Server} =require("socket.io");



app.use(express.json());
app.use(express.urlencoded({extended: true}));

 const servidor= app.listen(puerto, () => {  console.log(`EL Servidor esta escuchando en el puerto ${puerto}`)});

 app.use(express.static(__dirname+"/public"));

 const io = new Server(servidor);

io.on('connection', async(socket)=> {
  console.log('Un cliente se ha conectado');
 
  const productosTotal = await producto.getAll();
  socket.emit('productosAll', productosTotal);

  const mensajesTotales = await listaMensajes.getAll(); 
  socket.emit('mensajesChat', mensajesTotales);

  socket.on("productoNuevo",async(data) => {
  await producto.save(data);

  const productosTotal = await producto.getAll();

  socket.emit('productosAll', productosTotal);
  })

  socket.on("MensajeNuevo",async(data) => {
    
    await listaMensajes.save(data);
  
    const mensajesTotales = await listaMensajes.getAll();
    socket.emit('mensajesChat', mensajesTotales);

    })
  

}) 


app.engine("handlebars",handlebars.engine());

app.set("views",dirViews);
app.set("view engine", "handlebars");

app.get('/', (req, res) => {
	res.render("productos");
});
app.get('/productos', async(req, res) => {
   
    const productosTotal = await producto.getAll();
 
    if ( productosTotal.length > 0) {
 
    res.render("listado",{
   product:  productosTotal     
    });
}else {
    res.render("listadoVacio");
}
});

/*
app.post("/productos", async(req,res)=> {
 await producto.save(req.body);
 console.log(await producto.getAll());
res.redirect("/");
})
*/
;


