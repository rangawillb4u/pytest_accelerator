import React, {Component} from "react";
import Alert from 'react-s-alert';

import TestSuiteManager from './components/testSuiteManager';
import TestSuiteViewer from './components/testSuiteViewer';
import TestDetailsViewer from './components/testDetailsViewer';
import CreateNewTest from './components/createNewTest';
import CreateNewTestPack from './components/createNewTestPack';
import Execution from './components/execution';
import ToolBar from './components/toolBar'

import './css/test-suite-viewer-styles';
import './css/test-lab.css';

class TestLab extends Component{
    constructor(props){
        super(props);
        this.state = {
            apiServer: "http://127.0.0.1:5000", //"http://18.202.150.250", //"http://52.214.112.189", //
            tests: {},  
            treeData: {name: 'Available Tests', toggled:true, children:[]},
            data:{name: 'Available Tests', toggled:true, children:[]},
            selectedTestDetails:{pageObjects:[]},
            selectedTestExecutionDetails:{},
            selectedTestDataFile:"",
            selectedTestDataDetails:{
                columns:[], 
                rows:[],
                selectedIndexes:[],
                filters: {}, 
                sortColumn: null, 
                sortDirection: null,
                emptyColumns:[],
                reorderedColumns:[]},
            selectedIndexes:[],
            filters: {}, 
            sortColumn: null, 
            sortDirection: null,
            cursor:{},
            loading:false,
            errorMessage:"",
            isVisible: true,
            testDetailsMessage:"Please select a test to view the details.",
            testSuiteViewerMessage:"Loading...",
            tagCombinations:"",
            executionInProgress: false,
            //testPack          
            selectedTestPack:{value:"", label:""},  
            testPackDetails: {testPackList:{}},
            existingTestPackList: [],
            selectedTestSuite:"",
            testPackOptions:[],

            viewerTitle:"List",
        };        
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

    updateTestDataAPI=()=>{
        // let TestDataFile = this.props.state.selectedTestDetails["props"].testDataFile;
        var TestDataFile = this.state.selectedTestDataFile;
        // var TestDataFile = "ranga_test_data.csv";
        fetch(this.state.apiServer + "/write_test_data_details/" + TestDataFile, {
            mode: "cors", 
            method:"put", 
            body:JSON.stringify(this.state.selectedTestDataDetails), 
            headers: {
              "Content-Type": "application/json; charset=utf-8",
            },})
        .then(response => {
            if (response.status===200){
                return response.json();
            }else if(response.status===555){
                this.setState({createTestSuiteMessaage: "Test-Suite name already exist. Please chose a different name"});
                throw new Error('Test-Suite name already exist.');
            } 
        })
        .then((data) => 
        {})
        .catch((error) => this.handleError(error, "Update Test data details"));
    }

    setStateFromChild = (stateItem, value) => {
        this.setState({[stateItem]: value});
    }
    
    setTestDataState = (item, value) => {
        let tdState = this.state.selectedTestDataDetails;
        tdState[item] = value;
        this.setState({selectedTestDataDetails: tdState});
    }

    
    
    loadData(data){
        this.setState({tests:data});        
        document.getElementById("spinnerr").style.display = 'none';
    }

    updateTestPackDetails = (data) => {
        this.setState({existingTestPackList:Object.keys(data.testPackList)});
        this.setState({selectedTestPack:{value: Object.keys(data.testPackList)[0], label:Object.keys(data.testPackList)[0]}});
        this.setState({testPackDetails:data});
        document.getElementById("spinnerr").style.display = 'none';
    }
    updateTestPackOptions = (data) => {
        var testPackOptions = [];
        for (const testPack of Object.keys(data.testPackList)){
            testPackOptions.push({value:testPack, label:testPack});
        }
        this.setState({testPackOptions});
        document.getElementById("spinnerr").style.display = 'none';
    }
    getTestPackDetailsAPI = () => {
        fetch(this.state.apiServer + "/get_test_pack_details", {mode: "cors"})
        .then(response => {
          if (response.ok){
            return response.json();
          }else{
              throw new Error('Something went wrong');
          } 
        })
        .then((data) => {
            this.updateTestPackDetails(data)
            this.updateTestPackOptions(data)
        })
        .catch((error) => this.handleError(error, "Get test pack details"));
        
        document.getElementById("spinnerr").style.display = 'block';
    }


    componentDidMount(){
        
        // document.getElementById("spinnerr").style.display = 'block';
        // fetch(this.state.apiServer + "/get_all_tests", {mode: "cors"})
        // .then(response => response.json())
        // .then((data) => this.loadData(data))        
        // .catch((error) => this.handleError(error, "Get all Tests"));

        console.log(JSON.stringify(this.state.tests));
        setInterval(() => {
            this.setState({ isVisible: !this.state.isVisible });
          }, 2000);
    }

    handleError = (error, APICall) => {
        let errorMessage = error.message;
        if( errorMessage.includes("Failed to fetch")) errorMessage = errorMessage + "! Please restart the API server!"
        errorMessage = "<b>API Call: </b> <i>" + APICall + "</i><br>" + errorMessage
        this.alertPopup("error", errorMessage)
        if (document.getElementById("spinnerr")) document.getElementById("spinnerr").style.display = 'none'; 
  
    }
    render(){
        const { isVisible, selectedTestPack } = this.state;
        return(
            <div>
                <aside className="sidebar">
                    <TestSuiteManager state={this.state} setParentState={this.setStateFromChild} alert={this.alertPopup} handleError={this.handleError} />
                    <div className="display-test-suite">
                        <TestSuiteViewer state={this.state}  setParentState={this.setStateFromChild} handleError={this.handleError} />
                    </div>
                </aside>
                <section className ="main">
                    <Alert stack={{limit: 3}} />
                    <ToolBar />
                    <Execution state={this.state} setParentState={this.setStateFromChild} handleError={this.handleError}/>
                    <div className="display-selected-test-details">
                        <TestDetailsViewer state={this.state} setParentState={this.setStateFromChild} setTestDataState ={this.setTestDataState} updateTestDataAPI={this.updateTestDataAPI} handleError={this.handleError}/>
                    </div>
                    <CreateNewTest state={this.state} setParentState={this.setStateFromChild} alert={this.alertPopup} selectedTestPack={selectedTestPack} getTestPackDetailsAPI={this.getTestPackDetailsAPI} handleError={this.handleError}/>   
                    <CreateNewTestPack state={this.state} setParentState={this.setStateFromChild} alert={this.alertPopup} getTestPackDetailsAPI={this.getTestPackDetailsAPI} handleError={this.handleError}/>           
                </section>
                
            </div>
            
        );
    }
}

export default TestLab;

//{this.state.loading ? document.getElementById('spinner').style.display='block' : document.getElementById('spinner').style.display='none'}

{/* <Container>
            <div>
                <div className="test-lab-container w3-card-4  w3-responsive "> 
                    <div className="test-suite-manager w3-card-4 w3-light-grey w3-responsive w3-round-large w3-animate-zoom">  
                        <TestSuiteManager state={this.state} setParentState={this.setStateFromChild} />
                    </div> 
                    <div id="execution-pan" className="execution-pan w3-card-4 w3-light-grey w3-responsive w3-round-large w3-animate-zoom">
                        <Execution state={this.state}  setParentState={this.setStateFromChild} />
                    </div>
                    
                    <div className="display-test-suite w3-card-4  w3-light-grey w3-responsive w3-round-large w3-animate-zoom"> 
                        <TestSuiteViewer state={this.state}  setParentState={this.setStateFromChild} />
                    </div>
                    <div className="display-selected-test-details w3-card-4 w3-container w3-light-grey w3-responsive w3-round-large w3-animate-zoom">                    
                        <TestDetailsViewer state={this.state}/>
                    </div>
                    
                    <div className= "console w3-card-4 w3-container w3-light-grey w3-responsive w3-round-large w3-animate-zoom">
                        
                    </div>
                    
                </div>
            </div>
            </Container> */}

{/* <div>
                <div id="left" className="column">
                    <div className="top-left">
                        <TestSuiteManager state={this.state} setParentState={this.setStateFromChild} />
                    </div>
                    <div className="bottom">                        
                        <TestSuiteViewer state={this.state}  setParentState={this.setStateFromChild} />
                    </div>
                </div>
                <div id="right" className="column">
                    <div className="top-right">                        
                        <Execution state={this.state}  setParentState={this.setStateFromChild} />
                    </div>
                    <div className="bottom">
                        <TestDetailsViewer state={this.state}/>
                    </div>
                </div>
            </div> */}


// <Box className="box" pose={isVisible ? 'visible' : 'hidden'} >
                                
//                                 <p>{this.state.errorMessage}</p>
//                                     </Box>


// <div>
//                             <pre style= {{width:"300px"}}>
//                                 {JSON.stringify(this.state.tests)}
//                             </pre>
//                         </div>
//                         <div>
//                             <pre style= {{width:"300px"}}>
//                                 {JSON.stringify(this.state.data)}
//                             </pre>
//                         </div>
//                         <div> 
//                             <pre style= {{width:"300px"}}>
//                                 {JSON.stringify(this.state.cursor)}
//                             </pre>
//                         </div>
//                         <div> 
                            
//                         </div>