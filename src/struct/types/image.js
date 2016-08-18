import React, { Component, PropTypes } from 'react';
import file from 'file-component';

const styles = {
  container: {
    position: 'relative',
    overflow: 'hidden',
    marginRight: '12px',
    border: '1px solid gray',
    borderRadius: '3px',
    background: 'rgba(255, 255, 255, .1)',
    padding: '2px 6px 6px',
    cursor: 'pointer',
    width: '32px',
    height: '32px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  name: {
    display: 'block',
    fontSize: '10px',
    color: '#666',
    textAlign: 'center',
    height: '20px'
  },
  input: {
    position: 'absolute',
    top: '0px',
    left: '0px',
    display: 'none'
  }
};

class Image extends Component {
  static propTypes = {
    name: PropTypes.string,
    data: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props, ...args) {
    super(props, ...args);
    this.state = {
      image: props.data
    };
  }

  handleChangeImage = e => {
    const img = file(e.target.files[0]);
    if (!img.is('image/*')) return;
    img.toDataURL((err, str) => {
      if (err) throw err;
      this.props.onChange(str);
    });
  };

  handleContextMenu = e => {
    e.preventDefault();
    e.stopPropagation();
    this.props.onChange(null);
  };

  render() {
    const { data, name, ...props } = this.props;
    delete props.onChange;

    return (
      <label style={styles.container} {...props} onContextMenu={this.handleContextMenu}>
        <span style={styles.name}>{name}</span>
        {data ? this.renderImage() : this.renderPlaceholder()}
        <input type="file" onChange={this.handleChangeImage} accept="image/*" style={styles.input}/>
      </label>
    );
  }

  renderImage() {
    return (
      <img src={this.props.data} height={30}/>
    );
  }

  renderPlaceholder() {
    return (
      <svg x="0px" y="0px" width="15.7px" height="17px" viewBox="0 0 15.7 17">
        <path fill="#808080" d="M15.1,6.1V5.4h-1.2L9.2,1.8c0.1-0.2,0.2-0.4,0.2-0.6
	C9.3,0.5,8.8,0,8.1,0C7.5,0,6.9,0.5,6.9,1.2c0,0.1,0,0.2,0,0.3L1.8,5.4H0.6v0.6H0v10.3h0.6v-0.6h0.6v-0.6h0.6V7.3H1.2V6.7H0.6V6.1
	h0.6v0.6h0.6v0.6h12.1v7.9H1.8v0.6H1.2v0.6H0.6V17h14.5v-0.6h0.6V6.1H15.1z M2.4,5.4l4.7-3.5c0.2,0.3,0.6,0.5,1,0.5
	c0.3,0,0.5-0.1,0.8-0.3l4.4,3.3H2.4z M13.9,6.7h0.6v0.6h-0.6V6.7z M15.1,16.3h-0.6v-0.6h-0.6v-0.6h0.6v0.6h0.6V16.3z M15.1,6.7h-0.6
	V6.1h0.6V6.7z"/>
        <polygon fill="#808080" points="8.7,11.9 7.4,10.5 6,12.7 4.9,11.7 3.8,13.9 12.6,13.9 10.6,9 "/>
        <circle fill="#808080" cx="5.1" cy="9.4" r="0.9"/>
      </svg>
    );
  }
}

export default Image;
