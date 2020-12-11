import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class UserPosts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirect: false,
      userPosts: []
    }
  }

  componentDidMount() {
    //jwt validity check
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
          //if the token in invalid remove it and redirect
          localStorage.removeItem('token')
          this.setState({redirect: true})
        } else {
          this.setState({redirect: false})
        }
      })
    } else {
      //if there is no token, redirect
      this.setState({redirect: true})
    }
    if (!this.state.redirect) {
      this.getUserPosts()
    }
  }

  getUserPosts() {
    fetch(baseURL + '/rantz/myposts', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      const userRants = []
      data.data.map(rant => {
        rant.created_by.password = ''
        rant.created_by.id = '?'
        userRants.push(rant)
      })
      this.setState({userPosts: userRants})
    })
  }

  render() {
    return (
      <div>
        {this.state.redirect ? (
          <Redirect to='/u/login' />
        ) : (
          <div>
            {this.state.userPosts.map(post => {
              // console.log(post)
              return(
              <div key={post.id}>
                <h1>{post.title}</h1>
                <p>By: {post.created_by.username} at {post.created_at}</p>
                <p>{post.body}</p>
                <button>Update</button>
                <button>Delete</button>
              </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
