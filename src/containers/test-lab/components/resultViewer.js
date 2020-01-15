import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
import ScreenshotViewer from './screenshotViewwer';
import {Accordion,AccordionTab} from 'primereact/accordion';

import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import JSONViewer from 'react-json-viewer';
import ReactJson from 'react-json-view'
import { Markup } from 'interweave';

import './../css/resultViewer.css'

function Transition(props) {
  return <Zoom direction="up" {...props} />;
}

const colGroup = <colgroup>
                    <col style={{width: '4%'}} />
                    <col style={{width: '12%'}} />
                    <col style={{width: '70%'}} />
                    <col style={{width: '5%'}} />
                    <col style={{width: '9%'}} />
                </colgroup>
const styles = theme => ({
  root: {
    width: "100%",
    colour: "white"
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: "50%",
    flexShrink: 0,
    color: "white"
    // backgroundColor: "red"
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary,
    color: "red"
    // backgroundColor: "red"
  },
  panelHeader: {
    backgroundColor: "#4286f4",
    color: "white",
    // height: "30px",
    hover: {
      backgroundColor: "green"
    }
  },
  icons: {
    color: "white"
  }
});

var panelList = [];

class ResultViewer extends React.Component {
  state = {
    open: false,
    screenShot: "",
    stepDetails:[],
    expandedPanelList:[],
  };

  removeArrayElement = (arr, value) =>{
    return arr.filter(function(ele){
        return ele != value;
    }); 
  }

  handleScreenshotViewerOpen = (stepNo) => {
    this.props.setScreenshotViewerOpenState(true, stepNo)
    
  };

  handleClose = () => {
    this.props.setViewerOpenState(false)
  };

  createStepRow = (step, withLink) => {
    return <tr key={step.stepDetails.stepNo} className='content'>
      <td style={{textAlign:'center'}}>{step.stepDetails.stepNo}</td>
      <td style={{textAlign:'center'}} className='justified'>{step.stepDetails.stepName}</td>
      <td className='justified' title = "XPATH ==> "><Markup content={step.stepDetails.stepDescription}/></td>
      {withLink ? <td style={{textAlign:'center', cursor:'pointer'}} className={step.stepDetails.stepStatus.toLowerCase()} onClick={()=>{this.handleScreenshotViewerOpen(step.stepDetails.stepNo-1)}}>{step.stepDetails.stepStatus}</td>
        : <td style={{textAlign:'center'}} className={step.stepDetails.stepStatus.toLowerCase()}>{step.stepDetails.stepStatus}</td>
      }
      <td style={{textAlign:'center'}}><small>{step.stepDetails.timeStamp}</small></td>
    </tr>
  }

  createBusKeyResultTable = (stepList) =>{
    var stepRowList = stepList.map((step, index) =>{
      return ( this.createStepRow(step, true)
      );
    });
    
    return <table id='main' style={{width:'100%'}}>{colGroup}<tbody>{stepRowList}</tbody></table>
  }

  handleChange = panel => (event, expanded) => {
    this.setState({
      expanded: expanded ? panel : false      
    });

    var newExpandedPanelList = this.state.expandedPanelList.slice()
    if (expanded){
      newExpandedPanelList.push(panel);
    }else{
      newExpandedPanelList = this.removeArrayElement(newExpandedPanelList, panel)
    }
    this.setState({expandedPanelList:newExpandedPanelList})
  };

  loadResultsTable = () => {
    panelList = []
    const { classes } = this.props;
    const { expandedPanelList } = this.state;
    var busKeywordAccords = []
    var results = this.props.state.selectedTestResult.results.results;
    if (results){
      var intCntr = 1
      for (const busKeyword of results.businessKeywordList){
        panelList.push(intCntr)
        busKeywordAccords.push(
        <ExpansionPanel
          key={intCntr}
          expanded={expandedPanelList.includes(intCntr)}
          onChange={this.handleChange(intCntr)}
        >
          <ExpansionPanelSummary
          className={classes.panelHeader}
          expandIcon={<ExpandMoreIcon className={classes.icons} />}
          >
            <Typography className={classes.heading}>
              {busKeyword.businessKeyword}
            </Typography>
            {this.get_test_step_fails(busKeyword.stepList) ? <Typography className={classes.secondaryHeading}>{this.get_test_step_fails(busKeyword.stepList)}</Typography> : <div></div> }
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {this.createBusKeyResultTable(busKeyword.stepList)}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        )
        intCntr+=1;       
      }
    }
    return <div className={classes.root}>{busKeywordAccords}</div>
  }

  get_test_step_fails = (stepList) =>{    
    var failStepCount = 0;
    for (const step of stepList){
      if(step.stepDetails.stepStatus.toUpperCase().includes("FAIL")){
        failStepCount += 1;
      }
    }
    if (failStepCount) return failStepCount
    else return false
  }

  expandPanels = () =>{
    this.setState({expandedPanelList: panelList})
  }

  collapsePanels = () =>{
    this.setState({expandedPanelList: []})
  }
  

  render() {
    return (
      <div>
        <Dialog
          open={this.props.state.openResultViewer}
          onClose={this.handleClose}
          fullWidth={true}
          maxWidth={false}          
          TransitionComponent={Transition}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title" >
            <div style={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
              <h4>Test Results</h4>
              <div>
                {this.props.state.selectedTestResult.hasOwnProperty("results")?<Button color="primary" onClick={this.expandPanels}>
                  Case Data
                </Button>: <div/>}
                <Button color="primary" onClick={this.expandPanels}>
                  Expand
                </Button>
                <Button color="primary" onClick={this.collapsePanels}>
                  Collapse
                </Button>
              </div>
            </div>
          </DialogTitle>
          {/* variant="outlined"  */}
          <DialogContent >
            {/* <JSONViewer
              json={{stepDetails: this.props.state}}
            /> */}
            {/* <ReactJson src={this.props.state.selectedTestResult} 
            name="Case Data"
            displayDataTypes={false}/> */}
            {this.loadResultsTable()}
            <ScreenshotViewer state={this.props.state} stepDetails={this.state.stepDetails} setScreenshotViewerOpenState={this.props.setScreenshotViewerOpenState} colGroup={this.colGroup} createStepRow={this.createStepRow} setCurrentScreenshotIndex={this.props.setCurrentScreenshotIndex}/>
          </DialogContent>

          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ResultViewer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(ResultViewer);
//{/* {(this.props.state.executionLogsData.selectedRows) ?  JSON.stringify(this.props.state.executionLogsData.selectedRows) : <div></div>} */}}