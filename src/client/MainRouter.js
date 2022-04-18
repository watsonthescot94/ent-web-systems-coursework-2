import React from 'react'
import {Route, Switch} from 'react-router-dom'
import Blogs from './blog/Blogs'
import Home from './core/Home'

const MainRouter = () => {
    return (<div>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route path="/blogs/:blog_id" component={Blogs}/>
      </Switch>
    </div>)
}

export default MainRouter
