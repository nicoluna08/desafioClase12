const  socketCliente = io();

const productForm = document.getElementById("productoForm");
productForm.addEventListener("submit",(event) =>{
event.preventDefault();
const Product = {
    title: document.getElementById("producto").value,
    price: document.getElementById("precio").value,
    thumbnail: document.getElementById("thumbnail").value
}

socketCliente.emit("productoNuevo",Product);
})




const chatForm = document.getElementById("canalChat");
chatForm.addEventListener("submit",(event) =>{
event.preventDefault();
const nuevo_Mensaje = {
    email: document.getElementById("email").value,
    mensaje: document.getElementById("mensajeEmit").value
    
}
socketCliente.emit("MensajeNuevo",nuevo_Mensaje);
})




socketCliente.on("productosAll",async(data)=>{
    const productsContainer = document.getElementById("productsContainer");
/*    console.log("RECIBO PRODUCTOS");
    console.log(data); */
const templateTable = await fetch("./templates/table.handlebars");
const templateFormat = await templateTable.text();

const template = Handlebars.compile(templateFormat);
const html = template({products:data});
productsContainer.innerHTML = html;
})


socketCliente.on("mensajesChat",async(data)=>{
    const canalChat = document.getElementById("canalChat");
const templateTable = await fetch("./templates/chatMain.handlebars");
const templateFormat = await templateTable.text();
const template = Handlebars.compile(templateFormat);
const html = template({Mensajes:data});

canalChat.innerHTML = html;


})






