import React, { Component } from 'react'
import Login from './components/Login'
import SignUp from './components/Signup'
import Rant from './components/Rant'
import Index from './components/Index'
import CreateForm from './components/CreateForm'
import UserPosts from './components/UserPosts'
import UpdateForm from './components/UpdateForm'
import {BrowserRouter as Router, Route, Link, Redirect} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: [],
      showOne: {},
      loggedIn: false,
    }
    this.getAllRants = this.getAllRants.bind(this)
    this.killToken = this.killToken.bind(this)
    this.logIn = this.logIn.bind(this)
    this.handleNewRant = this.handleNewRant.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSort = this.handleSort.bind(this)
  }

  componentDidMount() {
    this.handleSort('recent')
    //login check
    const token = localStorage.getItem('token')
    if (token) {
      fetch(baseURL + '/', {
        method: "GET",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      }).then(res => {
        return res.json()
      }).then(check => {
        if (check.status.code === 401) {
          //if the token is invalid remove it
          //Michael told me how to do this
          localStorage.removeItem('token')
          this.setState({loggedIn: false})
        } else {
          this.setState({loggedIn: true})
        }
      })
    } else {
      //if there is no token, redirect
      this.setState({loggedIn: false})
    }
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
    this.setState({loggedIn: false})
  }

  logIn () {
    this.setState({loggedIn: true})
  }

  handleNewRant(newPost) {
    const fakeArray = [...this.state.allRants]
    fakeArray.unshift(newPost.data)
    this.setState({allRants: fakeArray})
  }

  handleDelete(id) {
    const fakeArray = [...this.state.allRants]
    const findIndex = fakeArray.findIndex(post => post.id === id)
    fakeArray.splice(findIndex, 1)
    this.setState({allRants: fakeArray})
  }

  handleSort(topic) {
    fetch(baseURL + '/rantz/sort/' + topic, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      const sortedRants = []
      data.data.map(rant => {
        rant.created_by.id = '?'
        rant.created_by.password = ''

        //This is a method I made myself that essentially take a sentence and takes only the first 50 characters
        //Most of the methods used I already knew, but if I didn't, I looked at w3schools.com
        let shorterBody = ''
        const splitWord = rant.body.split('')
        const shorterBodyArr = []
        for(let i = 0; i < 50; i++) {
          if (splitWord[i]) {
            shorterBodyArr.push(splitWord[i])
          }
          if (i === 49) {
            shorterBody = shorterBodyArr.join('')
          }
        }
        rant.shortBody = shorterBody

        sortedRants.push(rant)
        return ''
      })
      this.setState({allRants: sortedRants})
    })
  }
  
  render() {
    return (
      <div>
        <Router>
          <div className="header">
            <div className="header-title">
              <Link to="/">
                <h1>RANTZ</h1>
              </Link>
            </div>
            <div className="header-nav">
              {this.state.loggedIn ? (
                <div className="nav-links">
                  <Link to={'/p/create'}>
                    <p>Make a New Post</p>
                  </Link>
                  <Link to={'/u/myposts'}>
                    <p>My Posts</p>
                  </Link>
                  <Link to={'/redirect'}>
                    <p onClick={this.killToken}>Log Out</p>
                  </Link>
                </div>
              ) : (
                <div className="nav-links">
                  <Link to={'/u/login'}>
                    <p>Log In</p>
                  </Link>
                  <Link to={'/u/signup'}>
                    <p>Sign Up</p>
                  </Link>
                </div>
              )}
            </div>
          </div>
          {/* {this.state.loggedIn ? (
            <div>
              <Link to={'/p/create'}>
                <button>Make a New Post</button>
              </Link>
              <Link to={'/u/myposts'}>
                <button>My Posts</button>
              </Link>
              <Link to={'/redirect'}>
                <button onClick={this.killToken}>Log Out</button>
              </Link>
            </div>
          ) : (
            <div>
              <Link to={'/u/login'}>
                <button>Log In</button>
              </Link>
              <Link to={'/u/signup'}>
                <button>Sign Up</button>
              </Link>
            </div>
          )} */}
          {/* index route */}
          <Route path='/' exact render={({match}) => (
            <Index allRants={this.state.allRants} handleSort={this.handleSort}/>
          )} />
          {/* show route */}
          <Route path='/s/:rantId' render={({match}) => (
            <Rant rantId={match.params.rantId} handleDelete={this.handleDelete}/>
          )} />
          {/* login route */}
          <Route path='/u/login' render={({match}) => (
            <Login logIn={this.logIn} />
          )}/>
          {/* sign up route */}
          <Route path='/u/signup' render={({match}) => (
            <SignUp logIn={this.logIn} />
          )} />
          {/* create new post route  */}
          <Route path='/p/create' render={({match}) => (
            <CreateForm handleNewRant={this.handleNewRant} />
          )} />
          {/* show user posts route  */}
          <Route path='/u/myposts' render={({match}) => (
            <UserPosts handleDelete={this.handleDelete} />
          )} />
          {/* update route  */}
          <Route path='/p/update/:postId' render={({match}) => (
              <UpdateForm postId={match.params.postId}/>
            )} />
          <Route path='/redirect' render={({match}) => (
            <Redirect to={'/'} />
          )}/>
        </Router>
      </div>
    )
  }
}
