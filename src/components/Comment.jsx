import React, { Component } from 'react'

export default class Comment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      commentToUpdate: ''
    }
    this.toggleEditComment = this.toggleEditComment.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  toggleEditComment(id) {
    const commentToUpdate = this.state.showOne.comments.find(comment => comment.id === id)
    this.setState({commentToUpdate: commentToUpdate.body})
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <div key={this.props.comment.id}>
        <h4>{this.props.comment.created_by.username}</h4>
        {this.state.editComment ? (
          <form>
            <input type='text' name='editCommentBody' onChange={this.handleChange} />
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
                  this.toggleEditComment(this.props.comment.id)
                }}>Update</button>
            </div>
          )
      )}
    </div>
    )
  }
}
