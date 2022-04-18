import React, {useState, useEffect} from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {listAll, read} from './api-blog'
import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/CardMedia'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/CardActions'
import CardHeader from '@material-ui/core/CardHeader'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from 'react-router-dom'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import Avatar from '@material-ui/core/Avatar'
import IconButton from '@material-ui/core/IconButton'
import ThumbUp from '@material-ui/icons/ThumbUp'
import ThumbDown from '@material-ui/icons/ThumbDown'
import Button from '@material-ui/core/Button'

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
  },
  sort_comments_form_control: {
    width: "30%"
  },
  comments: {
    width: "100%",
    backgroundColor: "blue",
    padding: "10px",
    boxSizing: "border-box"
  },
  comment_and_replies: {
    width: "100%"
  },
  tier_0: {
    width: "100%",
    marginBottom: "10px"
  },
  tier_1: {
    marginLeft: "10%",
    width: "90%",
    marginBottom: "10px"
  },
  tier_2: {
    marginLeft: "20%",
    width: "80%",
    marginBottom: "10px"
  },
  like_button: {
    color: "lightgray"
  }
}))

var like_tracker = [];

function createLikeTracker(comments) {
  for (const tier_0_i in comments) {
    like_tracker.push({
      "id": comments[tier_0_i].comment_id,
      "already_liked": false,
      "already_disliked": false
    })
    
    for (const tier_1_i in comments[tier_0_i].replies) {
      like_tracker.push({
        "id": comments[tier_0_i].replies[tier_1_i].comment_id,
        "pushed": false
      })

      for (const tier_2_i in comments[tier_0_i].replies[tier_1_i].replies) {
        like_tracker.push({
          "id": comments[tier_0_i].replies[tier_1_i].replies[tier_2_i].comment_id,
          "pushed": false
        })
      }
    }
  }
}

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
function sortNewestToOldest(a, b) {
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

/**
 * Method for calculating the time since a comment was posted
 * Calculation adapted from: 
 * https://stackoverflow.com/a/3177838/11265897
 * @param {*} comment_date Date comment was posted
 * @returns String value representing time since comment was posted
 */
 function calculateCommentTimestamp(comment_date) {
  var secs = Math.floor((new Date() - comment_date) / 1000);
  var interval = secs / 31536000;

  if (interval >= 1) {
    if (interval < 2) {
      return "1 year ago";
    }
    else {
      return Math.floor(interval) + " years ago";
    }
  }

  interval = secs / 2592000;
  if (interval >= 1) {
    if (interval < 2) {
      return "1 month ago"
    }
    else {
      return Math.floor(interval) + " months ago";
    }
  }

  interval = secs / 86400;
  if (interval >= 1) {
    if (interval < 2) {
      return "1 day ago"
    }
    else {
      return Math.floor(interval) + " days ago"
    };
  }
  interval = secs / 3600;
  if (interval >= 1) {
    if (interval < 2) {
      return "1 hr ago"
    }
    else {
      return Math.floor(interval) + " hrs ago";
    }
  }
  interval = secs / 60;
  if (interval >= 1) {
    if (interval < 2) {
      return "1 min ago"
    }
    else {
      return Math.floor(interval) + " mins ago";
    }
  }
  if (secs >= 2) {
    return secs + " secs ago";
  }
  return "1 sec ago";
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
        createLikeTracker(data.comments)
        document.title = data.content.title + " | Love for the Uglies";
      }
    })

    listAll(signal).then((data) => {
      if (data && data.error) {
        console.log(data.error);
      }
      else {
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
    if (blog_post.comments.length > 0) {
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
  }

  var logged_in = true;
  var current_user_username = "lisasimpson";

  const handleLikeClick = (id, like) => event => {
    if (logged_in) {
      var like_button = document.getElementById("like_button_" + id);
      var dislike_button = document.getElementById("dislike_button_" + id);

      for (const i in like_tracker) {
        if (like_tracker[i].id == id) {
          // If user is liking a comment
          if (like == 1) {
            // If user has already liked the comment
            if (like_tracker[i].already_liked == true) {
              like_button.style.color = "lightgray";
              like_tracker[i].already_liked = false;
              like = -1;
            }
            // If user has not already liked the comment
            else {
              like_button.style.color = "blue";
              like_tracker[i].already_liked = true;
              // If user has already disliked the comment
              if (like_tracker[i].already_disliked == true) {
                like = 2;
                like_tracker[i].already_disliked = false;
                dislike_button.style.color = "lightgray"
              }
            }
          }
          // If user is disliking a comment
          else {
            // If user has already disliked the comment
            if (like_tracker[i].already_disliked == true) {
              dislike_button.style.color = "lightgray";
              like_tracker[i].already_disliked = false;
              like = 1;
            }
            // If user has not already disliked the comment
            else {
              dislike_button.style.color = "blue";
              like_tracker[i].already_disliked = true;
              // If user has already liked the comment
              if (like_tracker[i].already_liked == true) {
                like = -2;
                like_tracker[i].already_liked = false;
                like_button.style.color = "lightgray";
              }
            }
          }
          break;
        }
      }

      var comment = findComment(blog_post.comments, id);
      comment.likes += like;

      handleSetComments();
    }
    else {
      setDialogTitle("Sign In");
      setDialogDescription("You must be signed in to like/dislike comments");
      setDialogOpen(true);
    }
  }

  const handleReplyButtonClick = id => event => {

  }
  
  const handleEditCommentClick = id => event => {
  
  }
  
  const handleDeleteComment = id => event => {
    
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

                <Card className={classes.comments}>
                    {blog_post.comments.map((tier_0_comment) => {
                      return <div className={classes.comment_and_replies} key={"key_" + tier_0_comment.comment_id}>

                        <Card id={"comment_" + tier_0_comment.comment_id} className={classes.tier_0}>
                          <CardHeader
                            avatar={
                              <Link to={"/user/" + tier_0_comment.author.username}>
                                <Avatar alt={tier_0_comment.author.username} src={"/assets/images/avatars/" + tier_0_comment.avatar}/></Link>
                            }
                            title={<Link to={"/user/" + tier_0_comment.author.username}>{tier_0_comment.author.username}</Link>}
                            subheader={calculateCommentTimestamp(tier_0_comment.posting_time)}
                          />
                          <CardContent>
                            <Typography variant="h6">
                              {tier_0_comment.text}
                            </Typography>
                          </CardContent>
                          <CardActions>
                            <IconButton aria-label="Like" id={"like_button_" + tier_0_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_0_comment.comment_id, 1)}>
                              <ThumbUp/>
                            </IconButton>
                            <Typography variant="h6">
                              {tier_0_comment.likes}
                            </Typography>
                            <IconButton aria-label="Dislike" id={"dislike_button_" + tier_0_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_0_comment.comment_id, -1)}>
                              <ThumbDown/>
                            </IconButton>
                            <Button variant="contained" onClick={handleReplyButtonClick(tier_0_comment.comment_id)}>REPLY</Button>
                            { current_user_username == tier_0_comment.author.username && (
                              <span>
                                <Button variant="contained" onClick={handleEditCommentClick(tier_0_comment.comment_id)}>EDIT</Button>
                                <Button variant="contained" onClick={handleDeleteComment(tier_0_comment.comment_id)}>DELETE</Button>
                              </span>
                            )}
                          </CardActions>
                        </Card>

                      </div>
                    })}
                </Card>


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
