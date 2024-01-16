
console.log("esta funcionando");

const socket = io();

socket.emit("mensaje", "hola mundillo");

socket.on("saludos", (data) => {
    console.log(data);
})
