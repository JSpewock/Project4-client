import React, { Component } from 'react'
import {Link} from 'react-router-dom'

const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: [],
      check: ''
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

  render() {
    return (
      <div>
         <div className="all-rants">
          {this.props.allRants.map(rant => {
            return(
              <div key={rant.id} id={rant.id}>
                <Link to={`/s/${rant.id}`}>
                  <h1>{rant.title}</h1>
                </Link>
                <p>{rant.body}</p>  
              </div>
            )
          })}
          </div>
      </div>
    )
  }
}
