import { VisibilityFilters } from '../Action/Index'
import {
  ADD_TODO,
  COMPLETE_TODO,
  SET_VISIBILITY_FILTER
} from '../Action/Index'

const initialState = {
  visibilityFilter: VisibilityFilters.SHOW_ALL
};

export function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return [
        ...state,
        {
          text: action.text,
          completed: false
        }
      ];
    case COMPLETE_TODO:
      return state.map((todo, index) => {
        if (index === action.index) {
          return Object.assign({}, todo, {
            completed: !todo.completed
          });
        }
        return todo;
      })
    default:
      return state;
  }
}

export function visibilityFilter(state = VisibilityFilters.SHOW_ALL, action) {
  switch (action.type) {
    case SET_VISIBILITY_FILTER:
      return action.filter;
    default:
      return state;
  }
}
