import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import CatFacts from "./components/CatFacts";
import DogFacts from "./components/DogFacts";
import ToDo from "./components/ToDo";

import "./App.css";

function App() {
  return (
    <Router>
      <div>
        <div className="navbar-container">
          <Navbar />
        </div>
        <div className="selection-container">
          <Switch>
            <Route path="/cats" exact component={CatFacts} />
            <Route path="/dogs" exact component={DogFacts} />
            <Route path="/todo" exact component={ToDo} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
