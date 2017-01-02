import React, { Component, PropTypes } from 'react'

export default class Header extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div>
        
      </div>
    );
  }
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  callback: PropTypes.func
};
