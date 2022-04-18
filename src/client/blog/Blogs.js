import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {listAll, read} from './api-blog'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemText from '@material-ui/core/ListItemText'

const useStyles = makeStyles(theme => ({
  page_container: {
    width: "80%",
    margin: "auto",
    backgroundColor: "lightgray"
  },
  page_content_container: {
    padding: "20px",
    display: "flex",
    flexDirection: "row"
  },
  blog_post_and_comments: {
    flex: 3,
    padding: "10px",
    backgroundColor: "lightgray"
  },
  blog_post: {
    maxWidth: "100%"
  },
  most_recent_posts_container: {
    flex: 1,
    padding: "10px"
  },
  list_container: {
    backgroundColor: "white"
  }
}))

/**
 * Method for converting the blog posting date to a string
 * @param {*} time Posting date in milliseconds
 * @returns Blog posting date as a string
 */
function getBlogPostingDate(time) {
  return (new Date().toDateString());
}

/**
 * Method for getting the 10 most recent blog posts
 * @param {*} posts All blog posts
 * @returns 10 most recent blog posts
 */
function getMostRecentPosts(posts) {
  console.log("getMostRecentPosts()");
  posts.sort(sortRecentPosts);
  if (posts.length < 10) {
    return posts;
  }
  return posts.splice(0, 10);
}

/**
 * Method for sorting posts from newest to oldest
 * Method has been adapted from:
 * https://www.delftstack.com/howto/javascript/sort-array-based-on-some-property-javascript
 * @param {*} post_a First post to be compared
 * @param {*} post_b Second post to be compared
 * @returns Indication of array position change
 */
function sortRecentPosts(post_a, post_b) {
  if ( post_a.posting_time > post_b.posting_time){
    return -1;
  }
  if ( post_a.posting_time < post_b.posting_time){
    return 1;
  }
  return 0;
}

export default function Blogs({match}){
  const classes = useStyles()
  const [blog_post, setBlogPost] = useState({ "content": {}, "comments": []});
  const [most_recent_posts, setMostRecentPosts] = useState([]);

  useEffect(() => {
    const abortController = new AbortController()
    const signal = abortController.signal

    read({ blog_id: match.params.blog_id }, signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      } else {
        setBlogPost(data);
        document.title = data.content.title + " | Love for the Uglies";
      }
    })

    listAll(signal).then((data) => {
      if (data && data.error) {
        console.log("error");
        console.log(data);
        console.log(data.error);
      }
      else {
        console.log("success");
        console.log(data);
        setMostRecentPosts(getMostRecentPosts(data));
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

          <div className={classes.most_recent_posts_container}>
            <Card className={classes.list_container}>
              <List
                component="nav"
                aria-label="recent posts"
                subheader={
                  <ListSubheader component="div">
                    Recent Posts
                  </ListSubheader>
                }
              >
                {most_recent_posts.map((recent_post => {
                  return <ListItem button>
                    <ListItemText primary={recent_post.content.title} />
                    </ListItem>
                }))}

              </List>
            </Card>
          </div>

        </div>

      </Card>
    )
}
