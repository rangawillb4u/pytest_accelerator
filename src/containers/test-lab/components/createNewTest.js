import React, {Component} from "react"
import "./../css/create-new-test.css"

import POM from './pomCreation';
import FixedOptions from './creatableMultiSelectWithFixed';
import SingleSelect from "./singleSelect"
import CreatableSingleSelect from "./creatableSingleSelect"
import Button from '@material-ui/core/Button';


const initialTagValue = [
    { value: 'ocean', label: 'Ocean', color: '#00B8D9', isFixed: true },
    { value: 'blue', label: 'Blue', color: '#0052CC', disabled: true }
]
var POItems = [];
// POItems.push({index: 1, pageName: "PortalLoginPage", value: "login_portal", returnPageName: "BasePage", stepType: "PO", done: false});
// POItems.push({index: 1, pageName: "AppianLoginPage", value: "login_appian", returnPageName: "AppianHomePage", stepType: "PO", done: false});

export default class CreateNewTest extends Component{
    constructor(props){
        super(props)
        this.state = {
            allTags: [],
            tagsOption: [],
            testPackTags:[],
            testDataFileOptions: [],
            selectedTags: [],
            selectedTestDataFile: {value: "test_data.csv", label: "test_data.csv"},
            selectedTestPack: {},
            initialTagValue:[{value: 'ui_feature_test_portal', label: 'ui_feature_test_portal', isFixed: true}],
            initialDataFileValue:{value: "test_data.csv", label: "test_data.csv"},
            initialTestPackValue:"",
            errorMessage:"",
            testName:"",
            currentApp:"portal", //"portal",
            allPOMItems:{apps:{portal:{po_classes:{}}}},
            wrapperDetails: {web_utils: {}},
            selectedPage:"PortalLoginPage",
            selectedPageObject:"login_portal",
        }
    }

    setPOInitialState = (currentApp) =>{
        if(!currentApp) currentApp = this.state.currentApp;
        if (currentApp==="portal"){             
            this.setState({selectedPage: "PortalLoginPage"});
            this.setState({selectedPageObject: "login_portal"});
        }else{            
            this.setState({selectedPage: "AppianLoginPage"});
            this.setState({selectedPageObject: "login_appian"});
        }

    }

    setStateFromChild = (stateItem, value) => {
        this.setState({[stateItem]: value});
    }

    updateSelectedTestPack = (selectedTestPack) => {
        if (selectedTestPack !== null) this.props.setParentState("selectedTestPack", selectedTestPack)
        this.setState({selectedTestPack: selectedTestPack});
        this.updateInitialValuesForSelectedTestPack(selectedTestPack);
    }

    updateSelectedTestDataFile = (selectedTestDataFile) => {
        this.setState({selectedTestDataFile: selectedTestDataFile});
    }

    updateSelectedTags = (selectedTags) => {
        this.setState({selectedTags: selectedTags});
        console.log(selectedTags)
    }
    
    updateTagsOptions = (tagsList) => {
        let boolFlag = false;
        var tagsOption = [];
        for (const tag of tagsList){
            {boolFlag ? 
                tagsOption.push({value:tag, label:tag})
                :
                tagsOption.push({value:tag, label:tag});
                boolFlag = true;
            }
        }
        this.setState({allTags:tagsOption});
        this.setState({tagsOption:tagsOption});
    }
    updateTestDataFileOptions = (testDataFileList) => {
        var testDataFileOptions = [];
        for (const testDataFile of testDataFileList){
            testDataFileOptions.push({value:testDataFile, label:testDataFile});
        }
        this.setState({testDataFileOptions:testDataFileOptions});
    }

    

