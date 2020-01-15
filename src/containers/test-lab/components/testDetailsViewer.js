import React, {Component} from "react";
import ReactDOM from 'react-dom';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import posed, { PoseGroup } from "react-pose";
import styled from "styled-components";
// import "./../css/test-lab.css"
import DataGrid from './DataGrid';
import TextField from '@material-ui/core/TextField';


const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Item = posed.li({
    visible: {
        opacity: 1,
        transition: { duration: 3000 }
      },
    enter: { opacity: 1, transition: {
        opacity: { ease: 'easeOut', duration: 300 },
        default: { ease: 'linear', duration: 500 },
        type: 'spring', stiffness: 100
      }},
    exit: { opacity: 0, transition: { duration: 1000 } }
  });

const StyledItem = styled(Item)`
  background: white;
  padding: 10px;
  list-style-type: none;
  margin: 5px 0px 5px 0px;
  border: 2px solid #e3e3e3;
`;
const ItemList = ({ items }) => (
    <ul>
      <PoseGroup>
        {items.map(item => <StyledItem key={item.id}>{item.text}</StyledItem>)}
      </PoseGroup>
    </ul>
  );


export default class TestDetailsViewer extends Component{
    constructor(props){
        super(props);
        this.state = {            
            testDetailsMessage:"Please select a test to view the details."
         }
    }
    
    

    loadTestDataModal = (e, PropValue) =>{
        // ReactDOM.unmountComponentAtNode(document.getElementById('test-data-modal'));                
        // document.getElementById("spinnerr").style.display = 'block'; 
        document.getElementById('test-data-modal').style.display='block';
    }

    createTestDetailsTable = () => {
        let ignoreProps = ["TESTPACKDESCRIPTION1", "TESTCOVERAGE", "TESTDATACOVERAGE"]
        let rows = [];
        var cntr = 1;
        for (const [key, value] of Object.entries(this.props.state.selectedTestDetails)){
            if(key!=="pageObjects") {     
                if(key==="props"){
                    for (const [propName, PropValue] of Object.entries(value)){
                        let propNameDisp = propName.charAt(0).toUpperCase() + propName.slice(1);
                        if (propNameDisp==="TestDataFile"){
                            rows.push(<tr key={cntr}><th>{propNameDisp}</th><td>{PropValue}
                                <i className="fa fa-edit" style={{fontSize:"20px", marginLeft:"15px", cursor: "pointer"}} onClick={(e, PropValue)=>{this.loadTestDataModal(e, PropValue)}}/>
                                </td></tr>)
                        }else{
                            if (!ignoreProps.includes(propNameDisp.toUpperCase())) rows.push(<tr key={cntr}><th>{propNameDisp}</th><td>{<TextField id="tp-coverage-inscope" value={PropValue} margin="normal" fullWidth required multiline rowsMax="14" style={{width:"750px"}} />}</td></tr>)
                        }
                        cntr += 1;
                    }
                }else if (Array.isArray(value)){ 
                    var tValue = [];
                    var kCntr = 1;
                    for (const tag of value){
                        tValue.push(<div key={tag}>{tag}</div>)
                        kCntr += 1;
                    }
                    rows.push(<tr key={cntr}><th>{key}</th><td>{tValue}</td></tr>)
                    cntr += 1;              
                }else{                    
                    rows.push(<tr key={cntr}><th>{key}</th><td>{value}</td></tr>)
                    cntr += 1;
                }
            }
        }
        return rows
    }

    saveTestData = (e) => {
        e.preventDefault();
        this.props.updateTestDataAPI();
        document.getElementById('save-test_data-modal').style.display='none';
        document.getElementById('test-data-modal').style.display='none';
    }
   
    render(){
        return(
            <div>
                <div className="test-details w3-animate-zoom" style={{alignItems:"center", width:"100%"}}>                    
                    <div>
                        <p className="w3-large w3-center">{this.props.state.testDetailsMessage}</p>
                        <table className="w3-table-all w3-hoverable w3-card-4 w3-responsive" style={{width:"100%"}}>
                            <tbody>
                                {this.createTestDetailsTable()}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div className="page-object w3-animate-zoom">
                    <Container>
                        <ItemList className="w3-card-4 " items={this.props.state.selectedTestDetails.pageObjects} />
                    </Container>
                </div>

                <div id="test-data-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4" style={{width:"1400px"}}>
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('test-data-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Test Data Editor</h2>
                        </header>
                        
                        <DataGrid id = "data-grid" state={this.props.state.selectedTestDataDetails}  setTestDataState ={this.props.setTestDataState} />
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('test-data-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">Cancel</button>                          
                                <button onClick={(e)=>{document.getElementById('save-test_data-modal').style.display='block';}} type="button" className="w3-button w3-dark-grey">Ok</button>
                            </div>
                        </footer>
                    </div>
                </div>
                
                <div id="save-test_data-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4">
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('save-test_data-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Save Test Data</h2>
                        </header>
                        <label htmlFor="" className = "w3-padding w3-margin">Do you want to save the test data?</label>
                        
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <div className="w3-right">
                                <button onClick={(e)=>{document.getElementById('save-test_data-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">No</button>                          
                                <button onClick={(e)=>{this.saveTestData(e)}} type="button" className="w3-button w3-dark-grey">Yes</button>
                            </div>
                        </footer>
                    </div>
                </div>

                <div id="add-column-modal" className="w3-modal" >
                    <div className="w3-modal-content w3-animate-zoom w3-card-4">
                        <header className="w3-container w3-dark-grey"> 
                            <span onClick={(e)=>{document.getElementById('add-column-modal').style.display='none';}}
                            className="w3-button w3-display-topright">&times;</span>
                            <h2>Enter Column Name</h2>
                        </header>
                        <input id="column-name" className="w3-input w3-border w3-margin-bottom" type="text" placeholder="Enter Column Name" name="columnName" required/>
                        <footer className="w3-container w3-dark-grey w3-padding">
                            <button onClick={(e)=>{document.getElementById('add-column-modal').style.display='none';}} type="button" className="w3-button w3-dark-grey">Cancel</button>                          
                            <button onClick={(e)=>{this.createTestSuite(e)}} type="button" className="w3-button w3-dark-grey">Ok</button>
                        </footer>
                    </div>
                </div>
            </div>
        );
    }

}



                //<pre>{JSON.stringify(this.props.state.selectedTestDataDetails)} </pre>
// <BootstrapTable data={ products } striped={true} hover={true} bodyStyle={{overflow: 'overlay'}}>
//                             <TableHeaderColumn dataField='id' dataAlign="center"  isKey={ true }>Product ID</TableHeaderColumn>
//                             <TableHeaderColumn dataField='name'>Product Name</TableHeaderColumn>
//                             <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
//                         </BootstrapTable>


// var products = [{
//     id: 1,
//     name: "Product1",
//     price: 120
// }, {
//     id: 2,
//     name: "Product2",
//     price: 80
// }];


// <div>
//     <pre style= {{width:"300px"}}>
//         {JSON.stringify(this.props.state.selectedTestDetails)}
//     </pre>
// </div>