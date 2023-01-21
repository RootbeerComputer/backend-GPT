import React, {Component} from 'react';
import {getNextModeByKey} from '../../services/mode';
import {wrapChildrenWith} from '../../util/common';

class KeyStrokeHandler extends Component {
    componentWillMount() {
        window.addEventListener('keydown', this.handleKeyUp.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyUp);
    }

    handleKeyUp(e) {
        const {mode} = this.props.data;
        const nextMode = getNextModeByKey(mode, e.keyCode);

        if (nextMode !== mode) {
            e.preventDefault();
            this.props.actions.changeMode(nextMode);
        }
    }

    render() {
        return <div>{wrapChildrenWith(this.props.children, this.props)}</div>;
    }
}

export default KeyStrokeHandler;
