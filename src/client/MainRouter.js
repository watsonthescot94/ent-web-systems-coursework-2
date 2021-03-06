import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Blogs from './blog/Blogs'
import Home from './core/Home'
import Register from './user/Register'
import Login from './auth/Login'
import Shop from './shop/Shop'
import AllBlogs from './blog/AllBlogs'

const MainRouter = () => {
    return (<div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/blogs/:blog_id" component={Blogs}/>
        <Route path='/register' component={Register}/>
        <Route path='/login' component={Login}/>
        <Route path='/shop' component={Shop}/>
        <Route path='/allblogs' component={AllBlogs}/>
      </Switch>
    </div>)
}

export default MainRouter