    updateInitialValuesForSelectedTestPack = (selectedTestPack) => {        
        var testPackTags = [];
        var newTagsOptions = this.state.allTags.slice();
        if (selectedTestPack !== null) {
            if (Object.keys(this.props.state.testPackDetails.testPackList).length !==0){
                let testDataFile = this.props.state.testPackDetails.testPackList[selectedTestPack.value].classProps.testDataFile;
                this.setState({selectedTestDataFile:{value: testDataFile, label: testDataFile}});

                for(const testPackTag of this.props.state.testPackDetails.testPackList[selectedTestPack.value].classTags){
                    testPackTags.push({value:testPackTag, label:testPackTag, isFixed: true})
                    for( var i = 0; i < newTagsOptions.length-1; i++){ 
                        if ( newTagsOptions[i].value === testPackTag) {
                            newTagsOptions.splice(i, 1); 
                        }
                    }
                }
            }
        console.log(testPackTags)
        }else{
            this.setState({selectedTestDataFile:null});
        }
        this.setState({tagsOption:newTagsOptions.concat(testPackTags)});
        this.setState({selectedTags:testPackTags});
    }

    getAllTagsAPI(){
        fetch(this.props.state.apiServer + "/get_all_tags", {
          mode: "cors"})
        .then(response => {
            if (response.ok){
              return response.json();
            }
        })
        .then((data) => this.updateTagsOptions(data))
        .catch((error) => this.props.handleError(error, "Get all Tags"));
    }
    getTestDataFileListAPI(){
        fetch(this.props.state.apiServer + "/get_test_data_file_list", {
          mode: "cors"})
        .then(response => {
            if (response.ok){
              return response.json();
            }
        })
        .then((data) => this.updateTestDataFileOptions(data))
        .catch((error) => this.props.handleError(error, "Get list of Test data files"));
    }

    convertPOItemsFormat = () => {
        var formattedPOItems = [];
        var returnPage = "";
        var formatedItem = {};
        for (const item of POItems){
            if (item.stepType==="PO"){
                formatedItem = {
                    id: item.index,
                    stepType: item.stepType,
                    text: item.value,
                }            
                if (returnPage !== item.pageName) formatedItem["instantiatePage"] = item.pageName;
                returnPage = item.returnPageName;
                formatedItem["returnPage"] = returnPage;
                formattedPOItems.push(formatedItem)
            }else{                
                formatedItem = {
                    id: item.index,
                    stepType: item.stepType,
                    wrapper: item.wrapper,
                    args: item.args,
                    argString: item.argString,
                }      
                formattedPOItems.push(formatedItem) 
                returnPage = "";     
            }

        }
        return formattedPOItems;
    }

    createNewTestDetails = () => {    
        const { selectedTags, selectedTestDataFile } = this.state;    
        
        let selectedTestPackName = this.state.selectedTestPack.value;
        let selectedTestPackDetails = this.props.state.testPackDetails.testPackList[selectedTestPackName]
        let testName = document.getElementById("test-name").value.trim()
        let testID = "test_" + testName.toLowerCase().replace(/\s/g, '_');
        let classTestDataFile = selectedTestPackDetails.classProps.testDataFile;
        let testDataName = selectedTestDataFile.value.trim();  
        var testPackDetails ={
            tags: selectedTags.map(item=> item.value),
            testID: testID,
            testFileName:selectedTestPackDetails.moduleName,
            testClassName: selectedTestPackDetails.className,
            pageObjects: this.convertPOItemsFormat(),
            props: {
                name: testName,
                description: document.getElementById("test-desc").value,
            }
        }           
        if (classTestDataFile!==testDataName) testPackDetails.props["testDataFile"] = testDataName;
        console.log(JSON.stringify(testPackDetails))
        return testPackDetails;
    }

