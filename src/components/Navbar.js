import React, { Component } from "react";
import { Link } from "react-router-dom";

import "index.css";

class Navbar extends Component {
  render() {
    return (
      <div className="navbar">
        <Link to="/cats">CatFacts</Link>
        <Link to="/dogs">DogFacts</Link>
        <Link to="/todo">ToDo</Link>
      </div>
    );
  }
}

export default Navbar;
