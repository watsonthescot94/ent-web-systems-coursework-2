import User from '../models/user.model'
import jwt from 'jsonwebtoken'
import config from './../../config/config'

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

export default {
    login
}