import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
}))

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
      <div></div>
    )
}
