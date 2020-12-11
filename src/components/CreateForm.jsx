import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'
const token = localStorage.getItem('token')

export default class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: '',
      redirect: false  
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
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
          //redirect
          localStorage.removeItem('token')
          this.setState({redirect: true})
        } else {
          this.setState({redirect: false})
        }
      })
    } else {
      //redirect
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
        'x-access-token': token
      }
    }).then(res => {
      return res.json()
    }).then(response => {
      console.log(response)
    })
  }

  render() {
    return (
      <div>
        {this.state.redirect ? (
          <Redirect to='/u/login' />
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
