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
    welcome_message: {
        width: "50%",
        margin: "10px auto 10px"
    }
}))

export default function Home() {
    var classes = useStyles();
    return (<Card className={classes.page_container}>
        <Header/>
        <Card className={classes.welcome_message}>
            <Typography variant="h6">Welcome to Love for the Uglies!</Typography>
        </Card>
        </Card>
    )
}