import { makeStyles } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        margin: "auto",
        backgroundColor: "lightgray"
      },
      register_title: {
          margin: "auto"
      },
      register_form: {
        width: "70%",
        margin: "auto",
        padding: "10px",
        backgroundColor: "white"
      },
      submit_button_container: {
        display: "flex",
        justifyContent: "right"
      },
      submit_button: {
          margin: "auto"
      },
      form_input: {
          width: "80%",
          margin: "auto",
          marginBottom: "20px"
      },
      error_message: {
          color: "red",
          margin: "auto"
      }
}))

export default function Register() {
    var classes = useStyles();
    var error = "";

    return (
        <Card className={classes.page_container}>
            <div className={classes.page_content_container}>

                <Card className={classes.register_form}>
                    <CardContent>
                        <Typography variant="h6" className={classes.register_title}>Register New Account</Typography>
                        <TextField
                            id="username_input"
                            label="Username"
                            variant="outlined"
                            className={classes.form_input}
                        />
                        <TextField
                            id="email_input"
                            type="email"
                            label="Email Address"
                            variant="outlined"
                            className={classes.form_input}
                        />
                        <TextField
                            id="password_input"
                            type="password"
                            label="Password"
                            variant="outlined"
                            className={classes.form_input}
                        />
                        { error !== "" && (
                            <Typography variant="body2" className={classes.error_message}>{error}</Typography>
                        )}
                        <div className={classes.submit_button_container}>
                            <Button variant="contained" className={classes.submit_button}>REGISTER</Button>
                        </div>
                    </CardContent>
                </Card>

            </div>
        </Card>
    )
}