import React, { Component } from 'react';
import Modal from './Modal';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      isDragging: false,
      isUploaded: false,
      imgSrc: this.props.imgSrc,
      imageSize: {
        width: '100%',
        height: '100%'
      }
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.updateImageSize = this.updateImageSize.bind(this);
    this.toggleResizeListener = this.toggleResizeListener.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addDraggingStyles = this.addDraggingStyles.bind(this);
    this.removeDraggingStyles = this.removeDraggingStyles.bind(this);

    this.reader = new FileReader();
    this.reader.onload = function (e) {
      this.setState({imgSrc: e.target.result});
    }.bind(this);
  }

  componentDidMount() {
    document.getElementById(this.props.triggerId).addEventListener(
      'click',
      this.toggleModal
    );
  }

  updateImageSize () {
    let {width, height} = document.getElementById('modalPictureContainer').getBoundingClientRect();
    const imageMargin = 16;
    const largestDimension = Math.min(width, height) - imageMargin;
    const dimensionInPx = `${largestDimension}px`;
    if (dimensionInPx != this.state.imageSize.width) {
      this.setState({imageSize: {width: dimensionInPx, height: dimensionInPx}});
    }
  }

  toggleModal () {
    this.setState({showModal: !this.state.showModal}, this.toggleResizeListener);
  }

  toggleResizeListener () {
    window[
      this.state.showModal ? 'addEventListener' : 'removeEventListener'
    ]('resize', this.updateImageSize);
  }

  addDraggingStyles () {
    this.setState({isDragging: true});
  }

  removeDraggingStyles () {
    this.setState({isDragging: false});
  }

  submitPhoto (event) {
    event.preventDefault();
    console.log('in submit', event);
  }

  handleChange (event) {
    console.log('changed', event);
    const input = event.target
    const splitUrl = input.value.split('.');
    const ext = splitUrl[splitUrl.length - 1].toLowerCase();
    let imgSrc = this.props.imgSrc;
    if (input.files && input.files[0]&& (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")) {
      this.reader.readAsDataURL(input.files[0]);
    } else {
      this.setState({imgSrc});
    }
  }

  render() {
    return <span>
      Edit profile picture
      {this.state.showModal &&
        <Modal
          closeModal={this.toggleModal}
          firstFocusId="modalHeading"
          returnFocusTo={this.props.triggerId}
          tabbableElementIds={['cancelButton', 'pictureInput', 'submitButton']}
          rootClass="modal--profile"
          renderedCallback={this.updateImageSize}
        >
          <div className="modal__heading-container">
            <h1
              className="modal__heading"
              id="modalHeading"
              tabIndex="-1"
              >Update profile picture</h1>
            <button
              id="cancelButton"
              className="modal__button modal__button--cancel"
              type="button"
              onClick={this.toggleModal}
              aria-label="cancel"
            >X</button>
          </div>
          <div className="modal__body-container">
            <form className="modal__new-picture-form" action="" onSubmit={this.submitPhoto}>
              <input
                className="modal__input"
                id="pictureInput"
                type="file"
                onChange={this.handleChange}
                onDrop={this.removeDraggingStyles}
                onDragEnter={this.addDraggingStyles}
                onDragLeave={this.removeDraggingStyles}
              />
              <label
                htmlFor="pictureInput"
                className={'modal__label' + (this.state.isDragging ? ' profile__label--dragging' : '')}
              >
                Click to upload a new photo or drag and drop a photo here
              </label>
              <button
                id="submitButton"
                className="modal__button modal__button--quit"
                type="submit"
              >Submit picture</button>
            </form>
            <div id="modalPictureContainer" className="modal__profile-picture-placeholder-container">
              <img
                className="modal__profile-picture-placeholder"
                alt={this.state.isUploaded ? 'Uploaded image preview' : 'No uploaded image'}
                style={this.state.imageSize}
                src={this.state.imgSrc}
              />
            </div>
          </div>
        </Modal>
      }
    </span>
  }
}

export default Profile;