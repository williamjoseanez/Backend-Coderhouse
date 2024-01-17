console.log("esta funcionando");

const socket = io();

socket.on("products", (data) => {
    //   renderProductos(data);
    if (Array.isArray(data) && data.length > 0) {
        renderProductos(data);
      } else {
        console.error('Received data is not a valid array:', data);
      }
});

const renderProductos = (products) => {
  const contenedorProductos = document.getElementById("contenedorProductos");
  contenedorProductos.innerHTML = "";

  products.forEach((product) => {
    const card = document.createElement("div");

    card.classList.add("card");
    //Agregamos boton para eliminar:

    card.innerHTML = `
                <img src="${product.thumbnail}" alt="Imagen de ${product.name}">
                <p>Id ${product.id} </p>
                <p>Titulo ${product.title}</p>
                <p>Precio ${product.price}</p>
                <button> Eliminar Producto </button>
        
        `;

    contenedorProductos.appendChild(card);

    card.querySelector("button").addEventListener("click", () => {
      eliminarProducto(product.id);
    });
  });
};

const eliminarProducto = (id) => {
  socket.emit("eliminarProducto", id);
};

document.getElementById("btnEnviar").addEventListener("click", () => {
 agregarProducto();
});

const agregarProducto = () => {
  const product = {
    title: document.getElementById("title").value,
    description: document.getElementById("description").value,
    price: document.getElementById("price").value,
    thumbnail: document.getElementById("thumbnail").value,
    code: document.getElementById("code").value,
    stock: document.getElementById("stock").value,
    category: document.getElementById("category").value,
    status: document.getElementById("status").value === "true",
  };

  socket.emit("agregarProducto", product);

 
};
