import React, { Component, Fragment } from 'react';
import ReactDOM from 'react-dom';

class Modal extends Component {
  constructor(props) {
    super(props);
    this.closeOnEsc = this.closeOnEsc.bind(this);
  }

  componentDidMount () {
    this.root = document.getElementById('modal');
    this.hideOtherContent();
    this.trapTab();
    this.trapScroll();
    document.getElementById('modalHeading').focus();
  }
  componentWillUnmount () {
    this.unhideOtherNodes();
    document.getElementById(this.props.returnFocusTo).focus();
  }
  trapTab () {
  }
  trapScroll () {

  }
  hideOtherContent () {
    const children = document.body.children;
    const nodeStates = [];
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.id !== 'modal') {
        const ariaHiddenState = node.getAttribute('aria-hidden');
        nodeStates.push({node, ariaHiddenState});
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
    console.log(event);
    event.keycode === 27 && this.props.closeModal
  }

  renderModalContent () {
    return (<div id="modal" className="modal" onKeyUp={this.closeOnEsc}>
      <div className="modal__backdrop" onClick={this.props.closeModal}></div>
      <div className="modal__main" role="dialog">
        {this.props.children ? this.props.children : <Fragment>
          <h1
            id="modalHeading"
            className="modal__title"
            tabIndex="-1"
            >
            Feature coming soon\u2122
          </h1>
          <button
            className="modal__button"
            onClick={this.props.closeModal}
            >
            Okay
          </button>
        </Fragment>}
      </div>
    </div>);
  }
  render () {
    console.log('running render');
    console.log('body', document.body);
    return ReactDOM.createPortal(this.renderModalContent(), document.body);
  }
}

export default Modal;