import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Blogs from './blog/Blogs'
import Home from './core/Home'
import Register from './user/Register'

const MainRouter = () => {
    return (<div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/blogs/:blog_id" component={Blogs}/>
        <Route path='/register' component={Register}/>
      </Switch>
    </div>)
}

export default MainRouter
