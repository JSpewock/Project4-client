import React, { Component } from 'react'


const baseURL = process.env.REACT_APP_BASE_URL || 'http://localhost:8000'

export default class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allRants: []
    }
    this.getAllRants = this.getAllRants.bind(this)
  }

  componentDidMount() {
    this.getAllRants()
  }

  getAllRants() {
    fetch(baseURL + '/rantz/', {
      method: "GET",
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      return res.json()
    }).then(parsedData => {
      //hide the password and id of the user who made the rant
      const rants = []
      parsedData.data.map(rant => {
        rant.created_by.password = ''
        rant.created_by.id = '?'
        rants.push(rant)
      })
      this.setState({allRants: rants})
    })
  }

  

  render() {
    return (
      <div>
        <h1>hi</h1>
        <div className="all-rants">
        {this.state.allRants.map(rant => {
          return(<div key={rant.id} id={rant.id}>
            <h1>{rant.title}</h1>
            <p>{rant.body}</p>  
          </div>
          )
        })}
        </div>
      </div>
    )
  }
}
