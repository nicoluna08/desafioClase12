console.log("vista desde el home");
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


socketCliente.on("productosAll",async(data)=>{
    const productsContainer = document.getElementById("productsContainer");
    console.log("RECIBO PRODUCTOS");
    console.log(data);
const templateTable = await fetch("./templates/table.handlebars");
const templateFormat = await templateTable.text();

const template = Handlebars.compile(templateFormat);
console.log("HTML MUESTRA");
const html = template({products:data});
console.log(data);
productsContainer.innerHTML = html;
})











