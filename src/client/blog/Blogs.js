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
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import FormHelperText from '@material-ui/core/FormHelperText/FormHelperText'
import OutlinedInput from '@material-ui/core/OutlinedInput'

const { v4: uuidv4 } = require('uuid');

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
  },
  hidden: {
    display: "none"
  },
  write_comment_buttons_container: {
    display: "flex",
    justifyContent: "right",
    width: "100%",
    marginBottom: "10px",
  },
  bottom_button: {
    marginRight: "10px"
  },
  username: {
    textDecoration: "none",
    color: "black"
  }
}))

var like_tracker = [];
var comment_max_length = 1000;

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
        "already_liked": false,
        "already_disliked": false
      })

      for (const tier_2_i in comments[tier_0_i].replies[tier_1_i].replies) {
        like_tracker.push({
          "id": comments[tier_0_i].replies[tier_1_i].replies[tier_2_i].comment_id,
          "already_liked": false,
          "already_disliked": false
        })
      }
    }
  }
}

/**
 * Method for redirecting the user to the sign in page
 */
function signInRedirect() {
  window.location.href = "/signin";
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
  if ( a.likes > b.likes){
    return -1;
  }
  if ( a.likes < b.likes){
    return 1;
  }
  return 0;
}

function sortLeastLikedToMostLiked(a, b) {
  if ( a.likes < b.likes){
    return -1;
  }
  if ( a.likes > b.likes){
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

/**
 * Method for finding a comment from its id
 * @param {} comments Array of comments
 * @param {*} id ID of comment to be found
 * @returns Comment
 */
function findComment(comments, id) {
  for (const tier_0_i in comments) {
    if (comments[tier_0_i].comment_id == id) {
      return comments[tier_0_i];
    }
    else {
      for (const tier_1_i in comments[tier_0_i].replies) {
        if (comments[tier_0_i].replies[tier_1_i].comment_id == id) {
          return comments[tier_0_i].replies[tier_1_i];
        }
        else {
          for (const tier_2_i in comments[tier_0_i].replies[tier_1_i].replies) {
            if (comments[tier_0_i].replies[tier_1_i].replies[tier_2_i].comment_id == id) {
              return comments[tier_0_i].replies[tier_1_i].replies[tier_2_i];
            }
          }
        }
      }
    }
  }
  return -1
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

  const handleSetBlogPost = () => {
    console.log("handleSetBlogPost() fired");
    setBlogPost(JSON.parse(JSON.stringify(blog_post)));
  }

  const [dialog_open, setDialogOpen] = useState(false);
  const [dialog_description, setDialogDescription] = useState("");
  const [dialog_title, setDialogTitle] = useState("");
  const handleDialogClose = () => {
    setDialogOpen(false);
  }

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
    }

    handleSetBlogPost();
  }

  var logged_in = true;
  var current_user_username = "ben_ten";
  var current_user_id = "1493504";
  var current_user_avatar = "avatar_3.jpg";

  const handleLikeClick = (id, like) => event => {
    console.log("like: " + like);
    console.log("like_tracker: ");
    console.log(like_tracker);
    let changeLike = like;

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
              changeLike = -1;
            }
            // If user has not already liked the comment
            else {
              like_button.style.color = "blue";
              like_tracker[i].already_liked = true;
              // If user has already disliked the comment
              if (like_tracker[i].already_disliked == true) {
                changeLike = 2;
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
              changeLike = 1;
            }
            // If user has not already disliked the comment
            else {
              dislike_button.style.color = "blue";
              like_tracker[i].already_disliked = true;
              // If user has already liked the comment
              if (like_tracker[i].already_liked == true) {
                changeLike = -2;
                like_tracker[i].already_liked = false;
                like_button.style.color = "lightgray";
              }
            }
          }
          break;
        }
      }

      var comment = findComment(blog_post.comments, id);
      console.log("Found comment:");
      console.log(comment);
      comment.likes += changeLike;

      handleSetBlogPost();
    }
    else {
      setDialogTitle("Sign In");
      setDialogDescription("You must be signed in to like/dislike comments");
      setDialogOpen(true);
    }
  }

  const handleReplyButtonClick = id => event => {
    document.getElementById("write_reply_card_" + id).style.display = "inline-block";
    document.getElementById("reply_input_" + id).focus();
  }

  const handleReplyTextChange = id => event => {
    document.getElementById("reply_length_counter_" + id).innerHTML = event.target.value.length + "/" + comment_max_length;
  }

  const handleCancelReplyClick = id => event => {
    document.getElementById("write_reply_card_" + id).style.display = "none";
  }

  const handleSubmitReplyClick = id => event => {
    event.stopPropagation();
    const comment_text = document.getElementById("reply_input_" + id).value.trim().replace(/(<([^>]+)>)/gi, "");
    var success = true;

    var new_comment = {
      "comment_id": uuidv4(),
        "author": {
          "user_id": current_user_id,
          "username": current_user_username,
        },
        "text": comment_text,
        "posting_time": Date.now(),
        "avatar": current_user_avatar,
        "likes": 0
    }

    if (success) {
      if (comment_text.length > 0) {
        for (const tier_0_i in blog_post.comments) {
          if (blog_post.comments[tier_0_i].comment_id == id) {
            new_comment.replies = [];
            new_comment.replying_to = {
              "user_id": blog_post.comments[tier_0_i].author.user_id,
              "username": blog_post.comments[tier_0_i].author.username
            }
            blog_post.comments[tier_0_i].replies.push(new_comment);
            break;
          }
          else {
            for (const tier_1_i in blog_post.comments[tier_0_i].replies) {
              if (blog_post.comments[tier_0_i].replies[tier_1_i].comment_id == id) {
                new_comment.replies = [];
                new_comment.replying_to = {
                  "user_id": blog_post.comments[tier_1_i].author.user_id,
                  "username": blog_post.comments[tier_1_i].author.username
                }
                blog_post.comments[tier_0_i].replies[tier_1_i].replies.push(new_comment);
                break;
              }
              else {
                for (const tier_2_i in blog_post.comments[tier_0_i].replies[tier_1_i].replies) {
                  if (blog_post.comments[tier_0_i].replies[tier_1_i].replies[tier_2_i].comment_id == id) {
                    new_comment.replying_to = {
                      "user_id": blog_post.comments[tier_2_i].author.user_id,
                      "username": blog_post.comments[tier_2_i].author.username
                    }
                    blog_post.comments[tier_0_i].replies[tier_1_i].replies.push(new_comment);
                    break;
                  }
                }
              }
            }
          }
        }

        like_tracker.push({
          "id": new_comment.comment_id,
          "already_liked": false,
          "already_disliked": false
        })

        document.getElementById("reply_input_" + id).value = "";
        document.getElementById("reply_length_counter_" + id).innerHTML = "0/1000";
        document.getElementById("write_reply_card_" + id).style.display = "none";

        handleSetBlogPost();
      }
    }
  }
  
  const handleEditCommentClick = id => event => {
    var comment_text = findComment(blog_post.comments, id).text;
    document.getElementById("edit_comment_card_" + id).style.display = "inline-block";
    document.getElementById("comment_" + id).style.display = "none";
    document.getElementById("edit_comment_input_" + id).value = comment_text;
    document.getElementById("edit_comment_length_counter_" + id).innerHTML = comment_text.length + "/1000";
  }
  
  const handleDeleteComment = id => event => {
    for (const tier_0_i in blog_post.comments) {
      if (blog_post.comments[tier_0_i].comment_id == id) {
        blog_post.comments.splice(tier_0_i, 1);
        break;
      }
      else {
        for (const tier_1_i in blog_post.comments[tier_0_i].replies) {
          if (blog_post.comments[tier_0_i].replies[tier_1_i].comment_id == id) {
            blog_post.comments[tier_0_i].replies.splice(tier_1_i, 1);
            break;
          }
          else {
            for (const tier_2_i in blog_post.comments[tier_0_i].replies[tier_1_i].replies) {
              if (blog_post.comments[tier_0_i].replies[tier_1_i].replies[tier_2_i].comment_id == id) {
                blog_post.comments[tier_0_i].replies[tier_1_i].replies.splice(tier_2_i, 1);
                break;
              }
            }
          }
        }
      }
    }

    handleSetBlogPost();
  }

  const handleCommentInputTextChange = id => event => {
    document.getElementById(id).innerHTML = event.target.value.length + "/" + comment_max_length;
  }

  const handleEditCommentSubmit = id => event => {
    var comment = findComment(blog_post.comments, id);
    var comment_text = document.getElementById("edit_comment_input_" + id).value.trim().replace(/(<([^>]+)>)/gi, "");

    if (comment_text.length > 0) {
      comment.text = comment_text;
      document.getElementById("edit_comment_card_" + id).style.display = "none";
      document.getElementById("comment_" + id).style.display = "inline-block";
      handleSetBlogPost();
    }
  }

  const handleCancelEditClick = id => event => {
    document.getElementById("edit_comment_card_" + id).style.display = "none";
    document.getElementById("comment_" + id).style.display = "inline-block";
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

                        {/* Card for displaying comment */}
                        <Card id={"comment_" + tier_0_comment.comment_id} className={classes.tier_0}>
                          <CardHeader
                            avatar={
                              <Link to={"/user/" + tier_0_comment.author.username} className={classes.username}>
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
                                <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentClick(tier_0_comment.comment_id)}>EDIT</Button>
                                <Button variant="contained" onClick={handleDeleteComment(tier_0_comment.comment_id)}>DELETE</Button>
                              </span>
                            )}
                          </CardActions>
                        </Card>

                        {/** Card for editing comment */}
                        <Card id={"edit_comment_card_" + tier_0_comment.comment_id} className={`${classes.tier_0} ${classes.hidden}`}>
                          <CardHeader
                            title={<Typography variant="h6">Edit Your Comment</Typography>}
                          />
                          <CardContent>
                            <FormControl variant="standard" fullWidth>
                              <OutlinedInput
                                id={"edit_comment_input_" + tier_0_comment.comment_id}
                                onChange={handleCommentInputTextChange("edit_comment_length_counter_" + tier_0_comment.comment_id)}
                                aria-describedby={"edit_comment_length_counter_" + tier_0_comment.comment_id}
                                multiline
                                inputProps={{"maxLength":comment_max_length}}
                                variant="outlined"
                                maxRows={4}
                              />
                              <FormHelperText id={"edit_comment_length_counter_" + tier_0_comment.comment_id}>
                                0/1000
                              </FormHelperText>
                            </FormControl>
                          </CardContent>
                          <CardActions>
                            <div className={classes.write_comment_buttons_container}>
                              <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentSubmit(tier_0_comment.comment_id)}>EDIT</Button>
                              <Button variant="contained" onClick={handleCancelEditClick(tier_0_comment.comment_id)}>CANCEL</Button>
                            </div>
                          </CardActions>
                        </Card>

                        {/** Card for writing a reply */}
                        <Card id={"write_reply_card_" + tier_0_comment.comment_id} className={`${classes.tier_1} ${classes.hidden}`}>
                          <CardHeader
                            title={<Typography variant="h6">
                              Replying to <Link to={"/user/" + tier_0_comment.author.username}>@{tier_0_comment.author.username}</Link>
                            </Typography>}
                          />
                          <CardContent>
                            <FormControl variant="standard" fullWidth>
                              <OutlinedInput
                                id={"reply_input_" + tier_0_comment.comment_id}
                                onChange={handleCommentInputTextChange("reply_length_counter_" + tier_0_comment.comment_id)}
                                aria-describedby={"reply_length_counter_" + tier_0_comment.comment_id}
                                multiline
                                inputProps={{"maxLength":comment_max_length}}
                                variant="outlined"
                                maxRows={4}
                              />
                              <FormHelperText id={"reply_length_counter_" + tier_0_comment.comment_id}>
                                0/1000
                              </FormHelperText>
                            </FormControl>
                          </CardContent>
                          <CardActions>
                            <div className={classes.write_comment_buttons_container}>
                              <Button id={"submit_reply_button_" + tier_0_comment.comment_id} variant="contained" className={classes.bottom_button} onClick={handleSubmitReplyClick(tier_0_comment.comment_id)}>SEND</Button>
                              <Button variant="contained" onClick={handleCancelReplyClick(tier_0_comment.comment_id)}>CANCEL</Button>
                            </div>
                          </CardActions>
                        </Card>




                        {tier_0_comment.replies.map((tier_1_comment) => {
                          return <div key={"key_" + tier_1_comment.comment_id}>
                            {/** Card for displaying a comment */}
                            <Card id={"comment_" + tier_1_comment.comment_id} className={classes.tier_1}>
                              <CardHeader
                                avatar={
                                  <Link to={"/user/" + tier_1_comment.author.username} className={classes.username}>
                                    <Avatar alt={tier_1_comment.author.username} src={"/assets/images/avatars/" + tier_1_comment.avatar}/></Link>
                                }
                                title={<Link to={"/user/" + tier_1_comment.author.username}>{tier_1_comment.author.username}</Link>}
                                subheader={calculateCommentTimestamp(tier_1_comment.posting_time)}
                              />
                    
                              <CardContent>
                                <Typography variant="h6">
                                  <Link to={"/user/" + tier_1_comment.replying_to.username}>@{tier_1_comment.replying_to.username}</Link>
                                  {'\u00A0' + tier_1_comment.text}
                                </Typography>
                              </CardContent>
                    
                              <CardActions>
                                <IconButton aria-label="Like" id={"like_button_" + tier_1_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_1_comment.comment_id, 1)}>
                                  <ThumbUp/>
                                </IconButton>
                                <Typography variant="h6">
                                  {tier_1_comment.likes}
                                </Typography>
                                <IconButton aria-label="Dislike" id={"dislike_button_" + tier_1_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_1_comment.comment_id, -1)}>
                                  <ThumbDown/>
                                </IconButton>
                                  <Button variant="contained" onClick={handleReplyButtonClick(tier_1_comment.comment_id)}>REPLY</Button>
                                  { current_user_username == tier_1_comment.author.username && (
                                    <span>
                                      <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentClick(tier_1_comment.comment_id)}>EDIT</Button>
                                      <Button variant="contained" onClick={handleDeleteComment(tier_1_comment.comment_id)}>DELETE</Button>
                                    </span>
                                  )}
                              </CardActions>
                            </Card>

                            {/** Card for editing comment */}
                            <Card id={"edit_comment_card_" + tier_1_comment.comment_id} className={`${classes.tier_1} ${classes.hidden}`}>
                              <CardHeader
                                title={<Typography variant="h6">Edit Your Comment</Typography>}
                              />
                              <CardContent>
                                <FormControl variant="standard" fullWidth>
                                  <OutlinedInput
                                    id={"edit_comment_box_" + tier_1_comment.comment_id}
                                    onChange={handleCommentInputTextChange("edit_comment_length_counter_" + tier_1_comment.comment_id)}
                                    aria-describedby={"edit_comment_length_counter_" + tier_1_comment.comment_id}
                                    multiline
                                    inputProps={{"maxLength":comment_max_length}}
                                    variant="outlined"
                                    maxRows={4}
                                  />
                                  <FormHelperText id={"edit_comment_length_counter_" + tier_1_comment.comment_id}>
                                    0/1000
                                  </FormHelperText>
                                </FormControl>
                              </CardContent>
                              <CardActions>
                                <div className={classes.write_comment_buttons_container}>
                                  <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentSubmit(tier_1_comment.comment_id)}>EDIT</Button>
                                  <Button variant="contained" onClick={handleCancelEditClick(tier_1_comment.comment_id)}>CANCEL</Button>
                                </div>
                              </CardActions>
                            </Card>
                    
                            {/** Card for writing a reply */}
                            <Card id={"write_reply_card_" + tier_1_comment.comment_id} className={`${classes.tier_2} ${classes.hidden}`}>
                              <CardHeader
                                title={<Typography variant="h6">
                                  Replying to <Link to={"/user/" + tier_1_comment.author.username}>@{tier_1_comment.author.username}</Link>
                                  </Typography>}
                              />
                              <CardContent>
                                <FormControl variant="standard" fullWidth>
                                    <OutlinedInput
                                          id={"reply_input_" + tier_1_comment.comment_id}
                                          onChange={handleCommentInputTextChange("reply_length_counter_" + tier_1_comment.comment_id)}
                                          aria-describedby={"reply_length_counter_" + tier_1_comment.comment_id}
                                          multiline
                                          inputProps={{"maxLength":comment_max_length}}
                                          variant="outlined"
                                          maxRows={4}
                                    />
                                    <FormHelperText id={"reply_length_counter_" + tier_1_comment.comment_id}>
                                      0/1000
                                    </FormHelperText>
                                </FormControl>
                              </CardContent>
                              <CardActions>
                              <div className={classes.write_comment_buttons_container}>
                                <Button className={classes.bottom_button} variant="contained" onClick={handleSubmitReplyClick(tier_1_comment.comment_id)}>SEND</Button>
                                <Button variant="contained" onClick={handleCancelReplyClick(tier_1_comment.comment_id)}>CANCEL</Button>
                              </div>
                              </CardActions>
                            </Card>






                            {tier_1_comment.replies.map((tier_2_comment) => {
                              return <div key={"key_" + tier_2_comment.comment_id}>
                                {/** Card for displaying a comment */}
                                <Card id={"comment_" + tier_2_comment.comment_id} className={classes.tier_2}>
                                  <CardHeader
                                    avatar={
                                      <Link to={"/user/" + tier_2_comment.author.username} className={classes.username}>
                                        <Avatar alt={tier_2_comment.author.username} src={"/assets/images/avatars/" + tier_2_comment.avatar}/></Link>
                                    }
                                    title={<Link to={"/user/" + tier_2_comment.author.username}>{tier_2_comment.author.username}</Link>}
                                    subheader={calculateCommentTimestamp(tier_2_comment.posting_time)}
                                  />
                        
                                  <CardContent>
                                    <Typography variant="h6">
                                      <Link to={"/user/" + tier_2_comment.replying_to.username}>@{tier_2_comment.replying_to.username}</Link>
                                      {'\u00A0' + tier_2_comment.text}
                                    </Typography>
                                  </CardContent>
                        
                                  <CardActions>
                                    <IconButton aria-label="Like" id={"like_button_" + tier_2_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_2_comment.comment_id, 1)}>
                                      <ThumbUp/>
                                    </IconButton>
                                    <Typography variant="h6">
                                      {tier_2_comment.likes}
                                    </Typography>
                                    <IconButton aria-label="Dislike" id={"dislike_button_" + tier_2_comment.comment_id} className={classes.like_button} onClick={handleLikeClick(tier_2_comment.comment_id, -1)}>
                                      <ThumbDown/>
                                    </IconButton>
                                    <Button variant="contained" onClick={handleReplyButtonClick(tier_2_comment.comment_id)}>REPLY</Button>
                                    { current_user_username == tier_2_comment.author.username && (
                                      <span>
                                        <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentClick(tier_2_comment.comment_id)}>EDIT</Button>
                                        <Button variant="contained" onClick={handleDeleteComment(tier_2_comment.comment_id)}>DELETE</Button>
                                      </span>
                                    )}
                                  </CardActions>
                                </Card>

                                {/** Card for editing comment */}
                                <Card id={"edit_comment_card_" + tier_2_comment.comment_id} className={`${classes.tier_2} ${classes.hidden}`}>
                                  <CardHeader
                                    title={<Typography variant="h6">Edit Your Comment</Typography>}
                                  />
                                  <CardContent>
                                    <FormControl variant="standard" fullWidth>
                                      <OutlinedInput
                                        id={"edit_comment_box_" + tier_2_comment.comment_id}
                                        onChange={handleCommentInputTextChange("edit_comment_length_counter_" + tier_2_comment.comment_id)}
                                        aria-describedby={"edit_comment_length_counter_" + tier_2_comment.comment_id}
                                        multiline
                                        inputProps={{"maxLength":comment_max_length}}
                                        variant="outlined"
                                        maxRows={4}
                                      />
                                      <FormHelperText id={"edit_comment_length_counter_" + tier_2_comment.comment_id}>
                                        0/1000
                                      </FormHelperText>
                                    </FormControl>
                                  </CardContent>
                                  <CardActions>
                                    <div className={classes.write_comment_buttons_container}>
                                      <Button variant="contained" className={classes.bottom_button} onClick={handleEditCommentSubmit(tier_2_comment.comment_id)}>EDIT</Button>
                                      <Button variant="contained" onClick={handleCancelEditClick(tier_2_comment.comment_id)}>CANCEL</Button>
                                    </div>
                                  </CardActions>
                                </Card>
                        
                                {/** Card for writing a reply */}
                                <Card id={"write_reply_card_" + tier_2_comment.comment_id} className={`${classes.tier_2} ${classes.hidden}`}>
                                  <CardHeader
                                    title={<Typography variant="h6">
                                      Replying to <Link to={"/user/" + tier_2_comment.author.username}>@{tier_2_comment.author.username}</Link>
                                      </Typography>}
                                  />
                                  <CardContent>
                                    <FormControl variant="standard" fullWidth>
                                        <OutlinedInput
                                              id={"reply_input_" + tier_2_comment.comment_id}
                                              onChange={handleCommentInputTextChange("reply_length_counter_" + tier_2_comment.comment_id)}
                                              aria-describedby={"reply_length_counter_" + tier_2_comment.comment_id}
                                              multiline
                                              inputProps={{"maxLength":comment_max_length}}
                                              variant="outlined"
                                              maxRows={4}
                                        />
                                        <FormHelperText id={"reply_length_counter_" + tier_2_comment.comment_id}>
                                          0/1000
                                        </FormHelperText>
                                    </FormControl>
                                  </CardContent>
                                  <CardActions>
                                  <div className={classes.write_comment_buttons_container}>
                                    <Button className={classes.bottom_button} variant="contained" onClick={handleSubmitReplyClick(tier_2_comment.comment_id)}>SEND</Button>
                                    <Button variant="contained" onClick={handleCancelReplyClick(tier_2_comment.comment_id)}>CANCEL</Button>
                                  </div>
                                  </CardActions>
                                </Card>
                              </div>
                            })}


                          </div>
                        })}
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

        <Dialog
            open={dialog_open}
            onClose={handleDialogClose}
            aria-labelledby="alert_dialog_title"
            aria-describedby="alert_dialog_description"
          >
            <DialogTitle id="alert_dialog_title">{dialog_title}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert_dialog_description">
                {dialog_description}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={signInRedirect}>
                Sign In
              </Button>
              <Button onClick={handleDialogClose}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>

      </Card>
    )
}
