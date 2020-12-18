import React, { Component } from 'react'
import {Link} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: [],
      check: '',
      topic: 'Recent'
    }
  }

  componentDidMount() {
    fetch(baseURL + '/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => {
      return res.json()
    }).then(check => {
      this.setState({check: check.status.code})
    })
  }

  handleSort(topicChoice) {
    //took this from https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
    const topicUppercase = topicChoice.charAt(0).toUpperCase() + topicChoice.slice(1)
    this.setState({topic: topicUppercase})
    this.props.handleSort(topicChoice)
  }

  render() {
    return (
      <div>
        <div className="centering">
          <div className="sort-menu">
            <h2 className="sort-hover">Sort by topic:<br></br> {this.state.topic}</h2>
            <div className="menu-contents">
              <a href='#' onClick={() => {
                this.handleSort('other')}
                }>Other</a>
              <a href='#' onClick={() => {
                this.handleSort('games')
              }}>Games</a>
              <a href='#' onClick={() => {
                this.handleSort('food')
              }}>Food</a>
              <a href='#' onClick={() => {
                this.handleSort('people')
              }}>People</a>
              <a href='#' onClick={() => {
                this.handleSort('company')
              }}>Company</a>
              <a href='#' onClick={() => {
                this.handleSort('place')
              }}>Place</a>
              <a href='#' onClick={() => {
                this.handleSort('recent')
              }}>Recent</a>
              <a href='#' onClick={() => {
                this.handleSort('all')
              }}>All</a>
            </div>
          </div>
        </div>
         <div className="all-rants">
          {this.props.allRants.map(rant => {
            return(
              <Link to={`/s/${rant.id}`}>
              <div key={rant.id} id={rant.id} className="rant" >
                <p className="posted-by">Posted by <span className="user">/ {rant.created_by.username} /</span> on {rant.created_at}</p>
                <h1>{rant.title}</h1>
                <p className="short-body">{rant.shortBody} ...</p>  
              </div>
              </Link>
            )
          })}
          </div>
      </div>
    )
  }
}
