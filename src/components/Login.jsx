import React, { Component } from 'react'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.id] : event.target.value})
  }

  handleSubmit(event) {
    event.preventDefault()
    fetch(baseURL + '/users/login', {
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
      // console.log(data.data.token)
      localStorage.setItem('token', data.data.token)
      this.setState({
        username: '',
        password: ''
      })
    })
  }

  render() {
    return (
      <div>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='username'>Username:</label>
          <input type='text' name='username' id='username' value={this.state.username} onChange={this.handleChange} />
          <label htmlFor='password'>Password:</label>
          <input type='password' name='password' id='password' value={this.state.password} onChange={this.handleChange} />
          <input type='submit' value='Log-in' />
        </form>
      </div>
    )
  }
}
