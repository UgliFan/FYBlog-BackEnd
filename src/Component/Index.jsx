import React, { Component, PropTypes } from 'react'
//import pureRender from 'pure-render-decorator'
import { History, Link } from 'react-router'
import { connect } from 'react-redux'
import { is, fromJS } from 'immutable'
import { Tool } from '../Libs/Tool'

import { addTodo, completeTodo, setVisibilityFilter, VisibilityFilters } from '../Redux/Action/Index'

import AddTodo from './common/AddTodo'
import TodoList from './common/TodoList'
import Footer from './common/Footer'


class Main extends Component {
  constructor() {
    super();
  }
  render() {
    const { dispatch, visibleTodos, visibilityFilter } = this.props;
    return (
      <div>
        <AddTodo onAddClick={text => dispatch(addTodo(text))} />
        <TodoList todos={visibleTodos} onTodoClick={index => dispatch(completeTodo(index))} />
        <Footer filter={visibilityFilter} onFilterChange={nextFilter => dispatch(setVisibilityFilter(nextFilter))} />
      </div>
    );
  }
}

Main.propTypes = {
  visibleTodos: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    completed: PropTypes.bool.isRequired
  }).isRequired).isRequired,
  visibilityFilter: PropTypes.oneOf([
    VisibilityFilters.SHOW_ALL,
    VisibilityFilters.SHOW_ACTIVE,
    VisibilityFilters.SHOW_COMPLETED
  ]).isRequired
};

function selectTodos(todos, filter) {
  switch (filter) {
    case VisibilityFilters.SHOW_ALL:
      return todos;
    case VisibilityFilters.SHOW_COMPLETED:
      return todos.filter(todo => todo.completed);
    case VisibilityFilters.SHOW_ACTIVE:
      return todos.filter(todo => !todo.completed);
  }
};

function select(state) {
  return {
    visibleTodos: selectTodos(state.todos, state.visibilityFilter),
    visibilityFilter: state.visibilityFilter
  };
}

export default connect(select)(Main);
