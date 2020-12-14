import React, { Component } from 'react'
import {Link} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Rant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOne: {},
      user: {},
      owner: false
    }
    this.checkOwner = this.checkOwner.bind(this)
  }

  componentDidMount() {
    // this.showOneRant(this.props.rantId)

    //I tried to break this one up a little more. This is just two api calls, the first to get the data for the post, and the next to verify the user
    // ----------------------------------
    //             Post data
    // ----------------------------------
    fetch(baseURL + '/rantz/' + this.props.rantId, {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      data.data.post.created_by.password = ''
      data.data.post.created_by.id = '?'
      this.setState({showOne: data.data})
    }).then(res => {
      // ----------------------------
      //         Verify User
      // ----------------------------
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
          if (check.status.code !== 401) {
            this.setState({
              user: check.data 
            })
          }
        }).then(res => {
          //check to see if the user made this post
          this.checkOwner()
        })
      }
      })
  }

  checkOwner() {
    //if you made this post the website recognizes that
    if (this.state.user.username) {
      if (this.state.user.username === this.state.showOne.post.created_by.username) {
        this.setState({owner: true})
      }
    }
  }

  render() {
    return (
      <div>
        {this.state.showOne.post && (
          <div>
            <h1>{this.state.showOne.post.title}</h1>
            <p>By: {this.state.showOne.post.created_by.username} at {this.state.showOne.post.created_at}</p>
            <p>{this.state.showOne.post.body}</p>
            {this.state.owner && (
              <Link to={`/p/update/${this.state.showOne.post.id}`}>
                <button>Update</button>
              </Link>
            )}
          </div>
        )}
      </div>
    )
  }
}
