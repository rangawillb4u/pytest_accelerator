import React, {Component} from "react"
import CreatableMultiSelect from "./creatableMultiSelect"
import CreatableSingleSelect from "./creatableSingleSelect"
import {Fieldset} from 'primereact/fieldset';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import SingleSelect from './../../../MUIComponents/singleSelect.js'

export default class CreateNewTestPack extends Component{
    constructor(props){
        super(props)
        this.state = {
            errorMessage: "",
            testPackName: "",
            existingTestModuleList: [],
            existingTestClassList: [],
            tagsOption: [],
            testDataFileOptions: [],
            selectedTags: [],
            selectedTestDataFile: "",
            tagsValue:[],
            dataFileValue:"",

        }
    }

    setTagsValue = (newValue) => {
        this.setState({tagsValue: newValue});
    }
    setDataFileValue = (newValue) => {
        this.setState({dataFileValue: newValue});
    }
    updateSelectedTestDataFile = (selectedTestDataFile) => {
        this.setState({selectedTestDataFile: selectedTestDataFile});
    }
    onTestDataFileSelect = (e) => {
        e.preventDefault();
        this.setState({selectedTestDataFile:e.target.value})
    }

    updateSelectedTags = (selectedTags) => {
        this.setState({selectedTags: selectedTags});
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
        this.setState({tagsOption:tagsOption});
    }
    updateTestDataFileOptions = (testDataFileList) => {
        var testDataFileOptions = [];
        for (const testDataFile of testDataFileList){
            testDataFileOptions.push({value:testDataFile, label:testDataFile});
        }
        this.setState({testDataFileOptions:testDataFileOptions});
    }
    testDataFileMenuItems = () => {
        let testDataOptions = [];    
          var cntr = 1;
          for (const testDataFileName of this.state.testDataFileOptions){
            testDataOptions.push(<MenuItem key={cntr} value={testDataFileName.value}>{testDataFileName.value}</MenuItem>);
            cntr += 1;
          }
        return testDataOptions;
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

    
    convertToClassName = (testPackName) => {
        var testClassName = testPackName.split(' ')
                        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                        .join('');
        return testClassName;
    }
    convertToModuleName = (testPackName) => {
        var testModuleName = testPackName.split(' ')
                        .map((s) => s.toLowerCase())
                        .join('_');
        return testModuleName;
    }

    createTestPackDetails = () => {    
        const { selectedTags, selectedTestDataFile } = this.state;    
        let testCategorykName = "Process"  
        let testDataName = selectedTestDataFile.trim();  
        let testPackTags = selectedTags; //["ui_feature_test_portal", "ui_feature_test_appian"]  
        let testPackName = document.getElementById("new-test-pack-name").value.trim();  
        let testClassName = "Test" + this.convertToClassName(testPackName);
        let testModuleName = "test_" + this.convertToModuleName(testPackName) + ".py";
        testModuleName = "\\" + testCategorykName + "\\" + testModuleName;
        let testPackDescription = document.getElementById("tp-description").value.trim(); 
        let testCoverageInScope = document.getElementById("tp-coverage-inscope").value.trim(); 
        let testCoverageOutOfScope = document.getElementById("tp-coverage-outofscope").value.trim(); 
        let testDataCoverageInScope = document.getElementById("td-coverage-inscope").value.trim(); 
        let testDataCoverageOutOfScope = document.getElementById("td-coverage-outofscope").value.trim(); 

        var testPackDetails ={
                className: testClassName,
                "moduleName": testModuleName,
                "classProps": {
                    testPackName: testPackName,
                    testDataFile: testDataName,
                    testPackDescription,
                    testCoverageInScope,
                    testCoverageOutOfScope,
                    testDataCoverageInScope,
                    testDataCoverageOutOfScope,
                },
                classTags: testPackTags,
            }   
        return testPackDetails;
    }

    createTestPackAPI(e){
        e.preventDefault();
        let newTestPackName = document.getElementById("new-test-pack-name").value;        
        fetch(this.props.state.apiServer + "/create_test_pack/" + newTestPackName, {
          mode: "cors", 
          method:"put", 
          body:JSON.stringify(this.createTestPackDetails()), 
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
          this.props.alert("success", "The test pack is created successfully!"); 
        })
        .catch((error) => this.props.handleError(error, "Create new Test-Pack"));
        document.getElementById("spinnerr").style.display = 'block';
    }
    closeAndClearForm = () => {
        document.getElementById('create-new-test-pack').style.display='none';         
        document.getElementById("new-test-pack-name").value = "";
        this.setState({tagsValue:[]});
        this.setState({dataFileValue:""});
    }
    onChange = (e) => {
        e.preventDefault();
        let testPackName = e.target.value.trim().toUpperCase();
        var existingTestPackListUpper = this.props.state.existingTestPackList.map(item=> item.toUpperCase());
        if (existingTestPackListUpper.includes(testPackName)) {
            this.setState({errorMessage:"Test pack already exist with this name."})
            document.getElementById("create-test_pack_button").disabled = true;
        }else{
            this.setState({errorMessage:""})            
            document.getElementById("create-test_pack_button").disabled = false;
        }
        if(testPackName.trim()==="") document.getElementById("create-test_pack_button").disabled = true;
        this.setState({testPackName:testPackName}) 
    }

    
    componentDidMount(){
        this.getTestDataFileListAPI();
        this.getAllTagsAPI()
        this.props.getTestPackDetailsAPI();
        document.getElementById("create-test_pack_button").disabled = true;
    }
    render(){
        const { tagsOption, testDataFileOptions, errorMessage, tagsValue, dataFileValue } = this.state;
        return(              
            <div id="create-new-test-pack" className="w3-modal" >
                <div className="w3-modal-content w3-animate-zoom w3-card-4" style={{width:"1200px"}}>
                    <header className="w3-container w3-dark-grey w3-padding"> 
                        <span onClick={(e)=>{this.closeAndClearForm()}}
                        className="w3-button w3-display-topright">&times;</span>
                        <h2>Create New Test Pack</h2>
                    </header>
                    <div className="form-layout">
                        <div className="wrapper-tp">
                            <div id="create-test-pack-form">
                                <div style={{marginLeft:"10px"}}>
                                    <TextField id="new-test-pack-name" label="Test pack name" margin="normal" fullWidth required onChange={(e)=>{this.onChange(e)}}/>
                                    <TextField id="tp-description" label="Description" margin="normal" fullWidth required multiline/>
                                </div>
                                <Fieldset legend="Test Pack Coverage">                                
                                    <TextField id="tp-coverage-inscope" label="In-scope" margin="normal" fullWidth required multiline rowsMax="4"/>
                                    <TextField id="tp-coverage-outofscope" label="Out-of-scope" margin="normal" fullWidth required multiline/>
                                </Fieldset>
                                
                            </div>
                        </div>
                        <div className="wrapper-tp">
                            <div>
                            <div style={{marginRight:"5px"}}>
                                    <SingleSelect
                                        value={this.state.selectedTestDataFile}
                                        onChange={this.onTestDataFileSelect}                          
                                        inputProps={{
                                        id: 'tp-test-data-file',
                                        }}
                                        menuItems={this.testDataFileMenuItems}
                                        label="Test data file name"
                                    />
                                </div>
                                <div className="w3-container" style={{margin:"15px 0 0 0"}}>
                                    <CreatableMultiSelect options={tagsOption} placeHolder={"Select/Create tags..."} updateSelectedTags={this.updateSelectedTags} value={tagsValue} setValue={this.setTagsValue}/>
                                </div>
                                <Fieldset legend="Test Data Coverage">                                
                                    <TextField id="td-coverage-inscope" label="In-scope" margin="normal" fullWidth required multiline rowsMax="4"/>
                                    <TextField id="td-coverage-outofscope" label="Out-of-scope" margin="normal" fullWidth required multiline rowsMax="4"/>
                                </Fieldset>
                            </div>
                        </div>
                    </div>
                    <footer className="w3-container w3-dark-grey w3-padding" style={{display:"flex",flexDirection:"row", justifyContent:"flex-end"}}>
                        <div className="w3-center" style={{margin:"10px 30% 0 0"}}>                                
                            <label className="w3-text-red"><b>{errorMessage}</b></label>
                        </div>
                        <div className="w3-right">
                            <button onClick={(e)=>{this.closeAndClearForm()}} type="button" className="w3-button w3-dark-grey" >Cancel</button>                          
                            <button id="create-test_pack_button" 
                            onClick={(e)=>{
                                this.createTestPackAPI(e);this.closeAndClearForm()}} type="button" className="w3-button w3-dark-grey">Create</button>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }
}