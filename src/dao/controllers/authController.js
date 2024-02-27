// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Buscar al usuario por su correo electrónico en la base de datos
//     const user = await User.findOne({ email });

//     // Verificar si el usuario existe y si la contraseña es válida
//     if (!user || !bcrypt.compareSync(password, user.password)) {
//       return res.status(401).json({ message: "Credenciales inválidas" });
//     }

//     // Guardar el usuario en la sesión
//     req.session.user = {
//       id: user._id,
//       email: user.email,
//       role: user.role,
//     };

//     res.redirect("/productos"); // Redireccionar a la página de productos después del inicio de sesión
//   } catch (error) {
//     console.error("Error al iniciar sesión:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };

// exports.registerUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     // Verificar si el usuario ya existe en la base de datos
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res
//         .status(400)
//         .json({ message: "El correo electrónico ya está en uso" });
//     }

//     // Hashear la contraseña antes de almacenarla en la base de datos
//     const hashedPassword = bcrypt.hashSync(password, 10);

//     // Crear un nuevo usuario
//     const newUser = await User.create({ email, password: hashedPassword });

//     res
//       .status(201)
//       .json({ message: "Usuario registrado exitosamente", user: newUser });
//   } catch (error) {
//     console.error("Error al registrar usuario:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };

// exports.logoutUser = async (req, res) => {
//   try {
//     // Destruir la sesión del usuario
//     req.session.destroy((err) => {
//       if (err) {
//         console.error("Error al cerrar sesión:", err);
//         return res.status(500).json({ message: "Error interno del servidor" });
//       }
//       res.redirect("/login"); // Redireccionar al usuario a la página de inicio de sesión después de cerrar sesión
//     });
//   } catch (error) {
//     console.error("Error al cerrar sesión:", error);
//     res.status(500).json({ message: "Error interno del servidor" });
//   }
// };
