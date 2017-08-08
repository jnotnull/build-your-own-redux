import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// createStore
const createStore = (reducer, preloadedState) => {
  let state;
  const nextListeners = [];
  const store = {
    dispatch: action => {
      state = reducer(state, action);
      nextListeners.forEach(listener => listener());
    },
    getState: () => state,
    subscribe: listener => {
      nextListeners.push(listener);
      return () => {
        const index = nextListeners.indexOf(listener);
        if (index > 0) {
          nextListeners.splice(index, 1);
        }
      };
    }
  };
  store.dispatch({type: '@@redux/INIT'});
  return store;
};

//Provider
class Provider extends React.Component {
  getChildContext() {
    return {
      store: this.props.store
    };
  }
  render() {
    return this.props.children;
  }
}

Provider.childContextTypes = {
  store: PropTypes.object
};

//connect
const connect = (mapStateToProps, mapDispatchToProps) => {

	return (Component) => {

	  	class Connected extends React.Component {

		    onStoreOrPropsChange(props) {
		      const {store} = this.context;
		      const state = store.getState();
		      const stateProps = mapStateToProps(state, props);
		      const dispatchProps = mapDispatchToProps(store.dispatch, props);
		      this.setState({
		        ...stateProps,
		        ...dispatchProps
		      });
		    }

		    componentWillMount() {
		      const {store} = this.context;
		      this.onStoreOrPropsChange(this.props);
		      this.unsubscribe = store.subscribe(() =>
		        this.onStoreOrPropsChange(this.props)
		      );
		    }

		    componentWillReceiveProps(nextProps) {
		      this.onStoreOrPropsChange(nextProps);
		    }

		    componentWillUnmount() {
		      this.unsubscribe();
		    }

		    render() {
		      return <Component {...this.props} {...this.state}/>;
		    }
	  	}

	  	Connected.contextTypes = {
			store: PropTypes.object
		};

	  	return Connected;
	}
};

const CREATE_TODO = 'CREATE_TODO';
const UPDATE_TODO = 'UPDATE_TODO';
const SAVE_TODO = 'SAVE_TODO';

const initialState = {
	openId: null,
	nextId: 1,
	TODOs: {}
};

// reducer
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
        openId: id,
        TODOs: {
          ...state.TODOs,
          [id]: newTODO
        }
      };
    }
    case UPDATE_TODO: {
      const {id, content} = action;
      const editedTODO = {
        ...state.TODOs[id],
        content
      };
      return {
        ...state,
        TODOs: {
          ...state.TODOs,
          [id]: editedTODO
        }
      };
    }
    case SAVE_TODO: {
      return {
        ...state,
        openId: null
      };
    }
    default:
      return state;
  }
};


// store
const store = createStore(reducer);

const TODOEditor = ({todo, onChangeTODO, onSaveTODO}) => (
  <div>
    <div>
      <textarea
        value={todo.content}
        onChange={event =>
          onChangeTODO(todo.id, event.target.value)
        }
      />
    </div>
    <button onClick={onSaveTODO}>
      save
    </button>
  </div>
);

// component
const TODOApp = ({TODOs, openId, onAddTODO, onChangeTODO, onSaveTODO, nextId}) => {
	return  <div>

  	{
  		openId ?
        <TODOEditor
          todo={TODOs[openId]}
          onChangeTODO={onChangeTODO}
          onSaveTODO={onSaveTODO}
        /> : <div>
        <ul>
		    {
			    Object.keys(TODOs).map((id, index) =>
			        <li key={id}>{TODOs[id].content}</li>
			    )
			}
			</ul>
			<button onClick={onAddTODO}>New</button>
        </div>
  	}

  	

  </div>
};

const mapStateToProps = state => ({
  TODOs: state.TODOs,
  openId: state.openId
});

const mapDispatchToProps = dispatch => ({
  onAddTODO: () => {
  	dispatch({
	    type: CREATE_TODO
	})
  },
  onChangeTODO: (id, content) => dispatch({
    type: UPDATE_TODO,
    id,
    content
  }),
  onSaveTODO: (id, content) => dispatch({
    type: SAVE_TODO
  })
});

const TODOAppContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(TODOApp);

// run
ReactDOM.render(
  <Provider store={store}>
    <TODOAppContainer/>
  </Provider>,
  document.getElementById('root')
);