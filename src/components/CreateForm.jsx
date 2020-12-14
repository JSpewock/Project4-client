import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'


export default class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: '',
      redirect: false,
      done: false
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
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
    
  }

  handleChange(event) {
    this.setState({[event.target.name] : event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch(baseURL + '/rantz/', {
      method: "POST",
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
    }).then(response => {
      this.setState({done: true})
    })
  }

  render() {
    return (
      <div>
        {this.state.redirect ? (
          <Redirect to='/u/login' />
        ) : this.state.done ? (
          <Redirect to='/' />
        ) : (
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='title'>Title:</label>
            <input name='title' type='text' onChange={this.handleChange} value={this.state.title} />
            <label htmlFor='body'>Body:</label>
            <input name='body' type='text' onChange={this.handleChange} value={this.state.body} />
            <input type='submit' value='Add Post' />
          </form>
        )}
      </div>
    )
  }
}
