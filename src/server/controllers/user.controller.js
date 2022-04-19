import User from '../models/user.model'
import errorHandler from '../helpers/dbErrorHandler'

const create = async(req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        return res.status(200).json({
            message: "Successfully created new account"
        })
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err)
        })
    }
}

const userByID = async (req, res, next, id) => {
    try {
      let user = await User.findById(id)
      if (!user)
        return res.status('400').json({
          error: "User not found"
        })
      req.user = user
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve user"
      })
    }
  }

export default {
    create,
    userByID
}