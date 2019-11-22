import React, { Component } from "react";
import { deleteCatFact } from "../redux/actions";
import { connect } from "react-redux";

class ItemLine extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    const {
      item: { id },
      deleteCatFact
    } = this.props;
    deleteCatFact(id);
  }

  render() {
    const { item } = this.props;
    return (
      <li>
        {item.fact}
        <button onClick={this.handleClick}>delete</button>
      </li>
    );
  }
}

const mapDispatchToProps = {
  deleteCatFact: id => deleteCatFact(id)
};

export default connect(
  null,
  mapDispatchToProps
)(ItemLine);
