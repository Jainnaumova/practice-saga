import React, { Component } from "react";
import ItemLine from "./ItemLine";
import { connect } from "react-redux";

import { addCatFact } from "../redux/actions";

class CatFacts extends Component {
  constructor(props) {
    super(props);

    this.mapCatsFacts = this.mapCatsFacts.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  mapCatsFacts() {
    const { items } = this.props;

    return items.map(item => (
      <div key={item.id}>
        <ItemLine item={item} />
      </div>
    ));
  }

  handleClick() {
    const { addCatFact } = this.props;
    addCatFact();
  }

  render() {
    return (
      <div>
        <ul>{this.mapCatsFacts()}</ul>
        <button onClick={this.handleClick}>Add new cat fact</button>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    items: state.catReducer.catFacts
  };
};

const mapDispatchToProps = {
  addCatFact
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CatFacts);
