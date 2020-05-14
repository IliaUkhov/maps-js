import React from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from "react-redux";

class PrivateRoute extends React.Component {

  render() {
    console.log(JSON.stringify(this.props))
    return (
      this.props.isAuthenticated ? (
        <Route {...this.props}/>
      ) : (
        <Redirect to={{ pathname: '/signin' }}/>
      ) 
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthenticated: state.isAuthenticated
  }
} 

export default connect(mapStateToProps, null)(PrivateRoute)
