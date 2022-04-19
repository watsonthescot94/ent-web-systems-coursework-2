import { makeStyles } from "@material-ui/core"
import Card from '@material-ui/core/Card'
import Typography from '@material-ui/core/Typography'
import Header from '../core/Header'

const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        margin: "auto",
        backgroundColor: "lightgray",
        minHeight: "100vh"
    },
    welcome_message_card: {
        width: "50%",
        margin: "10px auto 10px",
        padding: "10px"
    },
    welcome_message: {
        margin: "auto"
    }
}))

export default function Home() {
    var classes = useStyles();
    return (<Card className={classes.page_container}>
        <Header/>
        <Card className={classes.welcome_message_card}>
            <Typography className={classes.welcome_message} variant="h6">Welcome to Love for the Uglies!</Typography>
            <Typography className={classes.welcome_message} variant="body2">Lorem ipsum dolor sit amet, consectetur adipiscing
            elit. Proin ornare gravida leo sed scelerisque. Integer auctor efficitur tellus, id vulputate risus porttitor sit
            amet. Maecenas elementum hendrerit magna eu mattis. Mauris ut rutrum est. Duis nunc elit, pulvinar efficitur
            consectetur id, ultricies at dui. Proin lobortis ante nec ligula consequat mollis. Donec lobortis tellus sapien,
            vel gravida justo tincidunt id. In ullamcorper et nibh id mattis. Duis tincidunt libero et tincidunt tempus. Ut
            luctus tempor iaculis. Phasellus convallis est non velit commodo, non egestas nibh dapibus. Vivamus in purus quis
            quam gravida efficitur. Phasellus mollis quis felis non vehicula. Quisque egestas viverra magna id malesuada. Nam in
            rutrum turpis, ultrices sollicitudin justo. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere
            cubilia curae.</Typography>
        </Card>
        </Card>
    )
}