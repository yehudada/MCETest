import React, { Component } from "react";
import "./App.css";
import Tree from 'react-tree-graph';

var usbData = []
class App extends Component {
  constructor(props) {
      super(props);
      this.state = { apiResponse: "" };
  }

  callAPI(that) {
      fetch("http://localhost:9000/usbtree")
      .then(res => res.json())
      .then(res => {
        usbData = res["result"];
        console.log(JSON.stringify(usbData));
        console.log("rhar - " + that)
        that.forceUpdate()
        that.setState({ usbtree: usbData });
      })
      
      .catch(err => err);
  }

  componentDidMount() {
    this.timerID = setInterval(this.callAPI.bind(null, this), 4000);
    this.callAPI(this);
  }


  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  render() {
    console.log("Render!")
    const trees = usbData.map((tree) => {
      return <Tree data={tree} height={400} width={400} key={tree.id}/>
    });
      return (  
        <div>
          {trees}
        </div>
      );
      
  }
}

export default App;
