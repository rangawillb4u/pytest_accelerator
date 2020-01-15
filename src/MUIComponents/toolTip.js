import React, {Component,Fragment} from "react";
import Tooltip from '@material-ui/core/Tooltip';
import Zoom from '@material-ui/core/Zoom';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit
  },
  customWidth: {
    maxWidth: 500,
    fontSize: 20
  },
  noMaxWidth: {
    maxWidth: "none",
    fontSize: 12
  },
  customFontsize: {
    fontSize: 14
  }
});


class MUIToolTip extends Component{
    constructor(props){
        super(props);
        this.state = {}
    }

    render(){
        const {classes} = this.props;
        return(
          <Tooltip TransitionComponent={Zoom} title={this.props.longText} classes={{ tooltip: classes.customFontsize }}>
            {this.props.toolTipElement}
          </Tooltip>
        );
    }
}


MUIToolTip.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(MUIToolTip);
