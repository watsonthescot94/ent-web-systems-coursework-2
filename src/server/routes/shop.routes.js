import express from 'express'
import shopCtrl from '../controllers/shop.controller'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/shop')
  .get(shopCtrl.listAll)

router.route('/api/addtocart/:user_id')
  .put(authCtrl.requireSignIn, authCtrl.hasAuthorization, shopCtrl.addToCart)

router.param('user_id', userCtrl.userByID)

export default router
