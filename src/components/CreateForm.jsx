import React, { Component } from 'react'

export default class CreateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '',
      body: ''  
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({[event.target.name] : event.target.value})
  }

  handleSubmit() {

  }

  render() {
    return (
      <div>
        <form>
          <label htmlFor='title'>Title:</label>
          <input name='title' type='text' onChange={this.handleChange} value={this.state.title} />
          <label htmlFor='body'>Body:</label>
          <input name='body' type='text' onChange={this.handleChange} value={this.state.body} />
          <input type='submit' value='Add Post' />
        </form>
      </div>
    )
  }
}
