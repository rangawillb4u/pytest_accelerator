import React, { Component } from 'react';

import Select from 'react-select/lib/Creatable';
import makeAnimated from 'react-select/lib/animated';
//import { colourOptions } from '../data';


export default class CreatableSingleSelect extends Component {
  constructor(props){
      super(props)
      this.state = {
        selectedOption: this.props.initialValue
      }
  }

  handleChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.updateSelectedItem(selectedOption);
    console.log(`Option selected:`, selectedOption);
  }

  render() {
    const { selectedOption } = this.state;
    return (
      <Select
        components={makeAnimated()}
        onChange={this.handleChange}
        options={this.props.options}
        value={this.props.initialValue} 
        placeholder={this.props.placeHolder}
      />
    );
  }
}