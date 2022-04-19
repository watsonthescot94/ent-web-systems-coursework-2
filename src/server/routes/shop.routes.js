import express from 'express'
import shopCtrl from '../controllers/shop.controller'

const router = express.Router()

router.route('/api/shop')
  .get(shopCtrl.listAll)

export default router
