import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      done: false
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name] : event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch(baseURL + '/users/create', {
      method: "POST",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password
      }),
      headers: {
        'Content-Type': "application/json"
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      //update the state in the index
      this.props.logIn()
      localStorage.setItem('token', data.data.token)
      this.setState({
        username: '',
        password: '',
        done: true
      })
    })
  }

  render() {
    return (
      <div>
        {this.state.done ? (
          <Redirect to={'/'} />
        ) : (
          <div>
          <h1>Sign-up</h1>
          <form onSubmit={this.handleSubmit}>
            <label htmlFor='username'>Username:</label>
            <input type='text' name='username' value={this.state.username} onChange={this.handleChange} />
            <label htmlFor='password'>Password:</label>
            <input type='password' name='password' value={this.state.password} onChange={this.handleChange} />
            <input type='submit' value='Sign-up' />
          </form>
          </div>
        )}
         
      </div>
    )
  }
}
