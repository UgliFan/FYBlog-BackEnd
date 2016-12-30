import React, { Component, PropTypes } from 'react'
import { VisibilityFilters } from '../../Redux/Action/Index'

export default class Footer extends Component {
  renderFilter(filter, name) {
    if (filter === this.props.filter) {
      return name;
    }
    return (
      <a href='#' onClick={e => {
        e.preventDefault();
        this.props.onFilterChange(filter);
      }}>{name}</a>
    );
  }

  render() {
    console.log(...VisibilityFilters);
    return (
      <p>
        Show:
        {' '}
        {this.renderFilter(VisibilityFilters.SHOW_ALL, 'All')}
        {', '}
        {this.renderFilter(VisibilityFilters.SHOW_COMPLETED, 'Completed')}
        {', '}
        {this.renderFilter(VisibilityFilters.SHOW_ACTIVE, 'Active')}
      </p>
    );
  }
}

Footer.propTypes = {
  onFilterChange: PropTypes.func.isRequired,
  filter: PropTypes.oneOf([
    VisibilityFilters.SHOW_ALL,
    VisibilityFilters.SHOW_ACTIVE,
    VisibilityFilters.SHOW_COMPLETED
  ]).isRequired
};
