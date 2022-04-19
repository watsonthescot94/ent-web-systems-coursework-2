import { makeStyles } from '@material-ui/core/styles'
import Header from '../core/Header'
import {listAll} from './api-blog'
import React, { useEffect, useState } from 'react';
import Card from '@material-ui/core/Card'
import List from '@material-ui/core/List'
import ListSubheader from '@material-ui/core/ListSubheader'
import Link from '@material-ui/core/Link'
import ListItem from '@material-ui/core/ListItem'

const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        margin: "auto",
        backgroundColor: "lightgray"
    },
    all_posts_container: {
        width: "60%",
        margin: "auto",
        padding: "10px"
    },
    list_container: {
        backgroundColor: "white"
    },
    post_title: {
        textDecoration: "none",
        color: "gray"
      }
}))

export default function Blogs(){
    var classes = useStyles();
    const [all_posts, setAllPosts] = useState([]);

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal
    
        listAll(signal).then((data) => {
          if (data && data.error) {
            console.log(data.error);
          }
          else {
            setAllPosts(data);
          }
        })
    
        return function cleanup(){
          abortController.abort()
        }
      })

    return (
        <Card className={classes.page_container}>
            <Header />

            <div className={classes.all_posts_container}>
            <Card className={classes.list_container}>
              <List
                component="nav"
                aria-label="recent posts"
                subheader={
                  <ListSubheader component="div">
                    All Posts
                  </ListSubheader>
                }
              >
                {all_posts.map((post => {
                  return <Link to={"/blogs/" + recent_post._id} className={classes.post_title}>
                          <ListItem button>
                            <ListItemText primary={post.content.title} />
                          </ListItem>
                        </Link>
                }))}

              </List>
            </Card>
          </div>
        </Card>
    )
}