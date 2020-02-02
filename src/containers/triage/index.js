import React, {Component} from "react";
import Alert from 'react-s-alert';
import PrimeDataTable from './../test-lab/components/primeDataGrid';
import ResultViewer from './../test-lab/components/resultViewer';
import CreateBugViewer from './../test-lab/components/createBugViewer';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import {Calendar} from 'primereact/calendar'
import {MultiSelect} from 'primereact/multiselect';
import {Button} from 'primereact/components/button/Button';

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
    root: {
      flexGrow: 1,
      // backgroundColor: theme.palette.background.paper,
        // color: green[600],
        // '&$checked': {
        //   color: green[500],
        // },
        checked: {},
    },
  });

const citySelectItems = [
    {label: 'New York', value: 'NY'},
    {label: 'Rome', value: 'RM'},
    {label: 'London', value: 'LDN'},
    {label: 'Istanbul', value: 'IST'},
    {label: 'Paris', value: 'PRS'}
];

function TabContainer(props) {
  return (
    <Typography component="div" style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
};


class Triage extends Component{
    constructor(props){
        super(props);
        this.state = {            
            apiServer: "http://deltas-api.azurewebsites.net",//"http://18.202.150.250", //"http://127.0.0.1:5000", //
            executionLogsData:{
                columns:[], 
                rows:[],
                selectedRows: [],
                rowSelected: false,
                selectedIndexes:[],
                filters: {}, 
                sortColumn: null, 
                sortDirection: null,
                emptyColumns:[],
                reorderedColumns:[],
                executionID:[],
            },
            triageData:{
                columns:[], 
                rows:[],
                triagedRows: [],
                selectedIndexes:[],
                filters: {}, 
                sortColumn: null, 
                sortDirection: null,
                emptyColumns:[],
                reorderedColumns:[],
            },
            value: 0,
            checked: true,
            cities: [],
            openResultViewer: false,
            openScreenshotViewer: false,
            openCreateBugViewer: false,
            bugSummary:"Enter bug summary",
            bugDescription:"Enter bug description",
            bugPriority: "Minor",
            createdBugID: "",
            currentResult:{},
            currentExecLogRowIndex:0,
            selectedTestResult: {results:{}},
            stepImageDetails:[],
            screenshotStartIndex:0,
            dateRange:"",
            displayApplyFilter:'none',
            executionIDList:[],
            selectedEdecutionIDs:["ALL"]
        }
    }


    updateJiraReference = (currentExecLogRowIndex, jiraID) => {
        let newExecutionLogsData = {}
        const returnedTarget = Object.assign(newExecutionLogsData, this.state.executionLogsData);
        newExecutionLogsData.rows[currentExecLogRowIndex].jira_reference = jiraID
        this.setState({executionLogsData:newExecutionLogsData})
    }

    setStateFromChild = (stateItem, value) => {
        this.setState({[stateItem]: value});
    }

    setViewerOpenState = (value) => {
        this.setState({openResultViewer:value});
    }

    setCreateBugViewerState = (value) => {
        this.setState({openCreateBugViewer:value});
    }

    setScreenshotViewerOpenState = (value, stepNo) => {
        this.setState({openScreenshotViewer:value});
        this.setCurrentScreenshotIndex(stepNo)
    }

    setCurrentScreenshotIndex = (currentIndex) =>{
        this.setState({screenshotStartIndex:currentIndex})        
    }

    setSelectedTestResult = (selectedTestResult) => {
        this.setState({selectedTestResult});
    }

    handleChange = (event, value) => {
        this.setState({ value });
      };

    setExecutionLogsState = (item, value) => {
        let tdState = this.state.executionLogsData;
        tdState[item] = value;
        this.setState({executionLogsData: tdState});
    }

    setTriageDataState = (item, value) => {
        let tdState = this.state.triageData;
        tdState[item] = value;
        this.setState({triageData: tdState});
    }

    updateExecutionIDList(executionLogsData){
        console.log(executionLogsData)
        var execIDList = []
        for (const execID of executionLogsData.executionIDs){
            execIDList.push({label: execID, value: execID})
        }
        this.setState({executionIDList:execIDList})
    }

    todayDate = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth()+1;
        var yyyy = today.getFullYear();
        if(dd<10) dd = '0'+dd
        if(mm<10) mm = '0'+mm
        today = dd + '/' + mm + '/' + yyyy;
        return today;
    }

    refreshExecutionLogsData = () =>{    
        document.getElementById("spinnerr").style.display = 'block'; 
        this.loadDBExecutionLogsAPI(["ALL"]);
    }
    downloadScreenshotAPI=(stepNo, stepID, s3Key)=>{
        fetch(this.state.apiServer + "/get_screenshot_by_key", {
          mode: "cors", 
          method:"put", 
          body:JSON.stringify({key:s3Key}), 
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },})
        .then(response => {
            if (response.status===200){
              return response.blob();
            } 
        })
        .then((data) => {
            var imgUrl = data && URL.createObjectURL(data);
            var newStep = {stepNo:stepNo, stepID:stepID, imgUrl:imgUrl}
            this.setState({stepImageDetails: [...this.state.stepImageDetails, newStep]})        
            this.alertPop("info", "Screenshot is loaded")
        })        
        .catch((error) => console.log(error, "screenshot not loaded"));
      } 

    loadImageList = (results) => {
        this.setState({stepImageDetails:[]})
        var screenShotList = []
        if (results){
        //   console.log(this.props.state.selectedTestResult)
        //   const {results} = this.props.state.selectedTestResult.results;
          for (const busKeyword of results.businessKeywordList){
            var stepEntries = busKeyword.stepList.map((step, index) => {
              this.downloadScreenshotAPI(step.stepDetails.stepNo, step.stepID, step.stepDetails.screenshotFileName)
              return (
                <div>                    
                    <li key={step.stepDetails.screenshotFileName}><button onClick={()=>{this.downloadScreenshotAPI(step.stepID, step.stepDetails.screenshotFileName)}}>{step.stepID}</button></li>
                    <li key={step.stepDetails.screenshotFileName}><button onClick={()=>{this.downloadScreenshotAPI(step.stepID, step.stepDetails.screenshotFileName)}}>{step.stepID}</button></li>
                </div>
              );
            });
            screenShotList = screenShotList.concat(stepEntries)
            // for (const [stepName, stepDetails] of Object.entries(busKeywordDetails.stepList)){
            //   console.log(stepDetails.screenshotFileName)
            //   screenShotList.appendChild
            // }
          }
        }
        return <ul style={{textAlign: 'left', margin: 0}}>{screenShotList}</ul>
      }

    loadDBExecutionLogsAPI=(execID, loadExecIds)=>{
        let executionFilter = {
            dateRange: this.state.dateRange,
            execID:execID
        }
        console.log(JSON.stringify(executionFilter))
        fetch(this.state.apiServer + "/get_db_execution_logs", {
            mode: "cors", 
            method:"put", 
            body:JSON.stringify(executionFilter), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },})
        .then(response => {
            if (response.status===200){
              return response.json();
            } else if (response.status===555){
                this.handleError("DB connection failed", "Get DB Execution logs");
                return response.json();
              } 
        })
        .then((data) => {
        this.setState({executionLogsData:data});               
        document.getElementById("spinnerr").style.display = 'none'; 
        if (loadExecIds) this.updateExecutionIDList(data);
        this.alertPopup("info", "Execution log is loaded")})        
        .catch((error) => this.handleError(error, "Get DB Execution logs"));
    }

    loadDBTriageDataAPI=()=>{
        fetch(this.state.apiServer + "/get_db_triage_data" , {
          mode: "cors", })
        .then(response => {
            if (response.status===200){
              return response.json();
            } else if (response.status===555){
                this.handleError("DB connection failed", "Get DB Triage data");
                return response.json();
              } 
        })
        .then((data) => {
        this.setState({triageData:data});               
        document.getElementById("spinnerr").style.display = 'none'; 
        this.alertPopup("info", " Triage data is loaded")})        
        .catch((error) => this.handleError(error, "Get DB Triage data"));
    }

    updateDBExecutionLogsAPI=(selectedRows)=>{
        fetch(this.state.apiServer + "/update_db_triage_execution_logs", {
            mode: "cors", 
            method:"put", 
            body:JSON.stringify(selectedRows), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },})
        .then(response => {
            if (response.status===200){
                return response.json();
            }else if(response.status===555){
                throw new Error('Error while triaging');
            } 
        })
        .then((data) => 
        {this.alertPopup("success", "The selected rows are triaged");    
        document.getElementById("spinnerr").style.display = 'none'; })
        .catch((error) => this.handleError(error, "Update Execution logs"));
    }


    updateDBTriageAPI=(selectedRows)=>{
        fetch(this.state.apiServer + "/update_db_triage", {
            mode: "cors", 
            method:"put", 
            body:JSON.stringify(selectedRows), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },})
        .then(response => {
            if (response.status===200){
                return response.json();
            }else if(response.status===555){
                throw new Error('Error while triaging');
            } 
        })
        .then((data) => 
        {this.alertPopup("success", "The selected rows are dev triaged");    
        document.getElementById("spinnerr").style.display = 'none'; })
        .catch((error) => this.handleError(error, "Update Traige table"));
    }


    triageSelectedRows = (e) => {        
        e.preventDefault(); 
        document.getElementById("spinnerr").style.display = 'block'; 
        this.updateDBExecutionLogsAPI(this.state.executionLogsData.selectedRows);
        
      }
    
    triageSelectedRowsTriageTable = (e) => {        
        e.preventDefault(); 
        document.getElementById("spinnerr").style.display = 'block'; 
        this.updateDBTriageAPI(this.state.triageData.selectedRows);
    
    }

    handleError = (error, APICall) => {
        let errorMessage = error.message;
        try{
            if( errorMessage.includes("Failed to fetch")) errorMessage = errorMessage + "! Please restart the API server!"
        }
        catch(err){
            errorMessage = error.message;
        }
        errorMessage = "<b>API Call: </b> <i>" + APICall + "</i><br>" + errorMessage
        this.alertPopup("error", errorMessage)
        document.getElementById("spinnerr").style.display = 'none'; 
  
    }
    alertPopup = (msgType, msg) =>{
        switch(msgType.toUpperCase()){
            case "SUCCESS":
                Alert.success(msg, {
                    position: 'bottom-right',
                    effect: 'genie'
                });
                break;
            case "ERROR":
                Alert.error(msg, {
                    position: 'bottom-right',
                    effect: 'genie',
                    html: true
                });
                break;
            case "INFO":
                Alert.info(msg, {
                    position: 'bottom-right',
                    effect: 'genie'
                });
                break;
            case "WARNING":
                Alert.warning(msg, {
                    position: 'bottom-right',
                    effect: 'genie'
                });
                break;
        }
        
    }

    handleCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
        if(!event.target.checked) this.loadDBExecutionLogsAPI("all")
        else this.loadDBExecutionLogsAPI("today")
      };
    applyDateFilter = () =>{
        document.getElementById("apply-filter-date").style.display = 'none'   
        document.getElementById("spinnerr").style.display = 'block';      
        this.loadDBExecutionLogsAPI(["ALL"], true)
    }

    applyExecIDFilter = () =>{
        document.getElementById("apply-filter-execID").style.display = 'none'   
        document.getElementById("spinnerr").style.display = 'block';  
        this.loadDBExecutionLogsAPI(this.state.selectedEdecutionIDs)    
    }

    onCityChange = (e) => {
        let selectedCities = [...this.state.cities];
        
        if(e.checked)
            selectedCities.push(e.value);
        else
            selectedCities.splice(selectedCities.indexOf(e.value), 1);

        this.setState({cities: selectedCities});
    }
    
    dateSelected = (value) =>{
        // let newDate = new Date(value + 60*60000)
        this.setState({dateRange: value})
        document.getElementById("apply-filter-date").style.display = 'block'
        console.log(value)
    }

    executionIDSelected = (value) =>{
        this.setState({selectedEdecutionIDs: value})
        document.getElementById("apply-filter-execID").style.display = 'block'
        console.log(value)
    }

    componentDidMount(){
        this.loadDBExecutionLogsAPI(["ALL"], true);
        this.loadDBTriageDataAPI();
    }

    render(){
        const {value} = this.state;
        const { classes } = this.props;
        return(
            <div style={{top:"0px"}}>
            <Alert stack={{limit: 3}} />
            
                    <Paper square>
                        <Tabs
                        value={this.state.value}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={this.handleChange}
                        centered
                        >
                        <Tab label="Execution Logs" />
                        <Tab label="Triage" />
                        </Tabs>
                    </Paper>  
                <section className ="main-triage">
                    {value === 0 && <TabContainer>
                        <div style={{display:"flex", flexDirection:"column"}}>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                {/* <div style={{width:'250px',marginBottom:'10px'}}>                                    
                                    <Checkbox inputId="today" value="Today" onChange={this.handleCheckboxChange('checked')} checked={this.state.checked}></Checkbox>
                                    <label htmlFor="today" className="p-checkbox-label">Today</label>
                                </div> */}
                                <div className="content-section implementation" style={{display:"flex",flexDirection:"row", width:'450px',marginBottom:'10px'}}>
                                    <label htmlFor="today" className="p-checkbox-label" style={{padding:"10px"}}>Select date range: </label>
                                    <Calendar inputStyle={{width:'200px'}} dateFormat="dd/mm/yy" value={this.state.dateRange} 
                                    onChange={(e) => this.dateSelected(e.value)} 
                                    // onViewChange={(e,value)=> this.dateSelected(value)}
                                    onViewChange={(e)=> this.dateSelected(e.value)}
                                    selectionMode="range" readonlyInput={true} showButtonBar={true} maxDate={new Date()}  showIcon={true} placeholder={this.todayDate()}/>
                                    <Button id="apply-filter-date" icon="pi pi-filter" onClick={(e)=>{this.applyDateFilter(e)}} style={{marginLeft:"50px", display:'none', height:"30px"}} ></Button>
                                </div>
                                <div style={{display:"flex",flexDirection:"row"}}>
                                    <label htmlFor="executionId" className="p-checkbox-label" style={{padding:"10px"}}>Select execution ID: </label>
                                    <MultiSelect value={this.state.selectedEdecutionIDs} options={this.state.executionIDList} onChange={(e) => this.executionIDSelected(e.value)} 
                                    style={{minWidth:'17em', height:"30px"}} filter={true} placeholder="Choose"/>
                                    <Button id="apply-filter-execID" icon="pi pi-filter" onClick={(e)=>{this.applyExecIDFilter(e)}} style={{marginLeft:"50px", display:'none', height:"30px"}} ></Button>
                                </div>
                            </div>
                            <PrimeDataTable state={this.state.executionLogsData} setRowDataState ={this.setExecutionLogsState} showTriageButton={true} triageSelectedRows={this.triageSelectedRows} refreshData={this.refreshExecutionLogsData} alert={this.alertPopup} setViewerOpenState={this.setViewerOpenState} setSelectedTestResult={this.setSelectedTestResult} loadImageList={this.loadImageList} setCreateBugViewerState={this.setCreateBugViewerState} setParentState={this.setStateFromChild}/>
                        </div>
                        
                        </TabContainer>}
                    {value === 1 && <TabContainer>
                        <PrimeDataTable state={this.state.triageData} setRowDataState ={this.setTriageDataState} triageSelectedRows={this.triageSelectedRowsTriageTable}   refreshData={this.loadDBTriageDataAPI} alert={this.alertPopup} setViewerOpenState={this.setViewerOpenState}  setSelectedTestResult={this.setSelectedTestResult} loadImageList={this.loadImageList} setParentState={this.setStateFromChild}/>
                        </TabContainer>}
                    {value === 2 && <TabContainer>Item Three</TabContainer>}
                    

                    {/* <div> 
                        <pre style= {{width:"1300px"}}>
                            {(this.state.executionLogsData.selectedRows) ?  JSON.stringify(this.state.executionLogsData.selectedRows) : <div></div>}
                        </pre>
                    </div> */}
                    <ResultViewer state={this.state} setViewerOpenState={this.setViewerOpenState} setScreenshotViewerOpenState={this.setScreenshotViewerOpenState} setCurrentScreenshotIndex={this.setCurrentScreenshotIndex}/>
                    <CreateBugViewer state={this.state} setCreateBugViewerState={this.setCreateBugViewerState} setParentState={this.setStateFromChild} alertPopup={this.alertPopup} handleError={this.handleError} setParentState={this.setStateFromChild} updateJiraReference={this.updateJiraReference}/>
                </section>
            </div>
        
        )
    }
}



Triage.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(Triage)
