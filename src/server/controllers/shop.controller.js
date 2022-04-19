import shopItemModel from "../models/shopItem.model"
import errorHandler from './../helpers/dbErrorHandler'

const listAll = async (req, res) => {
    try {
      let posts = await shopItemModel.find().select('_id name description stock image price')
      res.json(posts)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

export default {
    listAll
}