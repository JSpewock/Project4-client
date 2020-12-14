import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class UpdateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      post: {},
      title: '',
      body: '',
      done: false,
      redirectLogin: false,
      user: {}
    }
    this.showOneRant = this.showOneRant.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    this.showOneRant(this.props.postId)
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
          //if the token in invalid remove it and redirect
          localStorage.removeItem('token')
          this.setState({redirectLogin: true})
        } else {
          this.setState({
            redirectLogin: false,
            user: check.data 
          })
        }
        return check.data
      }).then(res => {
        if (!this.state.redirectLogin) {
          this.setState({user: res})
        }
      })
    } else {
      //if there is no token, redirect
      this.setState({redirectLogin: true})
    }

    if (this.state.user.id) {
      //If you are not the one who created the post
      if (this.state.user.username !== this.state.post.created_by.username) {
        this.setState({redirectLogin: true})
      }
    }

  }

  //Same method from the show route to grab the existing data
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
      this.setState({
        post: data.data,
        title: data.data.post.title,
        body: data.data.post.body  
      })
    })
  }

  handleChange(event) {
    this.setState({[event.target.name] : event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch(baseURL + `/rantz/${this.props.postId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: this.state.title,
        body: this.state.body
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      if(data.status.code === 200) {
        this.setState({done: true})
      }
    })
  }

  render() {
    return (
      <div>
        {this.state.done ? (
          <Redirect to='/u/myposts'/>
        ) : this.state.redirectLogin ? (
          <Redirect to='/u/login' />
        ) : (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='title'>Title:</label>
            <input name='title' type='text' onChange={this.handleChange} value={this.state.title} />
            <label htmlFor='body'>Body:</label>
            <input name='body' type='text' onChange={this.handleChange} value={this.state.body} />
            <input type='submit' value='Edit' />
          </form>
        )}
      </div>
    )
  }
}
