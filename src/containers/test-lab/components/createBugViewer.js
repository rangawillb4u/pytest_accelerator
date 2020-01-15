import React from 'react';
import ImageGallery from 'react-image-gallery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';
import CreatableMultiSelect from "./creatableMultiSelect"
import CreatableSingleSelect from "./creatableSingleSelect"
import {Fieldset} from 'primereact/fieldset';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import SingleSelect from './../../../MUIComponents/singleSelect.js'


function Transition(props) {
    return <Zoom direction="up" {...props} />;
}

export default class CreateBugViewer extends React.Component {
    constructor(props){
        super(props)
        this.state = {}
    }



    handleClose = () => {
        this.props.setCreateBugViewerState(false)   
      };
    
    openBugInJira = (jiraID) => {

        window.open('https://jira.customappsteam.co.uk/browse/' + jiraID, '_blank'); 
    }

    priorityMenuItems = () => {
        let priorityItems = ['Blocker', 'Critical', 'Major', 'High', 'Minor']
        let priorityOptions = [];    
        var cntr = 1;
        for (const priorityItem of priorityItems){
            priorityOptions.push(<MenuItem key={cntr} value={priorityItem}>{priorityItem}</MenuItem>);
        cntr += 1;
        }
    return priorityOptions;
    }

    onPrioritySelect = (e) => {
        e.preventDefault();
        this.props.setParentState("bugPriority", e.target.value)
    }

    createBugInJiraAPI=()=>{
        let bugDetails = {
            "bugSummary": this.props.state.bugSummary,
            "bugDescription": this.props.state.bugDescription,
            "bugPriority": this.props.state.bugPriority,
            "results": this.props.state.currentResult
        }
        fetch(this.props.state.apiServer + "/create_bug_in_jira", {
            mode: "cors", 
            method:"put", 
            body:JSON.stringify(bugDetails), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },})
        .then(response => {
            if (response.status===200){
                return response.json();
            }
        })
        .then((data) => 
        {this.props.alertPopup("success", "The bug : " + data.responseJson.key + " is created successfully.");   
        this.props.setParentState("createdBugID", data.responseJson.key)
        this.props.updateJiraReference(this.props.state.currentExecLogRowIndex, data.responseJson.key)
        this.openBugInJira(data.responseJson.key)
        document.getElementById("spinnerr").style.display = 'none'; })
        .catch((error) => this.props.handleError(error, "Create bug in jira"));

        this.handleClose()
    }

    triageSelectedRows = (e) => {        
        e.preventDefault(); 
        document.getElementById("spinnerr").style.display = 'block'; 
        this.updateDBExecutionLogsAPI(this.state.executionLogsData.selectedRows);
        
      }
    
    render() {
        return (
            <div>
                <Dialog
                open={this.props.state.openCreateBugViewer}
                onClose={this.handleClose}
                fullWidth={true}
                maxWidth={false}          
                TransitionComponent={Transition}
                aria-labelledby="form-dialog-title"
                >
                <DialogTitle id="form-dialog-title">
                    Create Bug
                </DialogTitle>
                {/* variant="outlined"  */}
                <DialogContent>                                 
                    <div className="form-layout">
                        <div className="wrapper-tp">
                            <div id="create-test-pack-form">
                                <div style={{marginLeft:"10px"}}>
                                    <div style={{marginLeft:"10px"}}>
                                        <TextField id="bug-summary" label="Summary" margin="normal" fullWidth required value={this.props.state.bugSummary} onChange={(e)=>{this.props.setParentState("bugSummary", e.target.value)}} />
                                        <TextField id="bug-description" label="Description" margin="normal" fullWidth required multiline value={this.props.state.bugDescription} onChange={(e)=>{this.props.setParentState("bugDescription", e.target.value)}} />
                                    </div>
                                    <SingleSelect
                                        value={this.props.state.bugPriority}
                                        onChange={this.onPrioritySelect}                          
                                        inputProps={{
                                        id: 'tp-test-data-file',
                                        }}
                                        menuItems={this.priorityMenuItems}
                                        label="Priority"
                                    />
                                </div>
                            </div>
                        </div>
                        {/* <p>{this.props.state.bugDescription}</p> */}
                    </div>
                </DialogContent>

                <DialogActions>
                    <Button onClick={this.createBugInJiraAPI} color="primary">
                    Create
                    </Button>
                    <Button onClick={this.handleClose} color="secondary">
                    Cancel
                    </Button>
                </DialogActions>
                </Dialog>
                
                
            </div>
        );
    }


}