import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
    fontSize:70,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
});


class MUITextField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
      }
    render() {
        const { classes } = this.props;
    
        return (
          
            <TextField
              id={this.props.id}
              label={this.props.label}
              defaultValue={this.props.defaultValue}
              className={classes.textField}
              margin="normal"
              required={this.props.required}
            />
        );
    }
            

}



MUITextField.propTypes = {
    classes: PropTypes.object.isRequired,
    };

export default withStyles(styles)(MUITextField);
  