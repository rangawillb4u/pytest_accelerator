import React, {Component} from "react";
import {Treebeard, decorators, theme} from 'react-treebeard';
import styles from './../css/test-suite-viewer-styles';
import newStyle from './../css/TreeBread_Style';
import * as filters from './filter';


// Example: Customising The Header Decorator To Include Icons
decorators.Header = ({style, node}) => {
    const iconType = node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};

    return (
        <div style={style.base}>
            <div style={style.title}>
                <i className={iconClass} style={iconStyle}/>
                
                {node.name}
            </div>
        </div> 
    );
};



export default class TestSuiteViewer extends Component{
    constructor(props){
        super(props);
        this.state = {}
        this.onToggle = this.onToggle.bind(this);
    }

    loadTestDataAPI=(TestDataFile)=>{
        // let TestDataFile = this.props.state.selectedTestDataFile;
        // var TestDataFile = "ranga_test_data.csv";
        fetch(this.props.state.apiServer + "/get_test_data_details/" + TestDataFile, {
          mode: "cors", })
        .then(response => {
            if (response.status===200){
              return response.json();
            }else if(response.status===555){
              this.setState({createTestSuiteMessaage: "Test-Suite name already exist. Please chose a different name"});
              throw new Error('Test-Suite name already exist.');
            } 
        })
        .then((data) => {
        this.props.setParentState("selectedTestDataDetails", data);               
        document.getElementById("spinnerr").style.display = 'none'; })
        .catch((error) => this.props.handleError(error, "Get test data details"));
    }

    

    getSelectedTestDetails(selectedTest){ 
        var selectedTestDetails = {};
        var testClassName = "";
        for (const [className, tests] of Object.entries(this.props.state.tests)){
            for (const testName of Object.keys(tests)){
                if (selectedTest===testName){
                    testClassName = className;
                    return {className: testClassName,selectedTestDetails:tests[testName]};
                }
            }
        }
        return {className: testClassName,selectedTestDetails:selectedTestDetails};
    }

    onToggle(node, toggled){
        this.props.setParentState("selectedTestDetails", {pageObjects:[]});        
        if(this.props.state.cursor){this.props.state.cursor.active = false;}
        node.active = true;
        if(node.children){ node.toggled = toggled; }
        this.props.setParentState("cursor", node);
        var selectedTest = node.name;
        // if (selectedTest.substring(0, 5).toUpperCase()==="TEST_"){
        if(!node.children){
            let {className, selectedTestDetails} = this.getSelectedTestDetails(selectedTest);
            let selectedTestExecutionDetails = {[className]:{[node.name]:selectedTestDetails}};
            this.props.setParentState("selectedTestExecutionDetails", selectedTestExecutionDetails); 
            this.props.setParentState("selectedTestDetails", selectedTestDetails);  
            this.props.setParentState("selectedTestPack", {value:selectedTestDetails.props.testPackName, label:selectedTestDetails.props.testPackName});  
            this.props.setParentState("selectedTestDataFile", selectedTestDetails.props.testDataFile);
            this.loadTestDataAPI(selectedTestDetails.props.testDataFile);
            if (Object.keys(selectedTestDetails).length > 0){
                this.props.setParentState("testDetailsMessage", "Test details for selected test.");
            }else{        
                this.props.setParentState("testDetailsMessage", "Please select a test to view the details.");
            }      
        }else this.props.setParentState("testDetailsMessage", "Please select a test to view the details.");     
    }

    onFilterMouseUp(e){
        const filter = e.target.value.trim();
        if (!filter) {
            return; 
        }
        var filtered = filters.filterTree(this.props.state.treeData, filter);
        filtered = filters.expandFilteredNodes(filtered, filter);
        this.props.setParentState("data", filtered);
    }

    updateTreeTheme = () =>{
        let newTheme = theme
        theme.tree.base.backgroundColor = "#000000"
        theme.tree.base.color = '#000000' //'#9DA5AB'
        return newTheme

    }

    render(){
        return(
            <div style={{minHeight:window.innerHeight-260 + "px"}}>
                <h6 className="title w3-center">Test {this.props.state.viewerTitle} Viewer </h6>
                <div className="test-list-container">
                    {/* <p className="w3-large w3-center">{this.props.state.testSuiteViewerMessage} <b>{this.props.state.tagCombinations}</b></p> */}
                    <div style={styles.searchBox}>
                        <div className="input-group">
                            <span className="input-group-addon">
                            <i className="fa fa-search"/>
                            </span>
                            <input className="form-control"
                                onKeyUp={this.onFilterMouseUp.bind(this)}
                                placeholder="Search / Filter tests..."
                                type="text"/>
                        </div>
                    </div>
                    
                    <div style={styles.component}>
                        <Treebeard data={this.props.state.data}
                                decorators={{...decorators, Header:decorators.Header}}
                                onToggle={this.onToggle}/> 
                    </div>
                </div>
                
            </div>
        );
    }
}


                    // <div> 
                    //     <pre >
                    //         {JSON.stringify(theme)}
                    //     </pre>
                    // </div>