import React, { Component } from 'react'

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000'

export default class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editCommentBody: '',
      editComment: false
    }
    this.toggleEditComment = this.toggleEditComment.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this. handleUpdateComment = this.handleUpdateComment.bind(this)
  }

  toggleEditComment() {
    this.setState({
      editCommentBody: this.props.comment.body,
      editComment: true
    })
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  handleUpdateComment(event) {
    event.preventDefault()
    fetch(baseURL + '/comments/' + this.props.comment.id, {
      method: "PUT",
      body: JSON.stringify({
        body: this.state.editCommentBody
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      this.props.handleUpdateComment(data.data)
      this.setState({editComment: false})
    })
  }

  render() {
    return (
      <div key={this.props.comment.id}>
        <h4>{this.props.comment.created_by.username}</h4>
        {this.state.editComment ? (
          <form onSubmit={this.handleUpdateComment}>
            <input type='text' name='editCommentBody' value={this.state.editCommentBody} onChange={this.handleChange} />
            <input type='submit' value='Edit comment' />
          </form>
        ) : (
          <p>{this.props.comment.body}</p>
        )}
        {this.props.user.username && (
          this.props.comment.created_by.username === this.props.user.username && (
            <div>
              <button onClick={() => {
                this.props.deleteComment(this.props.comment.id)
                }}>Delete</button>
                <button onClick={() => {
                  this.toggleEditComment()
                }}>Update</button>
            </div>
          )
      )}
    </div>
    )
  }
}
