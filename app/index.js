import React, { PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';

let onAddTODO = () => {

}

const TODOApp = ({todos}) => (
  <div>
    <ul>
    {
      Object.keys(todos).map(id => (
        <li key={id}>{id}</li>
      ))
    }
    </ul>
    <button onClick={onAddTODO}>新增</button>
  </div>
);

// state
const initialState = {
    todos: [],
    nextId: 1
}
window.state = initialState;

// reducer
const CREATE_TODO = 'CREATE_TODO';
const UPDATE_TODO = 'UPDATE_TODO';
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CREATE_TODO: {
      const id = state.nextId;
      const newTODO = {
        id,
        content: ''
      };
      return {
        ...state,
        nextId: id + 1,
        todos: {
          ...state.todos,
          [id]: newTODO
        }
      };
    }
    case UPDATE_TODO: {
      const {id, content} = action;
      const editedTODO = {
        ...state.todos[id],
        content
      };
      return {
        ...state,
        todos: {
          ...state.todos,
          [id]: editedTODO
        }
      };
    }
    default:
      return state;
  }
};

// 1. test reducer

// 1.1 suit 1
// const state0 = reducer(undefined, {
//   type: CREATE_TODO
// });
// console.log(state0);

// const state1  = reducer(state0, {
//   type: UPDATE_TODO,
//   id: 1,
//   content: 'Hello, world!'
// });
// console.log(state1);

// 1.2 suit 2
// const actions = [
//   {type: CREATE_TODO},
//   {type: UPDATE_TODO, id: 1, content: 'Hello, world!'}
// ];

// const state = actions.reduce(reducer, undefined);
// console.log(state);

// 1.3 suit 3
const createStore = (reducer, preloadedState) => {
  let currentState = undefined;
  let nextListeners = [];
  return {
    dispatch: (action) => {
      currentState = reducer(preloadedState, action);
    },
  	getState: () => currentState,
	subscribe: handler => {
	  	nextListeners.push(listener)

	    return function unsubscribe() {
	      var index = nextListeners.indexOf(listener)
	      nextListeners.splice(index, 1)
	    }
	}

  };
};

const store = createStore(reducer, window.state);

store.dispatch({
  type: CREATE_TODO
});
console.log(store.getState());



const renderApp = () => {
  ReactDOM.render(
    <TODOApp todos={window.state.todos}/>,
    document.getElementById('root')
  );
};

renderApp();