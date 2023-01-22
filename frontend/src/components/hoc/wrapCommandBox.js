import KeyCode from 'keycode-js';
import { compose, withState, withHandlers } from 'recompose';

export default compose(
    withState('value', 'setValue', props => {
        console.log('got props', props);
        return props.value || ''
    }),
    withHandlers({
        handleKeyUp: ({ runCommand, setValue }) => e => {
            const text = e.target.value.trim();

            if (e.keyCode === KeyCode.KEY_RETURN && text) {
                runCommand(text);
                setValue('');
            }
        },
        handleChange: ({ setValue }) => e => {
            setValue(e.target.value);
        }
    })
);
