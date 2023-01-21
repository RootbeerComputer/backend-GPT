import React, {Component} from 'react';
import {FILTER_ALL} from '../../services/filter';
import {MODE_CREATE, MODE_NONE} from '../../services/mode';
import {objectWithOnly, wrapChildrenWith} from '../../util/common';
import {getAll, addToList, updateStatus} from '../../services/todo';

class StateProvider extends Component {
    constructor() {
        super();
        this.state = {
            query: '',
            mode: MODE_CREATE,
            filter: FILTER_ALL,
            list: getAll()
        }
    }

    render() {
        let children = wrapChildrenWith(this.props.children, {
            data: this.state,
            actions: objectWithOnly(this, ['addNew', 'changeFilter', 'changeStatus', 'changeMode', 'setSearchQuery'])
        });

        return <div>{children}</div>;
    }

    addNew(text) {
        let updatedList = addToList(this.state.list, {text, completed: false});

        this.setState({list: updatedList});
    }

    changeFilter(filter) {
        this.setState({filter});
    }

    changeStatus(itemId, completed) {
        const updatedList = updateStatus(this.state.list, itemId, completed);

        this.setState({list: updatedList});
    }

    changeMode(mode = MODE_NONE) {
        this.setState({mode});
    }

    setSearchQuery(text) {
        this.setState({query: text || ''});
    }
}

export default StateProvider;
