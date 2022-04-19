import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { listAll } from './api-shop'
import { addToCart } from './api-shop'
import auth from '../auth/auth-helper'
import Header from '../core/Header'


const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        backgroundColor: "lightgray",
        margin: "auto"
    },
    shop_item_card: {
        width: "60%",
        margin: "10px auto 10px",
        padding: "10px",
        boxSizing: "border-box"
    },
    add_to_cart_button: {
        marginTop: "10px"
    }
}))

export default function Shop(){
    const classes = useStyles();
    const jwt = auth.isAuthenticated()

    var current_user = {
        logged_in: false
    }
    
    if (auth.isAuthenticated().user) {
    current_user.logged_in = true;
    current_user.id = auth.isAuthenticated().user._id;
    }

    const [shop, setShop] = useState([]);

    useEffect(() => {
        const abortController = new AbortController()
        const signal = abortController.signal

        listAll(signal).then((data) => {
            if (data && data.error) {
                console.log(data.error);
              }
              else {
                setShop(data);
              }
        })

        return function cleanup(){
            abortController.abort()
          }
    })

    const handleAddToCartClick = id => event => {
        var data = {
            current_user: current_user,
            item_id: id
        }

        addToCart(data, { t: jwt.token }).then((data) => {
            if (data && data.error) {
                console.log(data.error);
              } else {
                console.log("add to cart success");
              }
        })
    }
    
    return (
        <Card className={classes.page_container}>
            <Header/>
            {shop.map((item, i) => {
                return <div key={"item_key_" + i}>
                    <Card className={classes.shop_item_card}>
                        <CardMedia
                        component="img"
                        image={"/assets/images/shop/" + item.image}
                        alt={item.name}
                        />
                        <CardContent>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="body1">{item.price}</Typography>
                        <Typography variant="body1">{item.description}</Typography>
                        <br/>
                        {item.stock <= 5 && item.stock > 0 && (
                            <Typography variant="body1">Only {item.stock} Left in Stock!</Typography>
                        )}
                        {item.stock > 5 && (
                            <Typography variant="body1">In Stock</Typography>
                        )}
                        {item.stock == 0 && (
                            <Typography variant="body1">Out of Stock</Typography>
                        )}
                        {item.stock > 0 && (
                            <Button variant="contained" className={classes.add_to_cart_button} onClick={handleAddToCartClick(item._id)}>Add to Cart</Button>
                        )}
                        {item.stock == 0 && (
                            <Button variant="contained" className={classes.add_to_cart_button} disabled={true}>Add to Cart</Button>
                        )}
                        </CardContent>
                    </Card>
                </div>
            })}
        </Card>
    )
}