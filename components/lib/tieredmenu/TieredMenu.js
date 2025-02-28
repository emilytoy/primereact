import * as React from 'react';
import PrimeReact from '../api/Api';
import { CSSTransition } from '../csstransition/CSSTransition';
import { useOverlayListener, useUnmountEffect } from '../hooks/Hooks';
import { OverlayService } from '../overlayservice/OverlayService';
import { Portal } from '../portal/Portal';
import { classNames, DomHandler, ObjectUtils, ZIndexUtils } from '../utils/Utils';
import { TieredMenuSub } from './TieredMenuSub';

export const TieredMenu = React.memo(React.forwardRef((props, ref) => {
    const [visibleState, setVisibleState] = React.useState(!props.popup);
    const menuRef = React.useRef(null)
    const targetRef = React.useRef(null);

    const [bindOverlayListener, unbindOverlayListener] = useOverlayListener({
        target: targetRef, overlay: menuRef, listener: (event, { valid }) => {
            valid && hide(event);
        }, when: visibleState
    });

    const onPanelClick = (event) => {
        if (props.popup) {
            OverlayService.emit('overlay-click', {
                originalEvent: event,
                target: targetRef.current
            });
        }
    }

    const toggle = (event) => {
        if (props.popup) {
            visibleState ? hide(event) : show(event);
        }
    }

    const show = (event) => {
        targetRef.current = event.currentTarget;
        setVisibleState(true);
        props.onShow && props.onShow(event);
    }

    const hide = (event) => {
        targetRef.current = event.currentTarget;
        setVisibleState(false);
        props.onHide && props.onHide(event);
    }

    const onEnter = () => {
        if (props.autoZIndex) {
            ZIndexUtils.set('menu', menuRef.current, PrimeReact.autoZIndex, props.baseZIndex || PrimeReact.zIndex['menu']);
        }

        DomHandler.absolutePosition(menuRef.current, targetRef.current);
    }

    const onEntered = () => {
        bindOverlayListener();
    }

    const onExit = () => {
        targetRef.current = null;
        unbindOverlayListener();
    }

    const onExited = () => {
        ZIndexUtils.clear(menuRef.current);
    }

    useUnmountEffect(() => {
        ZIndexUtils.clear(menuRef.current);
    });

    React.useImperativeHandle(ref, () => ({
        toggle,
        show,
        hide,
        ...props
    }));

    const createElement = () => {
        const otherProps = ObjectUtils.findDiffKeys(props, TieredMenu.defaultProps);
        const className = classNames('p-tieredmenu p-component', {
            'p-tieredmenu-overlay': props.popup
        }, props.className);

        return (
            <CSSTransition nodeRef={menuRef} classNames="p-connected-overlay" in={visibleState} timeout={{ enter: 120, exit: 100 }} options={props.transitionOptions}
                unmountOnExit onEnter={onEnter} onEntered={onEntered} onExit={onExit} onExited={onExited}>
                <div ref={menuRef} id={props.id} className={className} style={props.style} {...otherProps} onClick={onPanelClick}>
                    <TieredMenuSub menuProps={props} model={props.model} root popup={props.popup} />
                </div>
            </CSSTransition>
        )
    }

    const element = createElement();

    return props.popup ? <Portal element={element} appendTo={props.appendTo} /> : element;
}));

TieredMenu.displayName = 'TieredMenu';
TieredMenu.defaultProps = {
    __TYPE: 'TieredMenu',
    id: null,
    model: null,
    popup: false,
    style: null,
    className: null,
    autoZIndex: true,
    baseZIndex: 0,
    appendTo: null,
    transitionOptions: null,
    onShow: null,
    onHide: null
}
