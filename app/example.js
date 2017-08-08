import React, { PropTypes, Component} from 'react';
import ReactDOM from 'react-dom';

let onAddTODO = () => {

}

const TODOApp = ({todos, handeladd, handeledit}) => (
  <div>
    <ul>
    {
      todos && Object.keys(todos).map((id, content) => (
        <li key={id}>{content}</li>
      ))
    }
    </ul>
    <button onClick={handeladd}>add</button>
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
  let store = {
    dispatch: (action) => {
      currentState = reducer(preloadedState, action);
      nextListeners.forEach(listener => listener());
    },
  	getState: () => currentState,
	subscribe: listener => {
	  	nextListeners.push(listener)

	    return function unsubscribe() {
	      var index = nextListeners.indexOf(listener)
	      nextListeners.splice(index, 1)
	    }
	}
  };
  store.dispatch({type: '@@redux/INIT'});
  return store;
};

const store = createStore(reducer, window.state);

// store.dispatch({
//   type: CREATE_TODO
// });
// console.log(store.getState());

// store.subscribe(() => {
//   ReactDOM.render(
//     <pre>{JSON.stringify(store.getState())}</pre>,
//     document.getElementById('root')
//   );
// });


class TODOAppContainer extends React.Component {
  constructor(props) {
    super();
    this.state = props.store.getState();
    this.handeladd = this.handeladd.bind(this);
    this.handeledit = this.handeledit.bind(this);
  }
  componentWillMount() {
    this.unsubscribe = this.props.store.subscribe(() =>
      this.setState(this.props.store.getState())
    );
  }
  componentWillUnmount() {
    this.unsubscribe();
  }
  handeladd() {
    this.props.store.dispatch({
      type: CREATE_TODO
    });
  }
  handeledit(id, content) {
    this.props.store.dispatch({
      type: UPDATE_TODO,
      id,
      content
    });
  }
  render() {
    return (
      <TODOApp
        {...this.state}
        handeladd={this.handeladd}
        handeledit={this.handeledit}
      />
    );
  }
}

ReactDOM.render(
  <TODOAppContainer store={store}/>,
  document.getElementById('root')
);
// const renderApp = () => {
//   ReactDOM.render(
//     <TODOApp todos={window.state.todos}/>,
//     document.getElementById('root')
//   );
// };

// renderApp();