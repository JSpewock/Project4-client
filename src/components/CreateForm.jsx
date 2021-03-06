import React, { Component } from 'react'
import {Redirect} from 'react-router-dom'


const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'


export default class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: '',
      redirect: false,
      done: false,
      topic: ''
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
        body: this.state.body,
        topic: this.state.topic
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }
    }).then(res => {
      return res.json()
    }).then(response => {
      this.props.handleNewRant(response)
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
          <div className="form-div">
            <h1>Speak your mind! What's got you riled up lately?</h1>
            <form onSubmit={this.handleSubmit} className="form" id="create-form">
              <label htmlFor='title'>Title:</label>
              <input name='title' type='text' onChange={this.handleChange} value={this.state.title} className="title-input" />
              <label htmlFor='body'>Body:</label>
              <textarea name='body' onChange={this.handleChange} placeholder="You don't have to be too nice but try not to get unethical either..." >{this.state.body}</textarea>
              <label>Who/What is your rant targetted toward?</label>
              <label htmlFor="games" className="radio-button">Games</label>
              <input type="radio" name="topic" value="games" onChange={this.handleChange}/><br></br>
              <label htmlFor="food" className="radio-button">Food</label>
              <input type="radio" name="topic" value="food" onChange={this.handleChange}/><br></br>
              <label htmlFor="people" className="radio-button">People</label>
              <input type="radio" name="topic" value="people" onChange={this.handleChange}/><br></br>
              <label htmlFor="company" className="radio-button">Company</label>
              <input type="radio" name="topic" value="company" onChange={this.handleChange}/><br></br>
              <label htmlFor="place" className="radio-button">Place</label>
              <input type="radio" name="topic" value="place" onChange={this.handleChange}/><br></br>
              <label htmlFor="other" className="radio-button">Other</label>
              <input type="radio" name="topic" value="other" onChange={this.handleChange}/><br></br>
              <input type='submit' value='Add Post' className="submit-button"/>
            </form>
          </div>
        )}
      </div>
    )
  }
}
