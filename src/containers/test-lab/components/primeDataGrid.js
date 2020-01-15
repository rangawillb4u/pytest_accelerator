import React, { Component } from 'react';
import {DataTable} from 'primereact/datatable';
import SingleSelect from './../../../MUIComponents/singleSelect.js'
import MUITextField from '../../../MUIComponents/textField'
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
// import {Column} from 'primereact/column';
import {Column} from 'primereact/components/column/Column';
import {InputText} from 'primereact/components/inputtext/InputText';
import {Button} from 'primereact/components/button/Button';
import {Dropdown} from 'primereact/components/dropdown/Dropdown';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

export default class PrimeDataTable extends Component {

    constructor() {
        super();
        this.state = {
        }
        this.statusTemplate = this.statusTemplate.bind(this);
        
    }


    testStatusEditor = (props)=> {
        let statusList = [
            {label: 'PASSED', value: 'PASSED'},
            {label: 'FAILED', value: 'FAILED'},
        ];       
        let optionsTestStatus = [];    
        var cntr = 1;
        for (const status of statusList){
            optionsTestStatus.push(<MenuItem key={cntr} value={status.label}>{status.label}</MenuItem>);
        cntr += 1;
        }
        return (
            <Select
                value={props.rowData[props.field]}
                inputProps={{
                      name: 'testStatusEditor',
                      id: 'testStatusEditor',
                    }}       
                fullWidth={true}             
                displayEmpty={false}
                onChange={(e) => this.onEditorValueChangee(props, e.target.value)}
                > {optionsTestStatus}</Select>            
        );
    }

    triageWorkflowStatusEditor = (props)=> {
        let triageWorkflowStatusList = [
            {label: 'NEW', value: 'NEW'},
            {label: 'OPEN', value: 'OPEN'},
            {label: 'IN-PROGRESS', value: 'IN-PROGRESS'},
            {label: 'DONE', value: 'DONE'},
        ];       
        let triageWorkflowStatusOptions = [];    
        var cntr = 1;
        for (const triageWorkflowStatus of triageWorkflowStatusList){
            triageWorkflowStatusOptions.push(<MenuItem key={cntr} value={triageWorkflowStatus.label}>{triageWorkflowStatus.label}</MenuItem>);
        cntr += 1;
        }
        return (
            <Select
                value={props.rowData[props.field]}
                inputProps={{
                      name: 'triageWorkflowStatusEditor',
                      id: 'triageWorkflowStatusEditor',
                    }}       
                fullWidth={true}             
                displayEmpty={false}
                onChange={(e) => this.onEditorValueChangee(props, e.target.value)}
                > {triageWorkflowStatusOptions}</Select>            
        );
    }

    assigneeEditor = (props)=> {
        let assigneeList = [
            {label: 'Archana', value: 'Archana'},
            {label: 'Tarini', value: 'Tarini'},
            {label: 'Stevie', value: 'Stevie'},
            {label: 'Darshan', value: 'Darshan'},
        ];       
        let assigneeOptions = [];    
        var cntr = 1;
        for (const assignee of assigneeList){
            assigneeOptions.push(<MenuItem key={cntr} value={assignee.label}>{assignee.label}</MenuItem>);
        cntr += 1;
        }
        return (
            <Select
                value={props.rowData[props.field]}
                inputProps={{
                      name: 'assigneeEditor',
                      id: 'assigneeEditor',
                    }}       
                fullWidth={true}             
                displayEmpty={false}
                onChange={(e) => this.onEditorValueChangee(props, e.target.value)}
                > {assigneeOptions}</Select>            
        );
    }

