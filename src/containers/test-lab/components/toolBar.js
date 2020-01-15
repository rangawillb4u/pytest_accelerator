import React, {Component} from "react";



export default class ToolBar extends Component {


    render(){
        return(
            <div className="icon-bar">
                    <a target="_blank" href="#" title="Create New TestPack" onClick={(e)=>{e.preventDefault(); document.getElementById('create-new-test-pack').style.display='block';}} style={{fontSize:"20px"}}><i className="material-icons">folder_open</i></a>
                    <a target="_blank" href="#" title="Create New Test" onClick={(e)=>{e.preventDefault(); document.getElementById('create-new-test').style.display='block';}} style={{fontSize:"20px"}}><i className="far fa-file-alt"></i></a>
                    <a className="active" href="#" title="Execute Test-suite" onClick={(e)=>{e.preventDefault(); document.getElementById('run-test-suite-modal').style.display='block';}} style={{fontSize:"20px"}}><i className="fa fa-play" style={{margin:"0px 4px"}}/><i className="fa fa-briefcase w3-margin-right"/></a> 
                    <a className="active" href="#" title="Execute Selected Test" onClick={(e)=>{e.preventDefault(); document.getElementById('run-test-id-modal').style.display='block';}} style={{fontSize:"20px"}}><i className="fa fa-play" style={{margin:"0px 4px"}}/><i className="far fa-file-alt"/></a>                     
                    <a href="#" title="Abort Test Execution" onClick={(e)=>{e.preventDefault(); document.getElementById('abort-execution-modal').style.display='block';}} style={{fontSize:"20px"}}><i className="fa fa-times"></i></a> 
                    <a target="_blank" href="#" title="Execution Report" onClick={(e)=>{e.preventDefault(); document.getElementById('create-new-test').style.display='block';}} style={{fontSize:"20px"}}><i className="fa fa-pie-chart"></i></a> 
            </div>
        );
    }
    
}