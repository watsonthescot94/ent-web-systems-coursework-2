import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {read} from './api-blog'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import { CardContent } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
}))

/**
 * Method for converting the blog posting date to a string
 * @param {*} time Posting date in milliseconds
 * @returns Blog posting date as a string
 */
function getBlogPostingDate(time) {
  return (new Date().toDateString());
}

export default function Blogs({match}){
  const classes = useStyles()
  const [blog_post, setBlogPost] = useState({ "content": {}, "comments": []});

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ blog_id: match.params.blog_id }, signal).then((data) => {
      if (data && data.error) {
        console.log("Blog post not found");
      } else {
        setBlogPost(data);
        console.log("Blog post:");
        console.log(blog_post);
        document.title = blog_post.content.title + " | Love for the Uglies";
      }
    })

    return function cleanup(){
      abortController.abort()
    }
  }, [match.params.blog_id])

    return (
      <Card className={classes.page_container}>

        <div className={classes.page_content_container}>
          <div className={classes.blog_post_and_comments}>
            <Card className={classes.blog_post}>
              <CardMedia
                component="img"
                image={"/assets/images/blog_post_images/" + blog_post.content.image}
                alt={blog_post.content.image}
              />
              <CardContent>
                <Typography variant="h5">{blog_post.content.title}</Typography>
                <Typography variant="body1">{getBlogPostingDate(blog_post.posting_time)}</Typography>
                <Typography variant="body1">{"Posted by " + blog_post.author}</Typography>
                <br/>
                <Typography variant="body2">{blog_post.content.text}</Typography>
              </CardContent>
            </Card>
          </div>
        </div>

      </Card>
    )
}
