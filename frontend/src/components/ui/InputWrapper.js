import React from 'react';
import InputBox from './InputBox';
import CommandBox from './CommandBox';
import { MODE_SEARCH, MODE_CREATE } from '../../services/mode';

export default function InputWrapper(props) {
    const { mode, addNew, query, setSearchQuery, runCommand } = props;

    switch (mode) {
        case MODE_CREATE:
            return <InputBox {...{ addNew }} />;

        case MODE_SEARCH:
            return <CommandBox {...{ runCommand }} />
        default:
            return null;
    }
}
