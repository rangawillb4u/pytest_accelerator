import React, { Component } from 'react';

import Select from 'react-select';
import CreatableSelect from 'react-select/lib/Creatable';
import makeAnimated from 'react-select/lib/animated';
import { colourOptions } from './../../../configs/data';


const styles = {
  option: (base, state) => ({
    ...base,
    //borderBottom: '1px dotted black',
    //color: state.isFullscreen ? 'red' : 'blue',
    padding: 5,
  }),
  control: () => ({
      // none of react-selects styles are passed to <View />
      width: 390,
  }),
  singleValue: (base, state) => {
    const opacity = state.isDisabled ? 0.5 : 1;
    const transition = 'opacity 300ms';

    return { ...base, opacity, transition };
  },
  multiValue: (base, state) => {
    return state.data.isFixed ? { ...base, backgroundColor: 'gray' } : base;
  },
  multiValueLabel: (base, state) => {
    return state.data.isFixed ? { ...base, fontWeight: 'bold', color: 'white', paddingRight: 6 } : base;
  },
  multiValueRemove: (base, state) => {
    return state.data.isFixed ? { ...base, display: 'none' } : base;
  }
};

const orderOptions = (values) => {
  return values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));
};

export default class FixedOptions extends Component {
  

  constructor(props) {
    super(props);
    this.state = {
      value: orderOptions(this.props.initialValue)
    }
    this.onChange = this.onChange.bind(this);
  }

  onChange (value, { action, removedValue }) {
    switch (action) {
      case 'remove-value':
      case 'pop-value':
        if (removedValue.isFixed) {
          return;
        }
        break;
      case 'clear':
        value = this.props.options.filter((v) => v.isFixed);
        break;
    }

    value = orderOptions(value);
    this.setState({ value: value });
    this.props.updateSelectedTags(value);
    console.log(value);
    console.log(this.props.options);
  }

  render () {
    const { options, placeHolder, initialValue } = this.props;
    return (
      <CreatableSelect
        value={initialValue}
        isMulti
        styles={styles}
        isClearable={this.state.value.some(v => !v.isFixed)}
        name="colors"
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={this.onChange}
        options={options}
        placeholder={placeHolder}
      />
    );
  }
}