import React, { Component } from 'react'
import {Redirect, Link} from 'react-router-dom'



const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class UserPosts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      redirectLogin: false,
      userPosts: [],
      postToUpdate: {}
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
          this.setState({redirectLogin: true})
        } else {
          this.setState({redirectLogin: false})
        }
      }).then(res => {
        //if the token is valid, get all the posts
        if (!this.state.redirectLogin) {
          this.getUserPosts()
        }
      })
    } else {
      //if there is no token, redirect
      this.setState({redirectLogin: true})
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
        return ''
      })
      this.setState({userPosts: userRants})
    })
  }

  handleDelete(id) {
    fetch(baseURL + '/rantz/' + id, {
      method: "DELETE",
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      if (data.status.code === 401) {
        //if the token in invalid remove it and redirect
        localStorage.removeItem('token')
        this.setState({redirectLogin: true})
      } else {
        const fakeArray = [...this.state.userPosts]
        const findIndex = fakeArray.findIndex(post => post.id === id)
        fakeArray.splice(findIndex, 1)
        this.setState({
          redirectLogin: false,
          userPosts: fakeArray  
        })
      }
    })
  }
  

  render() {
    return (
      <div>
        {this.state.redirectLogin ? (
          <Redirect to='/u/login' />
        ) : this.state.redirectUpdate ? (
          <Redirect to={`/p/update/${this.state.postToUpdate}`} />
        ) : (
          <div>
            {this.state.userPosts.map(post => {
            
              return(
              <div key={post.id}>
                <h1>{post.title}</h1>
                <p>By: {post.created_by.username} at {post.created_at}</p>
                <p>{post.body}</p>

                <Link to={`/p/update/${post.id}`}>
                  <button>Update</button>
                </Link>

                <button onClick={() => {
                  this.handleDelete(post.id)
                  }}>Delete</button>
              </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
}
