import express from 'express'
import blogCtrl from '../controllers/blog.controller'
import authCtrl from '../controllers/auth.controller'

const router = express.Router()

router.route('/api/blogs')
  .get(blogCtrl.listAll)

router.route('/api/blogs/:blog_id')
  .get(blogCtrl.read)
  .put(authCtrl.requireSignIn, authCtrl.hasAuthorization, blogCtrl.update)
  
router.param('blog_id', blogCtrl.blogPostByID)

export default router
