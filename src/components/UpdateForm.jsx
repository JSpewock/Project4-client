import React, { Component } from 'react'

export default class UpdateForm extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  render() {
    return (
      <div>
        <h1>{this.props.postId}</h1>
      </div>
    )
  }
}
