const { Router } = require("express");
const { toJWT, toData } = require("./jwt");
const bcrypt  = require("bcrypt");
const User = require(".././user/model");

const router = new Router();

router.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    console.log("no valid email en pass")
    res.status(400).send({
      message: "Please supply a valid email and password"
    });
  } else {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(entity => {
        if (!entity) {
          console.error("no user found")
          res.status(400).send({
            message: "User with that email does not exist"
          });
        }

        // 2. use bcrypt.compareSync to check the password against the stored hash
        else if (bcrypt.compareSync(req.body.password, entity.password)) {
          // 3. if the password is correct, return a JWT with the userId of the user (user.id)
          console.log("send jwt to user")
          res.send({
            jwt: toJWT({ userId: entity.id })
          });
        } else {
          res.status(400).send({
            message: "Password was incorrect"
          });
        }
      })
      .catch(err => {
        console.error(err);
        //res.status(500).send({
        //  message: "Something went wrong"
       // });
      });
   
  }
});

module.exports = router;
