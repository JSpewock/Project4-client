import React, { Component } from 'react'
import {Link, Redirect} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Rant extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showOne: {},
      user: {},
      owner: false,
      deleted: false,
      commentBody: '',
      showInput: false
    }
    this.checkOwner = this.checkOwner.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleAddComment = this.handleAddComment.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  componentDidMount() {
    // this.showOneRant(this.props.rantId)

    //I tried to break this one up a little more. This is just two api calls, the first to get the data for the post, and the next to verify the user
    // ----------------------------------
    //             Post data
    // ----------------------------------
    fetch(baseURL + '/rantz/' + this.props.rantId, {
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
    }).then(res => {
      // ----------------------------
      //         Verify User
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
          if (check.status.code !== 401) {
            this.setState({
              user: check.data 
            })
          }
        }).then(res => {
          //check to see if the user made this post
          this.checkOwner()
        })
      }
      })
  }

  checkOwner() {
    //if you made this post the website recognizes that
    if (this.state.user.username) {
      if (this.state.user.username === this.state.showOne.post.created_by.username) {
        this.setState({owner: true})
      }
    }
  }

  handleDelete(id) {
    const areYouSure = prompt('Are you sure you want to delete this?', 'Y/N')
    //This is pretty much a bunch of if/else statements that say if you say anything other than 'y' in the prompt it wont delete
    if (areYouSure == null) {
      return ''
    } else if (areYouSure.toLowerCase() === 'y') {
      fetch(baseURL + '/rantz/' + id, {
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': localStorage.getItem('token')
         }
      }).then(res => {
        return res.json()
      }).then(data => {
        if (data.status.code === 401) {
          this.setState({error: data.status.message})
        } else {
          this.setState({deleted: true})
          this.props.handleDelete(id)
        }
      })
    } else {
      return ''
    }
  }

  handleAddComment(event, id) {
    event.preventDefault()
    fetch(baseURL + '/comments/' + id, {
      method: "POST",
      body: JSON.stringify({
        body: this.state.commentBody
      }),
      headers: {
        'Content-Type': 'application/json',
        'x-access-token': localStorage.getItem('token')
      }
    }).then(res => {
      return res.json()
    }).then(data => {
      const fakeObject = this.state.showOne
      fakeObject.comments.unshift(data)
      console.log(fakeObject)
      this.setState({showOne: fakeObject})
    })
  }

  handleChange(event) {
    this.setState({[event.target.name]: event.target.value})
  }

  render() {
    return (
      <div>
        {this.state.deleted ? (
          <Redirect to='/' />
        ) : (
          this.state.showOne.post && (
            <div>
              <h1>{this.state.showOne.post.title}</h1>
              <p>By: {this.state.showOne.post.created_by.username} at {this.state.showOne.post.created_at}</p>
              <p>{this.state.showOne.post.body}</p>
              {this.state.owner && (
                <div>
                  <Link to={`/p/update/${this.state.showOne.post.id}`}>
                    <button>Update</button>
                  </Link>
                  <button onClick={() => {
                    this.handleDelete(this.state.showOne.post.id)}
                    } >Delete</button>
                </div>
              )}
              {this.state.user.username && (
                <button onClick={() => {
                  this.setState({showInput: true})
                }}>Add Comment</button>
              )}
              {this.state.showInput && (
                <form onSubmit={() => {
                  this.handleAddComment(this.state.showOne.post.id)
                }}>
                  <input type='text' name='commentBody' value={this.state.commentBody} onChange={this.handleChange} />
                  <input type='submit' value='Add comment'/>
                </form>
              )}
            </div>
          )
        )}
        
      </div>
    )
  }
}
