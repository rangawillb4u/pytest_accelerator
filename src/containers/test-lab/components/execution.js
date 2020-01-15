import React, {Component} from "react";
import execJson from "./../../../configs/pyAX_current_execution.json";
import { Progress } from 'reactstrap';
import {ProgressBar} from 'react-bootstrap'
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

export default class Execution extends Component{
    constructor(props){
        super(props);
        this.state = {            
            executionStatus:{},
            pyAxExecutionStatus: {testSuiteDetails: {}},
            error:"",
            regressionCheckox: false
         }
    }

    handleRegressionCheckboxChange = name => event => {
        this.setState({ [name]: event.target.checked });
    };

    totalTestCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            count += Object.keys(tests).length;
        }
        // console.log(this.state.pyAxExecutionStatus);
        return count;
    }

    testExecutionCounter = () =>{
        var cntr = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase() === "NOT STARTED") cntr += 1;  
            }          
        }
        return this.totalTestCount() - cntr;
    }

    testPassedCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PASS")) count += 1;  
            }          
        }
        return count;
    }
    testFailedCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("FAIL")) count += 1;  
            }          
        }
        return count;
    }
    testInProgressCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")) count += 1;  
            }          
        }
        let percPerTest = 100 / this.totalTestCount();
        let totalIteration = this.testIterationCount();
        let keywordCountPerTest = this.totalTestKeywordsCount();
        let totalKeywordsForAllIter = totalIteration * keywordCountPerTest;
        let completedKewordCount = ((this.currentTestIterationCntr() - 1) * keywordCountPerTest) + this.keywordCompletedCount();        
        let inprogressCount = 0;
        if (totalKeywordsForAllIter !== 0) inprogressCount = completedKewordCount/totalKeywordsForAllIter        
        return inprogressCount;
    }
    testInProgressName = () =>{
        var inProgressTestName = "";
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")) inProgressTestName = testName;  
            }          
        }
        return inProgressTestName;
    }
    testIterationCount = () =>{
        var count = 1;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")) count = Object.keys(testDetails.iterationList).length;  
            }          
        }
        return count;
    }
    currentTestIterationCntr = () =>{
        var cntr = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")){
                    for (const iteration of testDetails.iterationList){
                        if (iteration.status.toUpperCase() === "NOT STARTED") cntr += 1;
                    }
                } 
            }          
        }
        return this.testIterationCount() - cntr;
    }
    currentTestKeywordName = () =>{
        var keywordName = "";
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")){
                    for (const pageObject of testDetails.pageObjects){
                        if (pageObject.status.toUpperCase().includes("PROGRESS")) keywordName = pageObject.text;
                    }
                } 
            }          
        }
        return keywordName;
    }
    iterationPassedCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")){
                    for (const iteration of testDetails.iterationList){
                        if (iteration.status.toUpperCase().includes("PASS")) count += 1;
                    }
                }
            }          
        }
        return count;
    }
    
    iterationFailedCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")){
                    for (const iteration of testDetails.iterationList){
                        if (iteration.status.toUpperCase().includes("FAIL")) count += 1;
                    }
                }
            }          
        }
        return count;
    }
    totalTestKeywordsCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")) count = Object.keys(testDetails.pageObjects).length;                
            }          
        }
        return count;
    }

    keywordCompletedCount = () =>{
        var count = 0;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")){
                    for (const po of testDetails.pageObjects){
                        if (po.status.toUpperCase().includes("COMPLETED")) count += 1;
                    }
                }
            }          
        }
        return count;
    }

    iterationInProgressCount = () =>{        
        // let percPerIteration = 100/this.testIterationCount();
        let totalTestKeywordsCount = this.totalTestKeywordsCount();
        // let notStartedKeywordCount = count;
        let completedKewordCount = this.keywordCompletedCount(); //totalTestKeywordsCount - notStartedKeywordCount;
        let inprogressCount = 0;
        if (totalTestKeywordsCount !== 0) inprogressCount = completedKewordCount/totalTestKeywordsCount        
        return inprogressCount;
    }
    testExecutionInprogress = () =>{
        var isExecuting = false;
        for (const [className, tests] of Object.entries(this.state.pyAxExecutionStatus["testSuiteDetails"])){
            for (const [testName, testDetails] of Object.entries(tests)){
                if (testDetails.status.toUpperCase().includes("PROGRESS")) isExecuting = true;
            }
        }
        return isExecuting;         
    }

    updatePyAxExecutionStatusAPI(){
        fetch(this.props.state.apiServer + "/get_pyax_execution_status", {
            mode: "cors", 
            method:"GET", headers: {
                "Content-Type": "application/json; charset=utf-8",
              },})
        .then(response => {
            if (response.ok){
                return response.json();
            }
        })
        .then((data) => this.updatePyAxExecutionStatus(data))
        .catch((error) => this.props.handleError(error, "Get pyAX execution status"));
    }

    handleError(error){
        this.setState({error:error});
        
    }
    
    updatePyAxExecutionStatus(data){
        this.setState({pyAxExecutionStatus:data});
        if (data.executionStatus.toUpperCase().includes("COMP")){
            this.props.setParentState("executionInProgress", false);
        }
        // console.log(data);
    }

    executeByTagAPI(tags){
        let payLoad = {}
        if (this.state.regressionCheckox){
            let executionID = new Date().toLocaleString();
            payLoad = {testSuiteDetails: this.props.state.tests, executionID: "pyAX_" + executionID}
        } else payLoad = {testSuiteDetails: this.props.state.tests}
        fetch(this.props.state.apiServer + "/execute_by_tag/" + tags, {
          mode: "cors",
          method:"PUT", 
          body:JSON.stringify(payLoad), 
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            // "Content-Type": "application/x-www-form-urlencoded",
          },})
        .then(response => {
            if (response.ok){
              return response.json();
            }
        })
        .then((data) => this.setState({executionStatus: data}))
        .catch((error) => console.log(error));
    }

    executeByTestIDAPI(){
        fetch(this.props.state.apiServer + "/execute_test_by_id", {
            mode: "cors",
            method:"PUT", 
            body:JSON.stringify(this.props.state.selectedTestExecutionDetails), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              // "Content-Type": "application/x-www-form-urlencoded",
            },})
          .then(response => {
              if (response.ok){
                return response.json();
              }
          })
          .then((data) => this.setState({executionStatus: data}))
          .catch((error) => console.log(error));
    }

    executeTestSuite = (e) =>{
        let tags = this.props.state.tagCombinations;
        this.executeByTagAPI(tags);
        this.props.state.executionInProgress = true;
    }
    executeSelectedTest = (e) =>{
        this.executeByTestIDAPI();
        this.props.state.executionInProgress = true;
    }
    abortExecutionAPI = () =>{
        fetch(this.props.state.apiServer + "/abort_current_execution", {
            mode: "cors"})
        .then(response => {
            if (response.ok){
                return response.json();
            }
        })
        .then((data) => {})
        .catch((error) => this.props.handleError(error, "Abort current execution"));
    }

    componentDidMount(){
        this.updatePyAxExecutionStatusAPI();
        
        setInterval(() => {
            if (this.props.state.executionInProgress){                
                this.updatePyAxExecutionStatusAPI();
            }
          }, 2000);
    }
    render(){
        return(
            <div>
                
                {!this.testExecutionInprogress() && (this.testExecutionCounter()===this.totalTestCount()) && (this.currentTestIterationCntr()===this.testIterationCount())?(
                    <div className="w3-margin">
                    <p>Last execution status:</p>
                </div>) :
                (<div className="w3-margin">
                    <p>Executing ({this.testExecutionCounter()}/{this.totalTestCount()}) test: {this.testInProgressName()}</p>
                </div>) }
                
                <div>
                {/* <ProgressBar style={{height:"20px"}} className=" w3-center w3-margin">
                    <ProgressBar   bsStyle="success" now={(this.testPassedCount()/this.totalTestCount())*100} label={this.testPassedCount()} key={1} />
                    <ProgressBar  bsStyle="danger" now={(this.testFailedCount()/this.totalTestCount())*100} label={this.testFailedCount()} key={2} />
                    <ProgressBar active bsStyle="warning" now={this.testInProgressCount() * (100 / this.totalTestCount())} label={`${Math.round(this.testInProgressCount()*100)}%`} key={3} />
                </ProgressBar> */}
                <Progress multi style={{height:"20px"}} className=" w3-center w3-margin">
                    <Progress bar color="success" value={(this.testPassedCount()/this.totalTestCount())*100}>{this.testPassedCount()}</Progress>
                    <Progress bar  color="danger" value={(this.testFailedCount()/this.totalTestCount())*100}>{this.testFailedCount()}</Progress>
                    <Progress bar  animated color="warning" value={this.testInProgressCount() * (100 / this.totalTestCount())}>{`${Math.round(this.testInProgressCount()*100)}%`}</Progress>
                </Progress>
                </div>
                {this.testExecutionInprogress() ?(
                <div className="w3-margin">
                    <p>Iteration ({this.currentTestIterationCntr()}/{this.testIterationCount()}) Keyword: {this.currentTestKeywordName()}</p>                
                    {/* <ProgressBar style={{height:"20px"}} className=" w3-center w3-margin">
                        <ProgressBar  striped bsStyle="success" now={(this.iterationPassedCount()/this.testIterationCount()) * 100} label={this.iterationPassedCount()} key={1} />
                        <ProgressBar  bsStyle="danger" now={(this.iterationFailedCount()/this.testIterationCount()) * 100} label={this.iterationFailedCount()} key={2} />
                        <ProgressBar active bsStyle="warning" now={this.iterationInProgressCount() * (100/this.testIterationCount())} label={`${Math.round(this.iterationInProgressCount() * 100)}%`} key={3} />
                    </ProgressBar> */}
                <Progress multi style={{height:"20px"}} className=" w3-center w3-margin">
                    <Progress bar color="success" value={(this.iterationPassedCount()/this.testIterationCount()) * 100}>{this.iterationPassedCount()}</Progress>
                    <Progress bar  color="danger" value={(this.iterationFailedCount()/this.testIterationCount()) * 100}>{this.iterationFailedCount()}</Progress>
                    <Progress bar  animated color="warning" value={this.iterationInProgressCount() * (100/this.testIterationCount())}>{`${Math.round(this.iterationInProgressCount() * 100)}%`}</Progress>
                </Progress>
                </div>
                ):(<div/>)}


                

                <div id="run-test-suite-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4">
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('run-test-suite-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Execute Test Suite</h2>
                        </header>
                        <div style={{display:'flex', flexDirection:'column'}}>
                        <label htmlFor="" className = "w3-padding w3-margin">Do you want to execute the entire Test-suite?</label>
                        <FormControlLabel className = " w3-margin-left"
                            control={
                                <Checkbox
                                checked={this.state.regressionCheckox}
                                onChange={this.handleRegressionCheckboxChange('regressionCheckox')}
                                value="regressionCheckox"
                                color="primary"
                                />
                            }
                            label="Daily execution"
                        />
                        </div>
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('run-test-suite-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">No</button>                          
                                <button onClick={(e)=>{this.executeTestSuite(e);document.getElementById('run-test-suite-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">Yes</button>
                            </div>
                        </footer>
                    </div>
                </div>
                <div id="run-test-id-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4">
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('run-test-id-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Execute Selected Test</h2>
                        </header>
                        <label htmlFor="" className = "w3-padding w3-margin">Do you want to execute the selected Test?</label>
                        
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('run-test-id-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">No</button>                          
                                <button onClick={(e)=>{this.executeSelectedTest(e);document.getElementById('run-test-id-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">Yes</button>
                            </div>
                        </footer>
                    </div>
                </div>

                <div id="abort-execution-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4">
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('abort-execution-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Abort Execution</h2>
                        </header>
                        <label htmlFor="" className = "w3-padding w3-margin">Do you want abort the current execution?</label>
                        
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('abort-execution-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">No</button>                          
                                <button onClick={(e)=>{this.abortExecutionAPI(e);document.getElementById('abort-execution-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">Yes</button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>            
        );
    }
}


                // <div>
                //     <pre style= {{width:"300px"}}>
                //         {JSON.stringify(this.props.state.cursor)}
                //     </pre>
                // </div>
//file:///C:/Users/rveluswamy/Documents/python/RBS_PythonTestAutomation/04_Results_Tier/BasicSmokeTest_01-Oct-2018_23-42-11/RBS-Test_Execution_Summary.HTML
//  <div className="w3-padding w3-center">
//                     <button id="execute-testSuite" className="w3-btn w3-round-large w3-dark-grey" style={{margin:"5px 10px 0px 0px"}} onClick={(e)=>{this.executeTestSuite(e)}}> Execute Test-Suite </button>
//                     <button id="execute-selected-test" className="w3-btn w3-round-large w3-dark-gray" style={{margin:"5px 0px 0px 10px"}} onClick={(e)=>{this.executeSelectedTest(e)}}> Execute Selected Test </button>
                    
//                 </div>

// `${Math.round(this.iterationPassedCount())}%`
// <div className="w3-margin">
//                     <div>
//                         <pre style= {{width:"300px"}}>
//                             {JSON.stringify(this.state.error)}
//                         </pre>
//                     </div>
//                     <div>    
//                         <pre style= {{width:"300px"}}>
//                             {JSON.stringify(this.state.pyAxExecutionStatus)}
//                         </pre>
//                     </div>
//                 </div>