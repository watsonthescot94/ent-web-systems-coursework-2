import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogActions from '@material-ui/core/DialogActions'
import { create } from './api-user'

const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        margin: "auto",
        backgroundColor: "lightgray",
        minHeight: "100vh"
    },
    register_form: {
        width: "70%",
        margin: "10px auto 10px",
        padding: "10px",
        backgroundColor: "white"
    },
    form_container: {
        margin: "auto",
        width: "80%"
    },
    register_title: {
        margin: "0px auto 10px auto"
    },
    form_input: {
        width: "100%",
        marginBottom: "20px"
    },
    submit_button_container: {
        display: "flex",
        justifyContent: "right",
        width: "100%"
    },
    error_message: {
          color: "red",
          margin: "auto"
    }
}))

export default function Register() {
    var classes = useStyles();

    const [user_input, setInput] = useState({
        username: "",
        email: "",
        password: "",
        error: ""
    })

    const [dialog_open, setDialogOpen] = useState(false);

    const handleInputTextChange = property => event => {
        setInput({ ...user_input, [property]: event.target.value });
    }

    const handleRegisterButtonSubmit = () => {
        const new_user = {
            username: user_input.username || undefined,
            email: user_input.email || undefined,
            password: user_input.password || undefined
        }

        create(new_user).then((data) => {
            if (data.error) {
                setInput({ ...user_input, error: data.error });
            }
            else {
                setDialogOpen(true);
            }
        })
    }

    const logInRedirect = () => {
        window.location.href="/login";
    }

    return (
        <Card className={classes.page_container}>
            <div className={classes.page_content_container}>

                <Card className={classes.register_form}>
                    <CardContent>
                        <div className={classes.form_container}>
                            <Typography variant="h6" className={classes.register_title}>Register New Account</Typography>
                            <TextField
                                id="username_input"
                                label="Username"
                                variant="outlined"
                                className={classes.form_input}
                                value={user_input.username}
                                onChange={handleInputTextChange("username")}
                            />
                            <TextField
                                id="email_input"
                                type="email"
                                label="Email Address"
                                variant="outlined"
                                className={classes.form_input}
                                value={user_input.email}
                                onChange={handleInputTextChange("email")}
                            />
                            <TextField
                                id="password_input"
                                type="password"
                                label="Password"
                                variant="outlined"
                                className={classes.form_input}
                                value={user_input.password}
                                onChange={handleInputTextChange("password")}
                            />
                            { user_input.error && (
                                <Typography variant="body2" className={classes.error_message}>{user_input.error}</Typography>
                            )}
                            <div className={classes.submit_button_container}>
                                <Button variant="contained" onClick={handleRegisterButtonSubmit}>REGISTER</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Dialog
                    open={dialog_open}
                    disableBackdropClick={true}
                    aria-labelledby="alert_dialog_title"
                    aria-describedby="alert_dialog_description"
                >
                    <DialogTitle id="alert_dialog_title">Account Created</DialogTitle>
                    <DialogContent>
                    <DialogContentText id="alert_dialog_description">
                        Your new account has successfully been registered
                    </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={logInRedirect}>
                            Sign In
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </Card>
    )
}