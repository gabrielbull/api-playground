import React, { Component, PropTypes } from 'react';
import Button from '../../ui/button';
import RemoveButton from '../../ui/buttons/removeButton';
import Struct from './struct';

const styles = {
  container: {
    flex: 1,
    borderLeft: '2px solid rgb(0, 180, 255)',
    paddingLeft: '8px',
    marginBottom: '8px'
  },
  dataContainer: {
    margin: '20px 0',
    borderBottom: '1px solid gray'
  },
  row: {
    borderLeft: '2px solid rgba(255, 255, 255, .08)',
    borderTop: '2px solid rgba(255, 255, 255, .08)',
    borderBottom: '2px solid rgba(255, 255, 255, .08)',
    background: 'rgba(255, 255, 255, .05)',
    paddingLeft: '8px',
    paddingTop: '8px',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
  },
  rowContent: {
    flex: '1'
  },
  rowControls: {
    flex: '0',
    marginLeft: '20px',
    marginRight: '20px',
  },
  name: {
    textTransform: 'uppercase'
  },
  footer: {
    display: 'flex',
    flexDirection: 'row',
  }
};

class ArrayComponent extends Component {
  static propTypes = {
    name: PropTypes.string,
    struct: PropTypes.object,
    data: PropTypes.array,
    onChange: PropTypes.func
  };

  addItem = () => {
    this.props.onChange([ ...this.props.data, {} ]);
  };

  removeItem = index => {
    this.props.onChange([
      ...this.props.data.slice(0, index),
      ...this.props.data.slice(index + 1)
    ]);
  };

  handleChange = (index, data) => {
    this.props.onChange([
      ...this.props.data.slice(0, index),
      { ...this.props.data[index], ...data },
      ...this.props.data.slice(index + 1)
    ]);
  };

  render() {
    const { name, data, style, ...props } = this.props;
    delete props.struct;
    delete props.onChange;

    return (
      <div style={{ ...styles.container, ...style }} {...props}>
        <div style={styles.name}>{name}</div>
        <div style={styles.dataContainer}>
          {data.map(this.renderItem)}
        </div>
        <div style={styles.footer}>
          <Button onClick={this.addItem}>
            <svg x="0px" y="0px" width="10px" height="10px" viewBox="0 0 10 10" style={{ marginRight: '6px' }}>
              <path  fill="#333333" d="M6,6l3.5,0C9.8,6,10,5.9,10,5.6l0-1.2C10,4.1,9.8,4,9.6,4L6,4
                l0-3.5C6,0.2,5.9,0,5.6,0L4.4,0C4.1,0,4,0.2,4,0.4L4,4L0.4,4C0.2,4,0,4.1,0,4.4l0,1.2C0,5.9,0.2,6,0.4,6L4,6l0,3.5
                C4,9.8,4.1,10,4.4,10l1.3,0C5.9,10,6,9.8,6,9.6L6,6z"/>
            </svg>
            Add {name}
          </Button>
        </div>
      </div>
    );
  }

  renderItem = (item, index) => {
    return (
      <div key={index} style={styles.row}>
        <div style={styles.rowContent}>
          <Struct struct={this.props.struct} data={item} onChange={v => this.handleChange(index, v)}/>
        </div>
        <div style={styles.rowControls}>
          <RemoveButton onClick={() => this.removeItem(index)}>Remove</RemoveButton>
        </div>
      </div>
    );
  };
}

export default ArrayComponent;
