import React, {Component} from "react";
import ReactDataGrid from 'react-data-grid';
// import update from 'react-addons-update';
import update from 'immutability-helper';

import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import Refresh from '@material-ui/icons/Refresh'

const { Toolbar, Data: { Selectors } } = require('react-data-grid-addons');
const {
  DraggableHeader: { DraggableContainer }
} = require('react-data-grid-addons');

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
});

class DataGrid extends Component {
  constructor(props){
    super(props);
    this.state = {}         
  }
  
  onRowsDeselected = (rows) => {
    let rowIndexes = rows.map(r => r.rowIdx);
    this.props.setTestDataState("selectedIndexes", this.props.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 ));
  } 
  
  onRowsSelected = (rows)=> {
    this.props.setTestDataState("selectedIndexes", this.props.state.selectedIndexes.concat(rows.map(r => r.rowIdx)));
  }

  getRows = () => {
    return Selectors.getRows(this.props.state);
  };

  getSize = () => {
    return this.getRows().length;
  };

  rowGetter = (rowIdx) => {
    const rows = this.getRows();
    return rows[rowIdx];
  };

  handleGridSort = (sortColumn, sortDirection) => {
    this.props.setTestDataState("sortColumn", sortColumn);
    this.props.setTestDataState("sortDirection", sortDirection);
  };

  onHeaderDrop = (source, target) => {
    const stateCopy = Object.assign({}, this.props.state);
    const columnSourceIndex = this.props.state.columns.findIndex(
      i => i.key === source
    );
    const columnTargetIndex = this.props.state.columns.findIndex(
      i => i.key === target
    );

    stateCopy.columns.splice(
      columnTargetIndex,
      0,
      stateCopy.columns.splice(columnSourceIndex, 1)[0]
    );

    const emptyColumns = Object.assign({},this.props.state, { columns: [] });
    this.props.setTestDataState("emptyColumns", emptyColumns);
    this.setState(
      emptyColumns
    );

    const reorderedColumns = Object.assign({},this.props.state, { columns: stateCopy.columns });
    // this.props.setTestDataState("reorderedColumns", reorderedColumns);
    this.setState(
      reorderedColumns
    );
  }
    
  handleGridRowsUpdated = ({ fromRow, toRow, updated })=> {
    let rows = this.props.state.rows.slice();

    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = rows[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      rows[i] = updatedRow;
    }

    this.props.setTestDataState("rows", rows);
  }
  
  handleFilterChange = (filter) => {
    let newFilters = Object.assign({}, this.props.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.props.setTestDataState("filters", newFilters);
  }

  onClearFilters = () => {
    this.props.setTestDataState("filters", {});
  }

  addRow = (e) => {       
    e.preventDefault(); 
    this.props.setTestDataState("rows", [...this.props.state.rows, {}]);
  }
  deleteRow = (e) => {        
    e.preventDefault(); 
    if (this.props.state.selectedIndexes.length >0) {
      var newRows = this.props.state.rows.slice();
      newRows.splice(this.props.state.selectedIndexes[0],1);
      this.props.setTestDataState("selectedIndexes", [])
      this.props.setTestDataState("rows", newRows);
    }
  }

  triageSelectedRows = (e) => {        
    e.preventDefault(); 
    if (this.props.state.selectedIndexes.length > 0) {
      var selectedRows = [];
      for (const index of this.props.state.selectedIndexes){        
        selectedRows.push(this.props.state.rows[index]);
      }
      console.log(selectedRows);
      this.props.setTestDataState("triagedRows", selectedRows)
      this.props.updateDBExecutionLogsAPI(selectedRows);
    }else this.props.alert("warning", "Please select rows to triage")
  }

  render() {
      const rowText = this.props.state.selectedIndexes.length === 1 ? 'row' : 'rows';
      const { classes } = this.props;
    return  (
      <div>
        <div className= "w3-right">            
          {/* <button id="add-row" className="w3-btn w3-round-large w3-dark-grey" style={{margin:"5px 10px 0px 0px"}} onClick={(e)=>{this.addRow(e)}}>Add Row</button> */}
          {/* <button id="Triage-row" className="w3-btn w3-round-large w3-dark-grey" style={{margin:"5px 10px 0px 0px"}} onClick={(e)=>{this.deleteRow(e)}}>Delete Row</button> */}
          
          <Button variant="contained" color="default" className={classes.button} onClick={(e)=>{this.props.refreshData(e)}}>
            Refresh
            <Refresh className={classes.rightIcon} />
          </Button>
          <Button variant="contained" color="default" className={classes.button} onClick={(e)=>{this.triageSelectedRows(e)}}>
            Triage
            <CloudUploadIcon className={classes.rightIcon} />
          </Button>
          
        </div>
        
        <h5 className="w3-center">Execution Logs</h5>
        <DraggableContainer 
          onHeaderDrop={this.onHeaderDrop}>
            <ReactDataGrid
                rowKey="id"
                onGridSort={this.handleGridSort}
                enableCellSelect={true}
                columns={this.props.state.columns}
                rowGetter={this.rowGetter}
                rowsCount={this.getSize()}
                minHeight={500}
                //minWidth={1400}
                onGridRowsUpdated={this.handleGridRowsUpdated} 
                rowSelection={{
                    showCheckbox: true,
                    enableShiftSelect: true,
                    onRowsSelected: this.onRowsSelected,
                    onRowsDeselected: this.onRowsDeselected,
                    selectBy: {
                    indexes: this.props.state.selectedIndexes
                    }}
                }
                toolbar={<Toolbar enableAddRow={true}enableFilter={true}/>}
                onAddFilter={this.handleFilterChange}
                onClearFilters={this.onClearFilters}
                />
            </DraggableContainer>              
          {(this.props.state.selectedIndexes.length>0) ? <span className ="w3-margin">{this.props.state.selectedIndexes.length} {rowText} selected</span> : <span/>}
        </div>
        );
  }
}

DataGrid.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DataGrid)

//<button onClick={(e)=>{document.getElementById('add-column-modal').style.display='block';}} type="button" className="w3-button w3-round-large w3-dark-grey" style={{margin:"5px 10px 0px 0px"}}>Add column</button>          