    failTypeEditor = (props)=> {
        let failTypeList = [
            {label: 'Application Defect', value: 'Application Defect'},
            {label: 'Test Issue', value: 'Test Issue'},    
            {label: 'Functionality Not Ready', value: 'Functionality Not Ready'},    
            {label: 'Environment Issue', value: 'Environment Issue'},
            {label: 'Internal Error', value: 'Internal Error'},
            {label: 'Not triaged', value: 'Not triaged'},    
        ];       
        let failTypeOptions = [];    
        var cntr = 1;
        for (const failType of failTypeList){
            failTypeOptions.push(<MenuItem key={cntr} value={failType.label}>{failType.label}</MenuItem>);
        cntr += 1;
        }
        return (
            <Select
                value={props.rowData[props.field]}
                inputProps={{
                      name: 'failTypeEditor',
                      id: 'failTypeEditor',
                    }}        
                fullWidth={true}             
                displayEmpty={false}
                onChange={(e) => this.onEditorValueChangee(props, e.target.value)}
                > {failTypeOptions}</Select>            
        );
    }

    jiraReferenceEditor = (rowData)=> {
        let jiraID = rowData.jira_reference
        let jiraLink = 'https://jira.customappsteam.co.uk/browse/' + jiraID
        let tooltip_text = "View bug: " + rowData.jira_reference + " in Jira."
        return (
            <div>
                {jiraID==="" ? <div/> : <button type="button"
                tooltip={tooltip_text} tooltipOptions={{position: 'top'}} onClick={(e)=>{window.open(jiraLink, '_blank')}}> {rowData.jira_reference}</button>
                }
            </div>
        );
    }

    
    onEditorValueChangee = (props, value) => {
        let updatedRows = [...props.value];
        updatedRows[props.rowIndex][props.field] = value;
        this.props.setRowDataState("rows", updatedRows);
    }
    
    inputTextEditor = (props) => {
        return <TextField fullWidth={true} value={props.rowData[props.field]} onChange={(e) => this.onEditorValueChangee(props, e.target.value)} />;
    }
    
    textEditor = (props) => {
        return this.inputTextEditor(props);
    }
        
    requiredValidator = (props) => {
        let value = props.rowData[props.field];
        return value && value.length > 0;
    }
    displaySelection = (data) => {
        if(!data || data.length === 0) {            
            // this.props.setRowDataState("triagedRows", data)
            return <div style={{textAlign: 'left'}}>No Selection</div>;
        }
        else {
            if(data instanceof Array){
                return <ul style={{textAlign: 'left', margin: 0}}>{data.map((row,i) => <li key={row.Sno}>{row.Test_ID + ' - ' + row.Iteration_ID + ' - ' + row.Step_ID + ' - ' + row.Fail_Type}</li>)}</ul>;
            }else
                return <div style={{textAlign: 'left'}}>Selected Car: {data.vin + ' - ' + data.year + ' - ' + data.brand + ' - ' + data.color}</div>
        }
    }

    //Templates
    statusTemplate = (rowData, column) => {
        let status = rowData.status;
        let fontColor = status.includes("FAIL") ? 'red' : 'green';        
        return <span style={{color: fontColor}}>{rowData.status}</span>;
    }

    failTypeTemplate = (rowData, column) => {
        let failType = rowData.fail_type;
        let fontWeight = failType.includes("Application") ? 'bold' : 'normal';        
        return <span style={{fontWeight: fontWeight}}>{failType}</span>;
    }

    resultView = (e, rowData) =>{
        this.props.setViewerOpenState(true)
        this.props.setSelectedTestResult(rowData)
        this.props.loadImageList(rowData.results.results)
    }

    raiseBugView = (rowData, e, column) => {
        this.props.setParentState("bugSummary", rowData.test_name)
        this.props.setParentState("bugDescription", rowData.fail_description)
        this.props.setParentState("currentResult", rowData.results)
        this.props.setParentState("currentExecLogRowIndex", column.rowIndex)
        
        this.props.setCreateBugViewerState(true)
        console.log(rowData.fail_description)
        console.log(rowData.test_id)
        console.log(this.props.state.rows[column.rowIndex])
        console.log(column)
    }

    actionTemplate = (rowData, column) => {
        return <div style={{display:"flex", justifyContent:"center"}}>
            <Button type="button" icon="pi pi-chart-bar" className="p-button-info" 
            // style={{marginRight: '.5em'}} 
            tooltip="View test result" tooltipOptions={{position: 'top'}} onClick={(e)=>{this.resultView(e, rowData)}} />
            {rowData.fail_type.includes("Application") && rowData.jira_reference.trim()===""? <Button type="button" icon="pi pi-bell" className="p-button-danger" tooltip="View fail screenshot" tooltipOptions={{position: 'top'}} 
            onClick={(e)=>{this.raiseBugView(rowData, e, column)}}/> : <div/>}
        </div>;
    }
    

