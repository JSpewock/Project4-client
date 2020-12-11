import React, { Component } from 'react'
import Login from './components/Login'
import SignUp from './components/Signup'
import Rant from './components/Rant'
import Index from './components/Index'
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: [],
      showOne: {}
    }
    this.getAllRants = this.getAllRants.bind(this)
    this.showOneRant = this.showOneRant.bind(this)
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
      })
      this.setState({allRants: rants})
    })
  }

  showOneRant(id) {
    fetch(baseURL + '/rantz/' + id, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      data.data.post.created_by.password = ''
      data.data.post.created_by.id = '?'
      this.setState({showOne: data})
    })
  }

  

  render() {
    return (
      <div>
        <Router>
          <SignUp />
          <Login />
          {/* <h1>hi</h1>
          <div className="all-rants">
          {this.state.allRants.map(rant => {
            return(
              <div key={rant.id} id={rant.id}>
                <Link to={`/s/${rant.id}`}>
                  <h1 onClick={() => {
                    this.showOneRant(rant.id)
                  }}>{rant.title}</h1>
                </Link>
                <p>{rant.body}</p>  
              </div>
            )
          })}
          </div> */}
          <Route path='/' exact render={({match}) => (
            <Index allRants={this.state.allRants}/>
          )} />
          <Route path='/s/:rantId' render={({match}) => (
            // this.showOneRant(match.params.rantId)
            <Rant rantId={match.params.rantId}/>
          )} />
        </Router>
      </div>
    )
  }
}