    createTestAPI(e){
        e.preventDefault();        
        fetch(this.props.state.apiServer + "/create_new_test", {
          mode: "cors", 
          method:"put", 
          body:JSON.stringify(this.createNewTestDetails()), 
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },})
        .then(response => {
            if (response.status===200){
              return response.json();
            }
        })
        .then((data) => {
          this.props.getTestPackDetailsAPI();
          document.getElementById("spinnerr").style.display = 'none';
          this.props.alert("success", "The new test is created successfully!"); 
        })
        .catch((error) => this.props.handleError(error, "Create new Test"));
        document.getElementById("spinnerr").style.display = 'block';
    }
    updateAllPOMItems = (allPOMItems) => {        
        this.setState({allPOMItems});
        // this.setState({selectedPage:POItems[0].returnPageName})
    }
    getAllPOMAPI(){
        fetch(this.props.state.apiServer + "/get_all_pom", {
          mode: "cors"})
        .then(response => {
            if (response.ok){
              return response.json();
            }
        })
        .then((data) => {
            console.log(data)
            this.updateAllPOMItems(data)})
        .catch((error) => {
            console.log(error);
            this.props.handleError(error, "Get all Page Objects")
        });
      }

      setWrapperState = (wrapperDetails) =>{
        this.setState({wrapperDetails})
        document.getElementById("spinnerr").style.display = 'none';
      }
    
      getAllWrappersAPI(){
        fetch(this.props.state.apiServer + "/get_all_wrappers", {mode: "cors"})
        .then(response => {
          if (response.ok){
            return response.json();
          }else{
              throw new Error('Something went wrong');
          } 
        })
        .then((data) => this.setWrapperState(data))
        .catch((error) => this.props.handleError(error, "Get all Wrappers"));
        
        document.getElementById("spinnerr").style.display = 'block';
      }

    onChange = (e) => {
        e.preventDefault();
        if (this.state.selectedTestPack !== null){
            let selectedTestPackName = this.state.selectedTestPack.value;
            let testName = "test_" + e.target.value.trim().toLowerCase().replace(/\s/g, '_');
            var existingTestListLower = this.props.state.testPackDetails.testPackList[selectedTestPackName].classTests.map(item=> item.toLowerCase());
            if (existingTestListLower.includes(testName)) {
                this.setState({errorMessage:"Test already exist with this name."})
                document.getElementById("create-new-test-button").disabled = true;
            }else{
                this.setState({errorMessage:""})            
                document.getElementById("create-new-test-button").disabled = false;
            }
            if(testName.trim()==="test_") document.getElementById("create-new-test-button").disabled = true;
            this.setState({testName:testName}) 
        }else e.target.disabled = true;
        
    }
    
    createButtonValidation = () =>{
        if (this.state.selectedTestPack === null) return true;
        if (document.getElementById("test-name")){            
            if (document.getElementById("test-name").value === ""){
                return true;
            } 
            if (document.getElementById("test-desc").value === "") {
                return true;
            }
        }
        

        return false;
    }
    componentDidMount(){
        this.getTestDataFileListAPI();
        this.getAllTagsAPI();
        this.getAllPOMAPI();
        this.getAllWrappersAPI();
        this.props.getTestPackDetailsAPI();
        this.updateSelectedTestPack(null);
        
        // this.updateSelectedTestPack({value: "Appian Tests", label: "Appian Tests"});
        // {Object.keys(this.props.selectedTestPack).length === 0 ? this.updateSelectedTestPack({}) : this.updateSelectedTestPack({value:this.props.selectedTestPack, label:this.props.selectedTestPack})}
    }
    // componentWillReceiveProps(nextProps){
    //     {Object.keys(this.props.selectedTestPack).length === 0 ? this.updateSelectedTestPack({}) : this.updateSelectedTestPack({value:this.props.selectedTestPack, label:this.props.selectedTestPack})}
    // }
    // componentDidUpdate(){
    // shouldComponentUpdate(nextProps, nextState){
    //     if (nextProps.selectedTestPack === nextState.selectedTestPack) return false
    //     else return true;
    //     // console.log(nextProps)
    //     //{Object.keys(this.props.selectedTestPack).length === 0 ? this.updateSelectedTestPack({}) : this.updateSelectedTestPack({value:this.props.selectedTestPack, label:this.props.selectedTestPack})}
    // }

    render(){
        const {selectedTestPack} = this.props.state;

        const { tagsOption, testDataFileOptions, errorMessage, allPOMItems, currentApp, wrapperDetails, initialTagValue, initialDataFileValue, initialTestPackValue, selectedTestDataFile, selectedTags } = this.state;
        return(
            <div>
                
            <div id="create-new-test" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4" style={{width:"1200px"}}>
                        <header className="w3-container w3-dark-grey w3-padding"> 
                            <span onClick={(e)=>{document.getElementById('create-new-test').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Create New Test</h2>
                        </header>
                        <div className="form-layout">
                            <ul className="wrapper">
                                <li className = "form-row">
                                    <label htmlFor="test-pack-name">Test pack name</label>
                                    <SingleSelect options={this.props.state.testPackOptions} initialValue={selectedTestPack} placeHolder={"Select test pack..."} updateSelectedItem={this.updateSelectedTestPack} />
                                </li>
                                <li className = "form-row">
                                    <label htmlFor="test-data-file-name">Test data file name</label>
                                    <CreatableSingleSelect options={testDataFileOptions} initialValue={selectedTestDataFile} placeHolder={"Select test data file..."} updateSelectedItem={this.updateSelectedTestDataFile} />
                                </li>
                                <li className="form-row">                                    
                                    <label htmlFor="tags">Tags</label>
                                    <div>
                                        <FixedOptions options={tagsOption} initialValue={selectedTags} placeHolder={"Select/Create tags...."} updateSelectedTags={this.updateSelectedTags}/>
                                    </div>
                                </li>
                            </ul>
                            
                            <ul className="wrapper">
                                <li className = "form-row">
                                    <label htmlFor="test-name">Test name</label>
                                    <input id = "test-name" type="text" 
                                    onChange={(e)=>this.onChange(e)} 
                                    required 
                                    placeholder={selectedTestPack===null ? "Please select the test pack to enter the test name..." : "Please enter the test name..." }
                                    disabled= {selectedTestPack===null ? true : false }
                                    />
                                </li>
                                
                                <li className = "form-row">
                                    <label htmlFor="test-desc">Test description</label>
                                    <textarea id = "test-desc" type="text"
                                    placeholder={selectedTestPack===null ? "Please select the test pack to enter the test description..." : "Please enter the test description..." }
                                    disabled= {selectedTestPack===null ? true : false }
                                    />
                                </li>

                                
                            </ul>
                        </div>
                        <div>
                            <POM state={this.state} setParentState={this.setStateFromChild} initItems={POItems} allPOMItems={allPOMItems.apps[currentApp]} wrapperDetails={wrapperDetails} setPOInitialState={this.setPOInitialState}/>
                        </div>
                        
                        <footer className="w3-container w3-dark-grey w3-padding" style={{display:"flex",flexDirection:"row", justifyContent:"flex-end"}}>
                            <div className="w3-center" style={{margin:"10px 30% 0 0"}}>                                
                                <label className="w3-text-red"><b>{errorMessage}</b></label>
                            </div>
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('create-new-test').style.display='none';this.updateSelectedTestPack(null)}} type="button" className="w3-button w3-dark-grey">Cancel</button>                          
                                {/* <Button onClick={(e)=>{document.getElementById('create-new-test').style.display='none';this.updateSelectedTestPack(null)}} fontSize="large">Cancel </Button> */}
                                
                                <button id="create-new-test-button"                                 
                                disabled={this.createButtonValidation()}
                                onClick={(e)=>{this.createTestAPI(e);document.getElementById('create-new-test').style.display='none';}} 
                                type="button" className="w3-button w3-dark-grey">Create</button>
                            </div>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }

}


// <li className = "form-row">
//     <label htmlFor="test-id">Test ID</label>
//     <input id = "test-id" type="text"/>
// </li>

// <li className = "form-row">
//     <label htmlFor="test-zypher-id">Zypher ID</label>
//     <input id = "test-zypher-id" type="text"/>
// </li>