    loadColumns = () =>{
        let columnHeaders = []; 
        let nonDisplayColumns = ["results", "test_id"];  
        columnHeaders.push(<Column key={"checkbox"} selectionMode="multiple" style={{width:'3em'}}/>);
        for (const col of this.props.state.columns){
            if (!nonDisplayColumns.includes(col.field)){
                if (col.editable) {
                    if (col.header === "status") columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.testStatusEditor} style={{height: '3.5em', width:col.width}} body={this.statusTemplate}/>);
                    else if (col.header === "fail_type") {
                        columnHeaders.push(<Column key={"result"} field={"result"} header={"result"} filter={false}  style={{height: '3.5em', width:100}} body={this.actionTemplate}/>);
                        columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.failTypeEditor} style={{height: '3.5em', width:col.width}} body={this.failTypeTemplate}/>);
                    } else if (col.header === "triage_workflow_status") columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.triageWorkflowStatusEditor} style={{height: '3.5em', width:col.width}}/>);
                    else if (col.header === "assignee") columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.assigneeEditor} style={{height: '3.5em', width:col.width}}/>);
                    else if (col.header === "jira_reference") columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.textEditor} body={this.jiraReferenceEditor} style={{height: '3.5em', width:col.width}}/>);
                    else columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} editor={this.textEditor} style={{height: '3.5em', width:col.width}}/>);
                }else columnHeaders.push(<Column key={col.field} field={col.field} header={col.header} filter={true} style={{height: '3.5em', width:col.width}}/>);
            }
        }
        return columnHeaders;
        
    }
    export = () => {
        this.dt.exportCSV();
    }

    // filterElement={this.testStatusEditor} 
    // filterElement={this.failTypeEditor}filterElement={this.textEditor} 
    render() {
        const {showTriageButton} = this.props;
        var header = <div style={{'textAlign':'left'}}>
                        <i className="pi pi-search" style={{margin:'4px 4px 0 0'}}></i>
                        <InputText type="search" onInput={(e) => this.setState({globalFilter: e.target.value})} placeholder="Global Search" size="50"/>
                    </div>;
                    
        let paginatorRight = <Button icon="pi pi-cloud-upload" onClick={(e)=>{this.props.triageSelectedRows(e)}}/>;
        let paginatorLeft = <div>
            <Button icon="pi pi pi-refresh"  title="Refresh"  onClick={(e)=>{this.props.refreshData(e)}}/>
            <label>   {this.props.state.rows.length} records</label>
        </div>;
        return (
            <div className="content-section implementation">
                <DataTable value={this.props.state.rows}
                editable={true} 
                autoLayout={true}
                columnResizeMode={"expand"}
                paginator={true}
                selection={this.props.state.selectedRows}
                //footer={this.displaySelection(this.props.state.selectedRows)}
                onSelectionChange={e => {
                    this.props.setRowDataState("selectedRows", e.value)
                    // this.props.setViewerOpenState(true)
                }}
                scrollable={true}  scrollHeight= {"400px"} //window.innerHeight
                reorderableColumns={true} 
                resizableColumns={true}
                paginator={true} paginatorLeft={paginatorLeft} paginatorRight={ 
                <div >{<Button icon="pi pi-cloud-upload"  title="Triage selected rows" onClick={(e)=>{this.props.triageSelectedRows(e)}}/>}
                <Button  style={{marginLeft:"5px"}} title="Export to CSV" type="button" icon="pi pi-external-link" iconPos="left" label="CSV" onClick={this.export}></Button></div>
                } rows={10} rowsPerPageOptions={[5,10,20]}
                header={header} globalFilter={this.state.globalFilter} 
                ref={(el) => { this.dt = el; }} >
                    {this.loadColumns()}
                </DataTable>
            </div>
        );
    }
}
