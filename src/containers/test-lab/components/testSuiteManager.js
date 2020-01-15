import React, {Component,Fragment} from "react";
import posed, { PoseGroup } from "react-pose";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import './../css/suite-manager.css';
import RefreshSharp from '@material-ui/icons/RefreshSharp';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import SingleSelect from './../../../MUIComponents/singleSelect.js'

const Content = posed.div({
  closed: { height: 0 },
  open: { height: 'auto' }
});

export default class TestSuiteManager extends Component{
  constructor(props){
      super(props);
      this.state = {
          data: [],
          eOpen: true,            
          nOpen: false,
          loading:false,
          createTestSuiteMessaage:"",
          testSuiteListDetails: {},
          availableTags:[],
      }
  }

  updateTestSuiteListBox = () => {
    let optionsTestSuiteNames = [];
    var cntr = 1;
    for (const testSuiteName of Object.keys(this.state.testSuiteListDetails)){
      // optionsTestSuiteNames.push(<option key={cntr} value={testSuiteName}>{testSuiteName}</option>);
      optionsTestSuiteNames.push(<MenuItem key={cntr} value={testSuiteName}>{testSuiteName}</MenuItem>);
      cntr += 1;
    }
      return optionsTestSuiteNames;
  }

  updateTestPackListBox = () => {
    let optionsTestPackNames = [];
    // optionsTestPackNames.push(<MenuItem  value=""><em>None</em></MenuItem>);
    var cntr = 1;
    for (const testPackName of this.props.state.existingTestPackList){
      // optionsTestPackNames.push(<option key={cntr} value={testPackName}>{testPackName}</option>);
      optionsTestPackNames.push(<MenuItem key={cntr} value={testPackName}>{testPackName}</MenuItem>);
      cntr += 1;
    }
      return optionsTestPackNames;
  }

  updateTagsListBox = () => {
    let optionsTags = [];
    var cntr = 1;
    for (const tag of this.state.availableTags){
      optionsTags.push(<option key={cntr} value={tag}>{tag}</option>);
      cntr += 1;
    }
      return optionsTags;
  }

