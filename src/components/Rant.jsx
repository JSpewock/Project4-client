import React, { Component } from 'react'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Rant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOne: {}
    }
    this.showOneRant = this.showOneRant.bind(this)
  }

  componentDidMount() {
    this.showOneRant(this.props.rantId)
  }

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
      this.setState({showOne: data.data})
    })
  }

  render() {
    return (
      <div>
        {this.state.showOne.post && (
          <div>
            <h1>{this.state.showOne.post.title}</h1>
            <p>By: {this.state.showOne.post.created_by.username} at {this.state.showOne.post.created_at}</p>
            <p>{this.state.showOne.post.body}</p>
          </div>
        )}
      </div>
    )
  }
}
