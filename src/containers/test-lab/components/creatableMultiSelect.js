import React, { Component } from 'react';

import CreatableSelect from 'react-select/lib/Creatable';
import makeAnimated from 'react-select/lib/animated';


const customStyles = {
    option: (base, state) => ({
        ...base,
        //borderBottom: '1px dotted black',
        //color: state.isFullscreen ? 'red' : 'blue',
        padding: 5,
    }),
    control: () => ({
        // none of react-selects styles are passed to <View />
        //width: 390,
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
}
const orderOptions = (values) => {
  return values.filter((v) => v.isFixed).concat(values.filter((v) => !v.isFixed));
};
export default class CreatableMultiSelect extends Component {
  constructor(props){
      super(props)
      this.state = {
        value: []//orderOptions([this.props.options[0], this.props.options[1], this.props.options[3]])
      }
  }

  handleChange = (newValue, actionMeta) => {
    var selectedOptions = []
    for (const item of newValue){
      selectedOptions.push(item.value.replace(/\s/g, '_'))
    }
    this.props.updateSelectedTags(selectedOptions);
    this.props.setValue(newValue);
    console.group('Value Changed');
    console.log(newValue);
    console.log(`action: ${actionMeta.action}`);
    console.log(this.props.options);
    console.groupEnd();
  };

  render() {
    const { options, placeHolder, value } = this.props;
    return (
      <CreatableSelect
        value = {value}
        isMulti
        closeMenuOnSelect={false}
        components={makeAnimated()}
        onChange={this.handleChange}
        options={options}
        placeholder={placeHolder}
        styles={customStyles}
        //isClearable={this.state.value.some(v => !v.isFixed)}
      />
    );
  }
}