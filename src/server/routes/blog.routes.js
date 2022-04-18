import express from 'express'
import blogCtrl from '../controllers/blog.controller'

const router = express.Router()

router.route('/api/blogs')
  .get(blogCtrl.listAll)

router.route('/api/blogs/:blog_id')
  .get(blogCtrl.read)
  
router.param('blog_id', blogCtrl.blogPostByID)

export default router
