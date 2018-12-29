import React, { Component } from 'react';
import './App.css';
import Portfolio from "./Portfolio";

class App extends Component {
  constructor () {
    super();

    this.state = {
      portfolios: [],
        search: ""
    };

  }

  deletePortfolio = i => {
  	let portfolioscopy = this.state.portfolios.slice();
  	portfolioscopy.splice(i, 1);
  	
  	this.setState({portfolios: portfolioscopy});
  }

  onInputChange = e => {
    this.setState({
      search: e.target.value
    });
  }

  onClick = () => {
    //Maximum number of portfolios is 10. A simple if statement checks this before adding a new entry.
    if(this.state.portfolios.length !== 10){
      let portfoliocopy = this.state.portfolios.slice();
      if(this.state.search !== "") {
          portfoliocopy.push(this.state.search);
      }else{portfoliocopy.push("Portfolio");}
      this.setState({
        portfolios: portfoliocopy,
          search: ""
      });
    }else{
      alert("Maximum portfolio limit is 10.")
    }
  }

  render() {
    let showportfolios = this.state.portfolios.map((e,i) => {
       return (
           //When mapping over the portfolios the index is assigned as a key
           //E is used to pass the arguments from the stored portfolio. In this case inputted name
           // or the default name Portfolio is passed to the Portfolio tag.
           <Portfolio key={i} name={e} delete={() => this.deletePortfolio(i)}/>
       );

      });


    return (
      <div className="App">
        <input default={"Portfolio"} placeholder={"Enter name of portfolio"} value={this.state.search} onChange={this.onInputChange}/>
        <button onClick={this.onClick}>Add portfolio</button><br/>
          {this.state.portfolios.length === 0 ? "No portfolios yet" : showportfolios}
      </div>
    );
  }
}

export default App;
