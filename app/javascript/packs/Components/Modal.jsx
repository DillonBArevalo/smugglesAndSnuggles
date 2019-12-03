import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.closeOnEsc = this.closeOnEsc.bind(this);
    this.trapTab = this.trapTab.bind(this);
  }

  componentDidMount () {
    this.root = document.getElementById('modal');
    this.hideOtherContent();
    this.trapScroll();
    document.getElementById(this.props.firstFocusId || 'modalHeading').focus();
  }

  componentWillUnmount () {
    this.unhideOtherNodes();
    this.releaseScroll();
    document.getElementById(this.props.returnFocusTo).focus();
  }

  trapScroll () {
    this.cachedOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }

  releaseScroll () {
    document.body.style.overflow = this.cachedOverflow;
  }

  trapTab (event) {
    if (event.keyCode !== 9) {
      return;
    } else {
      event.preventDefault();
    }

    if (this.props.tabbableElementIds){
      this.focusNextElement(event);
    } else {
      document.getElementById('modalCloseButton').focus();
    }
  }

  focusNextElement(event) {
    const {tabbableElementIds} = this.props;
    const listLength = tabbableElementIds.length;
    const currentIndex = tabbableElementIds.indexOf(document.activeElement.id) || 0;
    const direction = event.shiftKey ? -1 : 1;
    const nextIndex = (currentIndex + direction + listLength) % listLength;
    document.getElementById(tabbableElementIds[nextIndex]).focus();
  }

  hideOtherContent () {
    const children = document.body.children;
    const nodeStates = [];
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.id !== 'modal') {
        const ariaHiddenState = node.getAttribute('aria-hidden');
        nodeStates.push({node, ariaHiddenState});
        node.setAttribute('aria-hidden', true);
      }
    }
    this.unhideOtherNodes = this.unhideOtherNodes.bind(this, nodeStates);
  }

  unhideOtherNodes (nodeStates) {
    nodeStates.forEach(nodeData => {
      nodeData.node.setAttribute('aria-hidden', nodeData.ariaHiddenState);
    })
  }

  closeOnEsc (event) {
    event.keyCode === 27 && this.props.closeModal();
  }

  renderModalContent () {
    return (<div
      id="modal"
      className="modal"
      onKeyUp={this.closeOnEsc}
      onKeyDown={this.trapTab}
    >
      <div className="modal__backdrop" onClick={this.props.closeModal}></div>
      <div className="modal__main" role="dialog">
        {this.props.children ? this.props.children : <Fragment>
          <h1
            id="modalHeading"
            className="modal__heading"
            tabIndex="-1"
            >
            Feature coming soon!
          </h1>
          <div className="modal__button-container">
            <button
              id="modalCloseButton"
              className="modal__button"
              onClick={this.props.closeModal}
            >
              Close
            </button>
          </div>
        </Fragment>}
      </div>
    </div>);
  }
  render () {
    return ReactDOM.createPortal(this.renderModalContent(), document.body);
  }
}

export default Modal;