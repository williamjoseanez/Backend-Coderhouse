// const mongoose = require("mongoose");

// //Creamos el esquema del Usuario
// const userSchema = mongoose.Schema({
//   first_name: {
//     type: String,
//     required: true,
//   },
//   last_name: {
//     type: String,
//     // required: true,
//   },
//   email: {
//     type: String,
//     // required: true,
//     index: true,
//     unique: true,
//   },
//   password: {
//     type: String,
//     // required: true,
//   },
//   age: {
//     type: Number,
//     // required: true,
//   },
//   role: {
//     type: String,
//     // required: true,
//   },
// });

// const UserModel = mongoose.model("users", userSchema);
// module.exports = UserModel;

const mongoose = require("mongoose");

// Creamos el esquema del Usuario
const userSchema = mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    // required: true, // Ahora este campo es requerido
    index: true,
    unique: true,
  },
  password: {
    type: String,
    // required: true, // Ahora este campo es requerido
  },
  age: {
    type: Number,
    // required: true, // Ahora este campo es requerido
  },
  role: {
    type: String,
    // required: true, // Ahora este campo es requerido
  },
});

const UserModel = mongoose.model("users", userSchema);
module.exports = UserModel;
