const router = require("express").Router()

router.get("/login-status", (req, res) => {
  let { email, password } = req.app.locals.credentials

  res.json({
    response: {
      isLogin: !!email && !!password,
      email
    }
  })
})

router.post("/login", (req, res) => {
  let { email, password } = req.body
  req.app.locals.credentials = { email, password }

  res.status(201).json({
    response: {
      message: "login success"
    }
  })
})

module.exports = router
