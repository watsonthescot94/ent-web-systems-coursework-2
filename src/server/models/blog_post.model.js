import mongoose from 'mongoose'

const Tier3CommentSchema = new mongoose.Schema({
    comment_id: {
        type: String,
        trim: true
    },
    author: {
        user_id: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    },
    text: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    likes: {
        type: Number,
        trim: true
    },
    posting_time: {
        type: Number,
        trim: true
    },
    replying_to: {
        user_id: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    }
})

const Tier2CommentSchema = new mongoose.Schema({
    comment_id: {
        type: String,
        trim: true
    },
    author: {
        user_id: {
            type: String,
            trim: true
        },
        user_username: {
            type: String,
            trim: true
        }
    },
    text: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    likes: {
        type: Number,
        trim: true
    },
    posting_time: {
        type: Number,
        trim: true
    },
    replies: {
        type: [Tier3CommentSchema]
    },
    replying_to: {
        user_id: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    }
})

const Tier1CommentSchema = new mongoose.Schema({
    comment_id: {
        type: String,
        trim: true
    },
    author: {
        user_id: {
            type: String,
            trim: true
        },
        user_username: {
            type: String,
            trim: true
        }
    },
    text: {
        type: String,
        trim: true
    },
    avatar: {
        type: String,
        trim: true
    },
    likes: {
        type: Number,
        trim: true
    },
    posting_time: {
        type: Number,
        trim: true
    },
    replies: {
        type: [Tier2CommentSchema]
    },
    replying_to: {
        user_id: {
            type: String,
            trim: true
        },
        username: {
            type: String,
            trim: true
        }
    }
})

const BlogPostSchema = new mongoose.Schema({
  blog_id: {
    type: String,
    trim: true,
    unique: true,
    index: true
  },
  content: {
      title: {
          type: String,
          trim: true
      },
      text: {
          type: String,
          trim: true
      },
      image: {
          type: String,
          trim: true
      }
  },
  author: {
      type: String,
      trim: true
  },
  posting_time: {
      type: Number,
      trim: true
  },
  comments: {
      type: [Tier1CommentSchema]
  }
})

const BlogPostModel = mongoose.model('Blog Post', BlogPostSchema, 'blog_posts');
BlogPostModel.createIndexes();
export default BlogPostModel
