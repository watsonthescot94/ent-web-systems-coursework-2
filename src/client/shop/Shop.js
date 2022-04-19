import Card from '@material-ui/core/Card'
import CardMedia from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardActions from '@material-ui/core/Card'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
    shop_items_container: {
        width: "60%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        flexWrap: "wrap",
        margin: "auto",
        padding: "10px",
        backgroundColor: "blue"
    },
    shop_item_card: {
        width: "45%",
        margin: "10px",
        padding: "10px"
    },
    add_to_cart_container: {
        display: "flex",
        justifyContent: "right"
    }
}))

export default function Shop(){
    const classes = useStyles();
    var shop = [
        {
            "_id": "395739579375",
            "name": "Item 1",
            "description": "Item 1 description item 1 description item 1 description",
            "stock": 14,
            "image": "default_shopping_item.jpg",
            "price": "£14.99"
        },
        {
            "_id": "395739514940",
            "name": "Item 2",
            "description": "Item 2 description item 2 description item 2 description item 2 description item 2 description item 2 description",
            "stock": 1,
            "image": "default_shopping_image.jpg",
            "price": "£14.99"
        },
        {
            "_id": "395571540015",
            "name": "Item 3",
            "description": "Item 3 description item 3 description item 3 description",
            "stock": 0,
            "image": "default_shopping_item.jpg",
            "price": "£14.99"
        }
    ]
    return (
        <div className={classes.shop_items_container}>
            {shop.map((item, i) => {
                return <Card className={classes.shop_item_card} key={"item_key_" + i}>
                        <CardMedia
                        component="img"
                        image={"/assets/images/shop/" + item.image}
                        alt={item.image}
                        />
                        <CardContent>
                        <Typography variant="h5">{item.name}</Typography>
                        <Typography variant="body1">{item.description}</Typography>
                        <br/>
                        {item.stock <= 5 && (
                            <Typography variant="body1">Only {item.stock} Left in Stock!</Typography>
                        )}
                        {item.stock > 5 && (
                            <Typography variant="body1">In Stock</Typography>
                        )}
                        {item.stock == 0 && (
                            <Typography variant="body1">Out of Stock</Typography>
                        )}
                        </CardContent>
                        <CardActions>
                            <div className={classes.add_to_cart_container}>
                                {item.stock > 0 && (
                                    <Button variant="contained">Add to Cart</Button>
                                )}
                                {item.stock == 0 && (
                                    <Button variant="contained" disabled={true}>Add to Cart</Button>
                                )}
                            </div>
                        </CardActions>
                    </Card>
                })}
        </div>
    )
}