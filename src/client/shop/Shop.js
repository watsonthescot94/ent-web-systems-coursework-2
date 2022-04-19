import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { listAll } from './api-shop'


const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        backgroundColor: "lightgray",
        margin: "auto"
    },
    shop_item_card: {
        width: "60%",
        margin: "10px",
        padding: "10px",
        boxSizing: "border-box"
    }
}))

export default function Shop(){
    const classes = useStyles();

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
    })
    
    return (
        <Card className={classes.page_container}>
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
                            <Button variant="contained">Add to Cart</Button>
                        )}
                        {item.stock == 0 && (
                            <Button variant="contained" disabled={true}>Add to Cart</Button>
                        )}
                        </CardContent>
                    </Card>
                </div>
            })}
        </Card>
    )
}