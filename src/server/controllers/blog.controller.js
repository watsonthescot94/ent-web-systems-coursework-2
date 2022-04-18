import BlogPost from '../models/blog_post.model.js'

const listAll = async (req, res) => {
    try {
      let posts = await BlogPost.find().select('blog_id content author posting_time comments')
      res.json(posts)
    } catch (err) {
      return res.status(400).json({
        error: errorHandler.getErrorMessage(err)
      })
    }
}

const blogPostByID = async (req, res, next, id) => {
    try {
      let post = await BlogPost.findOne({blog_id: id})
      if (!post)
        return res.status('400').json({
          error: "Post not found"
        })
      req.post = post
      next()
    } catch (err) {
      return res.status('400').json({
        error: "Could not retrieve post"
      })
    }
}

const read = (req, res) => {
    return res.json(req.post)
  }

  export default {
      listAll,
      blogPostByID,
      read
  }