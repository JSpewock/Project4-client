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
      user: {},
      topic: ''
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    // this.showOneRant(this.props.postId)

    //There is a lot to this so I tried to break it into blocks. The first does a call that grabs the data for the post you want to update, 
    //the next checks if you're logged in, and the last checks if you are the person who made this post

    // ------------------------------------------
    //               Post to Update
    // ------------------------------------------
    fetch(baseURL + '/rantz/' + this.props.postId, {
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
        body: data.data.post.body,
        topic: data.data.post.topic  
      })
    }).then(res => {
      //-----------------------------
      //         Login Check
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
    }).then(res => {
      // ---------------------------------
      //       Owner verification
      // ---------------------------------
      if (this.state.user.id) {
        //If you are not the one who created the post
        if (this.state.user.username !== this.state.post.created_by.username) {
          this.setState({redirectLogin: true})
        }
      }
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
        body: this.state.body,
        topic: this.state.topic
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
          <Redirect to='/'/>
        ) : this.state.redirectLogin ? (
          <Redirect to='/u/login' />
        ) : (
          <div className="form-div">
            <h1>Not too happy with what you said? That's alright, you can change it at any time.</h1>
          <form onSubmit={this.handleSubmit} className="form" id="update-form">
            <label htmlFor='title'>Title:</label>
            <input name='title' type='text' onChange={this.handleChange} value={this.state.title} />
            <label htmlFor='body'>Body:</label>
            <textarea name='body' type='text' onChange={this.handleChange} value={this.state.body}></textarea>
            <label>Who/What is your rant targetted toward?</label>
              <label htmlFor="games" className="radio-button">Games</label>
              <input type="radio" name="topic" value="games" onChange={this.handleChange} checked={this.state.topic === 'games' ? true : false}/><br></br>
              <label htmlFor="food" className="radio-button">Food</label>
              <input type="radio" name="topic" value="food" onChange={this.handleChange} checked={this.state.topic === 'food' ? true : false}/><br></br>
              <label htmlFor="people" className="radio-button">People</label>
              <input type="radio" name="topic" value="people" onChange={this.handleChange} checked={this.state.topic === 'people' ? true : false}/><br></br>
              <label htmlFor="company" className="radio-button">Company</label>
              <input type="radio" name="topic" value="company" onChange={this.handleChange} checked={this.state.topic === 'company' ? true : false}/><br></br>
              <label htmlFor="place" className="radio-button">Place</label>
              <input type="radio" name="topic" value="place" onChange={this.handleChange} checked={this.state.topic === 'place' ? true : false}/><br></br>
              <label htmlFor="other" className="radio-button">Other</label>
              <input type="radio" name="topic" value="other" onChange={this.handleChange} checked={this.state.topic === 'other' ? true : false}/><br></br>
            <input type='submit' value='Edit' className="submit-button" />
          </form>
          </div>
        )}
      </div>
    )
  }
}
