import React from 'react';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import MuiAlert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import { connect } from "react-redux";

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  }
});

class SignIn extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      email: null,
      password: null,
      isAuthenticated: null,
      invalidCreds: false
    }
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch("http://localhost:8000/api/auth", {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "email": this.state.email,
        "password": this.state.password
      })
    }).then(res => {
      if (res.status === 200) {
        this.setState({ invalidCreds: false })
        this.props.setAuthenticated(true)
        this.props.history.push("/map")
      } else if (res.status === 401) {
        this.setState({ invalidCreds: true })
      }
    })
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value })
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value })
  }

  handleSignUp(event) {
    this.props.history.push("/signup")
  }


  handleAlertClose() {
    this.setState({ invalidCreds: false })
  }

  render() {
    const { classes } = this.props
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form
            className={classes.form}
            noValidate
            onSubmit={this.handleSubmit.bind(this)}
          >
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              onChange={this.handleEmailChange.bind(this)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={this.handlePasswordChange.bind(this)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Sign In
            </Button>
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              onClick={this.handleSignUp.bind(this)}
            >
              Don't have an account? Sign Up
            </Button>
            <Snackbar open={this.state.invalidCreds} autoHideDuration={3000}
              onClose={this.handleAlertClose.bind(this)}>
              <MuiAlert elevation={6} variant="filled" severity="error">
                Invalid login or password
              </MuiAlert>
            </Snackbar>
          </form>
        </div>
      </Container>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated
  }
}
const actions = require("./ActionsCreators");

SignIn = withStyles(styles, { withTheme: true })(SignIn)
export default connect(mapStateToProps, actions)(SignIn)
