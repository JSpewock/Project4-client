import React, { Component } from 'react'

export default class Rant extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.rant.title}</h1>
        <p>By: {this.props.rant.created_by.username} at {this.props.rant.created_at}</p>
        <p>{this.props.rant.body}</p>
      </div>
    )
  }
}
