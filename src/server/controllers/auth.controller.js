import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import config from './../../config/config'
import expressJwt from 'express-jwt'

const login = async (req, res) => {
  try {
      let user = await User.findOne({
        "username": req.body.username
      })
      if (!user)
        return res.status('401').json({
          error: "Account not found"
        })

      if (!user.authenticate(req.body.password)) {
        return res.status('401').send({
          error: "Incorrect credentials"
        })
      }

      const token = jwt.sign({
        _id: user._id
      }, config.jwtSecret)

      res.cookie("t", token, {
        expire: new Date() + 9999
      })

      return res.json({
        token,
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar
        }
      })

    } catch (err) {

      return res.status('401').json({
        error: "Login failed"
      })

    }
}

const requireSignIn = expressJwt({
    secret: config.jwtSecret,
    userProperty: 'auth',
    algorithms: ['HS256']
  })

const hasAuthorization = (req, res, next) => {
    console.log("req.body.current_user:");
    console.log(req.body.current_user);
    console.log("req.auth:");
    console.log(req.auth);
    const authorized = req.body.current_user && req.auth && req.body.current_user.id == req.auth._id
    if (!(authorized)) {
      return res.status('403').json({
        error: "User is not authorized"
      })
    }
    next()
  }

export default {
    login,
    hasAuthorization,
    requireSignIn
}