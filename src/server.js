const express = require('express');
const app = express();
const handlebars = require('express-handlebars');
const path = require('path');
const { uptime } = require('process');
const {Router} = express();

class Productos{
    constructor(title,price,thumbnail){
        this.title = title;
        this.price = price;
        this.thumbnail = thumbnail;
    }
    productos = [
        
        {
            id: 1,
            title: "Placa de video",
            price: 200,
            thumbnail: "http://api.com/thumbnail.png"
            
        }
        
    ];
    getProductos(){
        return this.productos;
    }
    getProductById(id){
        const product = this.productos.find(producto =>producto.id == id);
        if(product == undefined){
            return {error: "Producto no encontrado"};
        }else{
            return product;
        }
    }
    addProduct(product){
        if(this.productos.length > 0){
            const auxId = this.productos[this.productos.length - 1].id+1;
            const obj = {
                id: auxId,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail
            }
            this.productos.push(obj);
            return obj;
        }else{
            const obj = {
                id: 1,
                title: product.title,
                price: product.price,
                thumbnail: product.thumbnail
            }
            this.productos.push(obj);
            return obj;
        }
    }
    updateProduct(product){
        const obj = {
            id: product.id,
            title: product.title,
            price: product.price,
            thumbnail: product.thumbnail
        }
        const products = this.productos.find(producto=>producto.id === product.id);
        if(products==undefined){
            return {error: "No existe producto con ese ID"};
        }else{
            const filteredProducts = this.productos.filter(producto=>producto.id!==product.id);
            filteredProducts.push(obj);
            this.productos = filteredProducts;
            return {success: "Se ha actualizado el producto",products: this.productos};
        }
    }
    deleteProduct(id){
        const products = this.productos.find(producto=>producto.id==id);
        if(products==undefined){
            return {error: "No existe producto con ese id"};
        }else{
            const filteredProducts = this.productos.filter(producto=>producto.id!=id);
            console.log(filteredProducts);
            this.productos = filteredProducts;
            return {success: `Se ha eliminado el producto con el id: ${id}`,productosNuevos: this.productos};
        }
    }
}
const productos = new Productos();


app.use(express.urlencoded({extended: true}));
app.use(express.json());


const carpetaViews = path.join(__dirname, "views"); 

app.listen(8080,()=>console.log("Server escuchando en purto 8080"));
//inicializar motor de plantillas
app.engine("handlebars", handlebars.engine());

//Ubicación de vistas en mi proyecto
app.set("views", carpetaViews);

//plantillas a utilizar
app.set("view engine", "handlebars");
 


app.get("/", (req, res) => {
res.render("productos");
})

app.post("/productos", (req, res) => {
    const producto = productos.addProduct(req.body); 
    console.log(producto);
    res.redirect("/"); 
});


app.get("/productos", (req, res)=>{
    let total = productos.getProductos()
    console.log(total);
    if(total.length >0 ){
        res.render("listado", {total: total});
    }else
    res.render("vacio")

});

