const express = require("express");
const router = express.Router();
const UserModel = require("../dao/models/user.model.js");
const { isValidPassword } = require("../utils/hashBcrypt.js");
const passport = require("passport");

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Verifico si las credenciales coinciden con el administrador
  if (email === "adminCoder@coder.com" && password === "adminCoder@coder.com") {
    // Si las credenciales son correctas para el administrador, configuro la sesión del usuario como administrador
    req.session.user = {
      first_name: "Admin",
      last_name: "Admin",
      email: email,
      role: "admin",
    };
    req.session.login = true;
    return res.redirect("/products"); // Redirecciono al administrador a la página de productos
  } else {
    // Busco al usuario en la base de datos
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      // Si el usuario no existe, enviar un mensaje de error
      return res
        .status(400)
        .send({ status: "error", message: "Usuario no encontrado" });
    }

    // Verifico si la contraseña es válida
    const isValid = isValidPassword(password, user);
    if (!isValid) {
      // Si la contraseña es inválida, envio un mensaje de error
      return res
        .status(400)
        .send({ status: "error", message: "Credenciales Inválidas" });
    }

    // Configuro la sesión del usuario y redirigir a la página de productos
    req.session.user = {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    };
    req.session.login = true;
    return res.redirect("/products"); // Redirecciono al usuario a la página de productos
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

///////////////////////////////////////////////VERSION PARA GITHUB

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  async (req, res) => {
    //La estrategía de github nos retornará el usuario, entonces lo agregamos a nuestro objeto de session.
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/products");
  }
);

// /////////////////////////////////////////////////////////////JWT
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await UserModel.findOne({ email: email });
//     if (!user) {
//       res.status(400).send({status:"error", message: "usuario desconocido"})
//     }
//     if (isValidPassword(password, user)) {
//   res.status(400).send({status: "error", message: "credenciales Invalidas"})
//     }
//   } catch (error) {
//     console.log("error en la autenticacion", error);
//     res
//       .status(500)
//       .send({ status: "error", message: "Error interno del servidor" });
//   }
// });

module.exports = router;
