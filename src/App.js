import React, { Component } from 'react'
import Login from './components/Login'
import SignUp from './components/Signup'
import Rant from './components/Rant'
import Index from './components/Index'
import CreateForm from './components/CreateForm'
import UserPosts from './components/UserPosts'
import UpdateForm from './components/UpdateForm'
import {BrowserRouter as Router, Route} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: [],
      showOne: {}
    }
    this.getAllRants = this.getAllRants.bind(this)
    this.killToken = this.killToken.bind(this)
  }

  componentDidMount() {
    this.getAllRants()
  }

  getAllRants() {
    fetch(baseURL + '/rantz/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json()
    }).then(parsedData => {
      //hide the password and id of the user who made the rant
      const rants = []
      parsedData.data.map(rant => {
        rant.created_by.password = ''
        rant.created_by.id = '?'
        rants.push(rant)
        return ''
      })
      this.setState({allRants: rants})
    })
  }

  killToken() {
    localStorage.removeItem('token')
  }

  
  render() {
    return (
      <div>
        <button onClick={this.killToken}>Kill token</button>
        <Router>
          <Route path='/' exact render={({match}) => (
            <Index allRants={this.state.allRants}/>
          )} />
          <Route path='/s/:rantId' render={({match}) => (
            <Rant rantId={match.params.rantId}/>
          )} />
          <Route path='/u/login' component={Login} />
          <Route path='/u/signup' component={SignUp} />
          <Route path='/p/create' component={CreateForm} />
          <Route path='/u/myposts' component={UserPosts} />
          <Route path='/p/update/:postId' render={({match}) => (
              <UpdateForm postId={match.params.postId}/>
            )} />
        </Router>
      </div>
    )
  }
}