  updateTestSuiteAPI(){
    let newTestSuiteName = document.getElementById("test-suite-name").value;
    let testSuiteDetails = {
      testSuiteName: newTestSuiteName,
      tags: document.getElementById("tags").value,
    }
    fetch(this.props.state.apiServer + "/create_test_suite", {
      mode: "cors", 
      method:"post", 
      body:JSON.stringify(testSuiteDetails), 
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        // "Content-Type": "application/x-www-form-urlencoded",
      },})
    .then(response => {
        if (response.status===200){
          //this.updateTestSuiteList(response.json());
          // this.getAllTestSuitesAPI();
          document.getElementById("spinnerr").style.display = 'none';
          this.props.alert("success", "The test suite is created successfully!");
          return response.json();
        }else if(response.status===555){
          this.setState({createTestSuiteMessaage: "Test-Suite name already exist. Please chose a different name"});
          throw new Error('Test-Suite name already exist.');
        } 
               
        
    })
    .then((data) => {
      this.updateTestSuiteList(data);
    })
    .catch((error) => this.props.handleError(error, "Create Test-suite"));
  }

  getAllTestSuitesAPI(){
    fetch(this.props.state.apiServer + "/get_all_test_suites", {
      mode: "cors"})
    .then(response => {
        if (response.ok){
          return response.json();
        }
    })
    .then((data) => this.updateTestSuiteList(data))
    .catch((error) => this.props.handleError(error, "Get all Test-suites"));
  }
  
  getAllTagsAPI(){
    document.getElementById("spinnerr").style.display = 'block';
    fetch(this.props.state.apiServer + "/get_all_tags", {
      mode: "cors"})
    .then(response => {
        if (response.ok){
          return response.json();
        }
    })
    .then((data) => this.updateTagsList(data))
    .catch((error) => this.props.handleError(error, "Get all Tags"));
  }

  loadRetrivedTests(data){
    this.props.setParentState("tests", data);
    var treeData = {name: 'Available Tests', toggled:true, children:[]};
    var classGroupData = [];
    for (const [className, tests] of Object.entries(this.props.state.tests)){
        var classData = {};
        var children = [];
        classData['name'] = className;
        classData['toggled'] = true;
        for (const testName of Object.keys(tests)){
            children.push({name: testName});
        }
        classData['children'] = children;
        classGroupData.push(classData);
    }
    treeData['children'] = classGroupData;
    console.log(JSON.stringify(treeData));
    
    // var tagCombinations = document.getElementById("tags").value;
    // if (tagCombinations==="") tagCombinations="ALL";        
    if (Object.keys(this.props.state.tests).length > 0){
      this.props.setParentState("testSuiteViewerMessage", "Test-suite view for the Tag(s): ");
    }else{        
      this.props.setParentState("testSuiteViewerMessage", "No tests available for the selected Tag(s): ");
    }
    this.props.setParentState("treeData", treeData);
    this.props.setParentState("data", treeData);
    this.props.setParentState("cursor", {});
    this.setState({loading:false});    
    this.props.setParentState("loading", false);
    this.props.alert("info", "Tests are loaded successfully!")
    document.getElementById("spinnerr").style.display = 'none';
  }

    onLoadTestSuiteButtonClick = (e) =>{
      e.preventDefault();
      let tagCombinations = document.getElementById("tags").value;
      this.loadTestsForTestSuite(tagCombinations);
    }

    onTestSuiteSelect = (e) => {
      e.preventDefault();
      let selectedTestSuiteName = e.target.value;
      this.props.setParentState("selectedTestSuite", selectedTestSuiteName);
      let tagCombinations = this.state.testSuiteListDetails[selectedTestSuiteName].tags;
      this.loadTestsForTestSuite(tagCombinations);      
    }

    onTestSuiteRefresh = (e) => {
      e.preventDefault();
      let selectedTestSuiteName = document.getElementById("selected-test-suite").value;
      let tagCombinations = this.state.testSuiteListDetails[selectedTestSuiteName].tags;
      this.loadTestsForTestSuite(tagCombinations);      
    }

    loadTestsForTestSuite = (tagCombinations) => {
      if (tagCombinations==="") tagCombinations="All Tests";
      this.props.setParentState("tagCombinations", tagCombinations);
      this.props.setParentState("loading", true);     
      document.getElementById("spinnerr").style.display = 'block';
      this.getTestsByTagsAPI(tagCombinations);
    }

    loadTestForTestPack = (testPackName) => {
      if (document.getElementById("selected-test-pack")){
        if (testPackName === undefined) testPackName = document.getElementById("selected-test-pack").value;
        console.log("testPackName ==> " + testPackName)
        this.props.setParentState("loading", true);     
        document.getElementById("spinnerr").style.display = 'block';
        this.getTestsByTestPackAPI(testPackName);  
      }
    }
    onTestPackSelect = (e) => {     
      e.preventDefault();
      this.setState({ [e.target.name]: e.target.value });
      this.props.setParentState("selectedTestPack", {value:e.target.value, label:e.target.value});
      this.loadTestForTestPack(e.target.value)
    }
    onTestPackRefresh = (e) => {      
      e.preventDefault();
      let testPackName = document.getElementById("selected-test-pack").value;
      this.loadTestForTestPack(testPackName)
    }
    getTestsByTestPackAPI(testPackName){
      if (testPackName){
        fetch(this.props.state.apiServer + "/get_tests_by_testpack/"+testPackName, {mode: "cors"})
        .then(response => {
          if (response.ok){
            return response.json();
          }else{
              throw new Error('Something went wrong');
          } 
        })
        .then((data) => this.loadRetrivedTests(data))
        .catch((error) => this.props.handleError(error, "Get tests by Test-pack"));
        
        document.getElementById("spinnerr").style.display = 'block';
      }
    }

    getTestsByTagsAPI(tagCombinations){
      fetch(this.props.state.apiServer + "/get_tests_by_tags/"+tagCombinations, {mode: "cors"})
      .then(response => {
        if (response.ok){
          return response.json();
        }else{
            throw new Error('Something went wrong');
        } 
      })
      .then((data) => this.loadRetrivedTests(data))
      .catch((error) => this.props.handleError(error, "Get tests by Tags"));
      
      document.getElementById("spinnerr").style.display = 'block';
      
      //this.props.setParentState("loading", true);
      // this.setState({loading:true});
    }

    handleError(error){
      this.props.setParentState("loading", false);
      // this.setState({loading:false});
      this.setState({errorMessage:error.errorMessage + " API Server not up"});

    }

    updateTestSuiteList(data){
      this.setState({testSuiteListDetails:data});
      this.props.setParentState("selectedTestSuite", Object.keys(this.state.testSuiteListDetails)[0]);
      if (document.getElementById("selected-test-suite")){
        let selectedTestSuiteName = document.getElementById("selected-test-suite").value;
        let tagCombinations = this.state.testSuiteListDetails[selectedTestSuiteName].tags;    
        if (tagCombinations==="") tagCombinations="All Tests";
        this.props.setParentState("tagCombinations", tagCombinations);
        this.getTestsByTagsAPI(tagCombinations);     
        document.getElementById('id01').style.display='none';              
        document.getElementById("spinnerr").style.display = 'none'; 
      }       
    }
    updateTagsList(data){
      this.setState({availableTags:data});
      document.getElementById("spinnerr").style.display = 'none';      
      this.loadTestForTestPack();
    }

    addTag(e) {    
      e.preventDefault();  
      var tagCombinations = document.getElementById("tags").value;
      var selectedTag = document.getElementById("tagsList").value;
      document.getElementById("tags").value = tagCombinations + " " + selectedTag;
    }
    addOr(e) {    
      e.preventDefault();  
      var tagCombinations = document.getElementById("tags").value;
      document.getElementById("tags").value = tagCombinations + " or";
    }
    
    addAnd(e) {    
      e.preventDefault();  
      var tagCombinations = document.getElementById("tags").value;
      document.getElementById("tags").value = tagCombinations + " and";
    }
    
    clearTags(e) {    
      e.preventDefault();  
      document.getElementById("tags").value = "";
    }
    enterSuiteName(e){
      e.preventDefault();  
      document.getElementById('id01').style.display='block';      
      this.setState({createTestSuiteMessaage: ""});
    }
    createTestSuite(e){
      e.preventDefault(); 
      var testSuitename = document.getElementById("test-suite-name").value;
      if (testSuitename === "") {
        this.setState({createTestSuiteMessaage: "Please enter the test suite name."});
        return
      }else{
        this.setState({createTestSuiteMessaage: "Creating Test-Suite"});        
        document.getElementById("spinnerr").style.display = 'block';
        this.updateTestSuiteAPI();
      }

      // document.getElementById('id01').style.display='none';
    }
    
    sleep = (time) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    }

    componentDidMount(){      
      document.getElementById("spinnerr").style.display = 'block';
      this.getAllTestSuitesAPI();
      this.getAllTagsAPI();
      
      // Usage!
      this.sleep(1000).then(() => {
        this.loadTestForTestPack();
      })
      // this.onTestPackSelect();
      // let tagCombinations = "regression_test";
      // this.getTestsByTagsAPI(tagCombinations);
    }


    render(){
      const { classes } = this.props;
      const { eOpen, nOpen } = this.state;
        return (
          <div>
            <Tabs>
              <TabList>
                <Tab>Test-Pack</Tab>
                <Tab>Test-Suite</Tab>
              </TabList>
              <TabPanel>
                <Tabs>
                <TabList>
                  <Tab>Available</Tab>
                </TabList>

                <TabPanel>     
                  <div style={{display:"flex", flexDirection:"row"}}>              
                    <SingleSelect
                      state={this.props.state}
                      value={this.props.state.selectedTestPack.value}
                      onChange={this.onTestPackSelect}                          
                      inputProps={{
                        name: 'selectedTestPack',
                        id: 'selected-test-pack',
                      }}
                      menuItems={this.updateTestPackListBox}
                      label="Test Pack"
                    />
                    <IconButton aria-label="RefreshSharp" colour="primary" style={{marginTop:"17px"}} onClick={(e)=>{this.onTestPackRefresh(e)}}>
                      <RefreshSharp fontSize="small" />
                    </IconButton>
                  </div>   
                      {/* <a href="#" style={{marginLeft:"10px"}}>
                        <span  class=" icon glyphicon glyphicon-refresh" onClick={(e)=>{this.onTestPackSelect(e)}}></span>
                      </a>                     */}
                   
                </TabPanel>
                </Tabs>
                
        </TabPanel>
        
              <TabPanel>
                <Tabs>
                  <TabList>
                    <Tab>Available</Tab>
                    <Tab>Build-new</Tab>
                  </TabList>
                  <TabPanel>
                    <div style={{display:"flex", flexDirection:"row"}}> 
                      <SingleSelect
                        value={this.props.state.selectedTestSuite}
                        onChange={this.onTestSuiteSelect}                          
                        inputProps={{
                          name: 'selectedTestSuite',
                          id: 'selected-test-suite',
                        }}
                        menuItems={this.updateTestSuiteListBox}
                        label="Test Suite"
                      />
                      <IconButton aria-label="RefreshSharp" colour="primary" style={{marginTop:"17px"}} onClick={(e)=>{this.onTestSuiteRefresh(e)}}>
                        <RefreshSharp fontSize="small" />
                      </IconButton>
                    </div>
                  </TabPanel>
                  <TabPanel>
                    <Content className="content" pose={eOpen === true ? 'open' : 'closed'}>
                      <div style={{display:"flex", flexFlow: "column"}}>
                        <form className="content-wrapper w3-animate-zoom" style={{display:"flex", flexFlow: "column"}}>                    
                          <div style={{display:"flex", "flexflow": "column"}}>
                            <div style={{padding:"0px 0px 0px 15px"}}>                      
                              <label htmlFor="tagsList">Available tags: </label>
                              <div style={{display:"flex", flexFlow: "row"}}>
                                <div>
                                  <select id="tagsList" name="tagsList" size="7" onClick={(e)=>{this.addTag(e)}}>
                                    {this.updateTagsListBox()}
                                  </select> 
                                </div>                                               
                                <div style={{padding:"10px", display:"flex", flexFlow: "column"}}>                      
                                  <button className="w3-btn w3-round-large " onClick={(e)=>{this.addOr(e)}}> Or </button>
                                  <button className="w3-btn w3-round-large " onClick={(e)=>{this.addAnd(e)}}> And </button>
                                  <button className="w3-btn w3-round-large " onClick={(e)=>{this.clearTags(e)}}> Clear </button>
                                </div>
                              </div>
                              
                            </div>
                          </div>
                          <div style={{margin:"20px 0px 0px 10px"}}>                        
                            <label htmlFor="tags">Tag combination: </label>
                            <textarea id="tags" name="tags" style={{width:"360px", height:"100px"}} />
                            <div className="content-wrapper">
                              <button id="build-TS-load-testSuite" className="w3-btn w3-round-large w3-dark-grey" style={{margin:"5px 10px 0px 0px"}} onClick={(e)=>{this.onLoadTestSuiteButtonClick(e)}}> Load Test-Suite </button>
                              <button onClick={(e)=>{this.enterSuiteName(e)}}  className="w3-btn w3-round-large w3-dark-grey" style={{margin:"5px 0px 0px 5px"}}>Create Test-Suite</button>
                            </div>
                          </div>
                          <div id="id01" className="w3-modal">
                            <div className="w3-modal-content w3-animate-zoom w3-card-4">
                              <header className="w3-container w3-dark-grey"> 
                                <span onClick={(e)=>{document.getElementById('id01').style.display='none';}}
                                className="w3-button w3-display-topright">&times;</span>
                                <h2>Enter Test-Suite Name</h2>
                              </header>
                              <div className="w3-container">
                              <label><b>Test-suite name:</b></label>
                              <input id="test-suite-name" className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Test-Suite Name" name="testSuiteName" required/>
                              </div>
                              <footer className="w3-container w3-dark-grey w3-padding">
                                <button onClick={(e)=>{document.getElementById('id01').style.display='none';}} type="button" className="w3-button w3-dark-grey">Cancel</button>
                                
                                <button onClick={(e)=>{document.getElementById('id01').style.display='none'; this.createTestSuite(e)}} type="button" className="w3-button w3-dark-grey">Ok</button>
                                <label className="w3-center w3-text-red w3-padding w3-hide-small">{this.state.createTestSuiteMessaage}</label>
                              </footer>
                            </div>
                          </div>
                        </form>

                        <p className="w3-center">{this.state.loading ? "loading...":""}</p>
                      </div>
                    </Content>
                  </TabPanel>
                
                </Tabs>
              </TabPanel>
              
              
        </Tabs >
      </div>
          
        );
    }

}

//{/* <input id="tags1" style={{color:"black"}} type="text" required={true}/> */}

                        
                    
                         

                // <div> 
                //   <pre >
                //       {JSON.stringify(this.state.testSuiteListDetails)}
                //   </pre>
                // </div>