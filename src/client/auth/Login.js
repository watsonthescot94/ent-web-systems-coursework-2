import React, { useState } from 'react'
import { makeStyles } from "@material-ui/core"
import TextField from "@material-ui/core/TextField"
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import { Redirect } from 'react-router-dom'
import { login } from './api-auth'
import auth from './auth-helper'

const useStyles = makeStyles(theme => ({
    page_container: {
        width: "80%",
        margin: "auto",
        backgroundColor: "lightgray",
        minHeight: "100vh"
    },
    login_form: {
        width: "70%",
        margin: "10px auto 10px",
        padding: "10px",
        backgroundColor: "white"
    },
    form_container: {
        margin: "auto",
        width: "80%"
    },
    login_title: {
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

export default function Login() {
    var classes = useStyles();

    const [user_input, setInput] = useState({
        username: "",
        password: "",
        error: "",
        redirectToReferrer: false
    })

    const handleInputTextChange = property => event => {
        setInput({ ...user_input, [property]: event.target.value });
    }

    const handleLoginButtonSubmit = () => {
        const login_attempt = {
            username: user_input.username || undefined,
            password: user_input.password || undefined
        }

        login(login_attempt).then((data) => {
            if (data.error) {
                setInput({ ...user_input, error: data.error });
            }
            else {
                auth.authenticate(data, () => {
                    setInput({ ...user_input, error: "", redirectToReferrer: true });
                })
            }
        })
    }

    const homepageRedirect = () => {
        window.location.href="/";
    }

    const {from} = props.location.state || {
        from: {
          pathname: '/'
        }
    }
    
    if (user_input.redirectToReferrer) {
        return (<Redirect to={from}/>)
    }

    return (
        <Card className={classes.page_container}>
            <div className={classes.page_content_container}>

                <Card className={classes.login_form}>
                    <CardContent>
                        <div className={classes.form_container}>
                            <Typography variant="h6" className={classes.login_title}>Login</Typography>
                            <TextField
                                id="username_input"
                                label="Username"
                                variant="outlined"
                                className={classes.form_input}
                                value={user_input.username}
                                onChange={handleInputTextChange("username")}
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
                                <Button variant="contained" onClick={handleLoginButtonSubmit}>LOGIN</Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Card>
    )
}