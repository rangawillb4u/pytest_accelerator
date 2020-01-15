import React, {Component,Fragment} from "react";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  formControl: {
    margin: theme.spacing.unit,
    // minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
});


class SingleSelect extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const {classes} = this.props;
        return(
            <FormControl className={classes.formControl} fullWidth margin="normal">
                <InputLabel htmlFor={this.props.inputProps.id}>{this.props.label}</InputLabel>
                <Select
                    value={this.props.value}
                    onChange={(e)=>{this.props.onChange(e)}}
                    inputProps={this.props.inputProps}
                    displayEmpty={false}
                    fullWidth
                    required
                    
                >                          
                {this.props.menuItems()}
                </Select>
            </FormControl>
        );
    }
}


SingleSelect.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(SingleSelect);


{/* <FormControl className={classes.formControl}>
                        <InputLabel htmlFor="selected-test-pack">Test Pack</InputLabel>
                        <Select
                          value={this.props.state.selectedTestPack.value}
                          onChange={(e)=>{this.onTestPackSelect(e)}}
                          inputProps={{
                            name: 'selectedTestPack',
                            id: 'selected-test-pack',
                          }}
                        >                          
                        {this.updateTestPackListBox()}
                        </Select>
                      </FormControl> */}