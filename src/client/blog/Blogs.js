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
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'

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
  },
  recent_post_title: {
    textDecoration: "none",
    color: "gray"
  },
  comments_section: {
    width: "100%",
    padding: "10px",
    backgroundColor: "white",
    boxSizing: "border-box",
    marginTop: "20px"
  },
  comments_section_header_sort_container: {
    justifyContent: "space-between",
    display: "flex",
    flexDirection: "row",
    marginBottom: "10px"
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
  posts.sort(sortNewestToOldest);
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
function sortNewestToOldest(post_a, post_b) {
  if ( a.posting_time > b.posting_time){
    return -1;
  }
  if ( a.posting_time < b.posting_time){
    return 1;
  }
  return 0;
}

function sortOldestToNewest(a, b) {
  if ( a.posting_time < b.posting_time){
    return -1;
  }
  if ( a.posting_time > b.posting_time){
    return 1;
  }
  return 0;
}

function sortMostLikedToLeastLiked(a, b) {
  if ( a.likes < b.likes){
    return -1;
  }
  if ( a.likes > b.likes){
    return 1;
  }
  return 0;
}

function sortLeastLikedToMostLiked(a, b) {
  if ( a.likes > b.likes){
    return -1;
  }
  if ( a.likes < b.likes){
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

  const [sort_comments_value, setSortCommentsValue] = useState("most liked - least liked");

  /**
   * Method for sorting comments
   * @param {*} event Select where value was changed
   */
  const sortComments = event => {
    setSortCommentsValue(event.target.value);
    switch (event.target.value) {
      case "newest - oldest":
        blog_post.comments.sort(sortNewestToOldest);
        break;
      case "oldest - newest":
        blog_post.comments.sort(sortOldestToNewest);
        break;
      case "least liked - most liked":
        blog_post.comments.sort(sortLeastLikedToMostLiked);
        break;
      default:
        blog_post.comments.sort(sortMostLikedToLeastLiked);
    }

    var blog_post_copy = [];
    blog_post_copy.push(blog_post);
    setBlogPost(blog_post_copy[0]);
  }

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

            <Card className={classes.comments_section}>
              <CardContent>
                <div className={classes.comments_section_header_sort_container}>
                  <Typography variant="h6">Comments</Typography>
                  <FormControl className={classes.sort_comments_form_control} variant="outlined">
                    <InputLabel id="demo-simple-select-label">Sort Comments</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={sort_comments_value}
                      label="Sort Comments"
                      onChange={sortComments}
                    >
                      <MenuItem value="newest - oldest">Newest - Oldest</MenuItem>
                      <MenuItem value="oldest - newest">Oldest - Newest</MenuItem>
                      <MenuItem value="most liked - least liked">Most Liked - Least Liked</MenuItem>
                      <MenuItem value="least liked - most liked">Least Liked - Most Liked</MenuItem>
                    </Select>
                  </FormControl>
                </div>
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
                  return <Link to={"/blogs/" + recent_post.blog_id} className={classes.recent_post_title}>
                          <ListItem button>
                            <ListItemText primary={recent_post.content.title} />
                          </ListItem>
                        </Link>
                }))}

              </List>
            </Card>
          </div>

        </div>

      </Card>
    )
}
