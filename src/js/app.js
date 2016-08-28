import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';

var defaultState = {
    collection: {
        items: []
    }
};

function addCollection(message) {
    return {
        type: 'ADD_COLLECTION',
        message: message,
        completed: false
    };
}

function viewCollection(message) {
    return {
        type: 'VIEW_COLLECTION',
        index: index
    };
}

// function completeCollection(index) {
//     return {
//         type: 'COMPLETE_COLLECTION',
//         index: index
//     };
// }
//
// function deleteCollection(index) {
//     return {
//         type: 'DELETE_COLLECTION',
//         index: index
//     };
// }
//
// function clearCollection() {
//     return {
//         type: 'CLEAR_COLLECTION'
//     };
// }

function collectionApp(state, action) {
    switch (action.type) {
        case 'ADD_COLLECTION':
            return Object.assign({}, state, {});

        case 'VIEW_COLLECTION':
            var items = [].concat(state.collection.items);
            return Object.assign({}, state, {
                collection: {
                    items: items.concat([])
                }
            });

        // case 'COMPLETE_COLLECTION':
        //     var items = [].concat(state.collection.items);
        //
        //     items[action.index].completed = true;
        //
        //     return Object.assign({}, state, {
        //         collection: {
        //             items: items
        //         }
        //     });
        //
        // case 'DELETE_COLLECTION':
        //     var items = [].concat(state.collection.items);
        //
        //     items.splice(action.index, 1);
        //
        //     return Object.assign({}, state, {
        //         collection: {
        //             items: items
        //         }
        //     });
        //
        // case 'CLEAR_COLLECTION':
        //     return Object.assign({}, state, {
        //         collection: {
        //             items: []
        //         }
        //     });

        default:
            return state;
    }
}

var store = createStore(collectionApp, defaultState);

class AddCollectionForm extends React.Component {
    state = {
        message: ''
    };

    onFormSubmit(e) {
        e.preventDefault();
        store.dispatch(addCollection(this.state.message));
        this.setState({ message: '' });
    }

    onMessageChanged(e) {
        var message = e.target.value;
        this.setState({ message: message });
    }

    render() {
        return (
            <form onSubmit={this.onFormSubmit.bind(this)}>
                <input type="text" placeholder="Discogs username" onChange={this.onMessageChanged.bind(this)} value={this.state.message} />
                <input type="submit" value="Submit" />
            </form>
    );
    }
}

class CollectionItem extends React.Component {
    onDeleteClick() {
        store.dispatch(deleteCollection(this.props.index));
    }

    onCompletedClick() {
        store.dispatch(completeCollection(this.props.index));
    }

    render() {
        return (
            <li>
                <a href="#" onClick={this.onCompletedClick.bind(this)} style={{textDecoration: this.props.completed ? 'line-through' : 'none'}}>{this.props.message.trim()}</a>&nbsp;
                <a href="#" onClick={this.onDeleteClick.bind(this)} style={{textDecoration: 'none'}}>[x]</a>
            </li>
    );
    }
}

class CollectionList extends React.Component {
    state = {
        items: []
    };

    componentWillMount() {
        store.subscribe(() => {
            var state = store.getState();
        this.setState({
            items: state.collection.items
        });
    });
    }

    render() {
        var items = [];

        this.state.items.forEach((item, index) => {
            items.push(<CollectionItem
        key={index}
        index={index}
        message={item.message}
        completed={item.completed}
    />);
    });

        // if (!items.length) {
        //     return (
        //         <p>
        //             <i>Please add something to do.</i>
        //         </p>
        // );
        // }

        return (
            <ol>{ items }</ol>
    );
    }
}

ReactDOM.render(
    <div>
    <h1>Vinyl Shelves</h1>
    <AddCollectionForm />
    <CollectionList />
    </div>,
    document.getElementById('container')
);