import React, { Component } from 'react'
import {Link} from 'react-router-dom'

export default class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: []
    }
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
