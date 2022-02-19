import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ObjectUtils, classNames } from '../utils/Utils';

export const Toolbar = (props) => {
    const toolbarClass = classNames('p-toolbar p-component', props.className);
    const left = ObjectUtils.getJSXElement(props.left, props);
    const right = ObjectUtils.getJSXElement(props.right, props);

    return (
        <div id={props.id} className={toolbarClass} style={props.style} role="toolbar">
            <div className="p-toolbar-group-left">
                {left}
            </div>
            <div className="p-toolbar-group-right">
                {right}
            </div>
        </div>
    );
}

Toolbar.defaultProps = {
    id: null,
    style: null,
    className: null,
    left: null,
    right: null
};

Toolbar.propTypes = {
    id: PropTypes.string,
    style: PropTypes.object,
    className: PropTypes.string,
    left: PropTypes.any,
    right: PropTypes.any
};
