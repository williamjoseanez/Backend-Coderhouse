const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

// Login - POST;
// router.post("/login", passport.authenticate("login", { failureRedirect: "api/sessions/faillogin" }), async (req, res) => {
//     if (!req.user)
//         return res.status(400).send({ status: "error", message: "Credenciales Invalidas" });
//     if (req.user.email === "adminCoder@coder.com") {
//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             email: req.user.email,
//             age: req.user.age,
//             role: "admin",
//         };
//     } else {
//         req.session.user = {
//             first_name: req.user.first_name,
//             last_name: req.user.last_name,
//             email: req.user.email,
//             age: req.user.age,
//             role: req.user.role,
//         };
//     }
//     req.session.login = true;
//     res.redirect("/products");
// });
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Verificar si las credenciales coinciden con el administrador
  if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
    // Si las credenciales son correctas para el administrador, configurar la sesión del usuario como administrador
    req.session.user = {
      first_name: "Admin",
      last_name: "Admin",
      email: email,
      role: "admin",
    };
    req.session.login = true;
    return res.redirect("/products"); // Redireccionar al administrador a la página de productos
  } else {
    // Buscar al usuario en la base de datos
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      // Si el usuario no existe, enviar un mensaje de error
      return res
        .status(400)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    // Verificar si la contraseña es válida
    const isValid = isValidPassword(password, user);
    if (!isValid) {
      // Si la contraseña es inválida, enviar un mensaje de error
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales Inválidas" });
    }

    // Configurar la sesión del usuario y redirigir a la página de productos
    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.login = true;
    return res.redirect("/products"); // Redireccionar al usuario a la página de productos
  }
});

//Logout - GET
router.get("/logout", (req, res) => {
  try {
    if (req.session.login) {
      req.session.destroy();
    }
    res.redirect("/login");
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

router.get("/faillogin", async (req, res) => {
  res.json({ message: "fallo la estrategia" });
});

module.exports = router;
