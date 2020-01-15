import React, {Component} from "react"
import "./../css/pom-creation.css"
import 'react-tippy/dist/tippy.css'
import {Tooltip} from 'react-tippy';
import Switch from "react-switch";
import ReactCardFlip from 'react-card-flip';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import green from '@material-ui/core/colors/green';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MenuItem from '@material-ui/core/MenuItem';
import SingleSelect from './../../../MUIComponents/singleSelect.js'
import MUITextField from '../../../MUIComponents/textField'
import MUIToolTip from '../../../MUIComponents/toolTip'


const styles = {
  card: {
    border: '1px solid #eeeeee',
    borderRadius: '3px',
    padding: '15px',
    width: '250px'
  },
  image: {
    height: '200px',
    width: '250px'
  }
};
const theme = createMuiTheme({
  palette: {
    primary: green,
  },
  typography: {
    useNextVariants: true,
  },
});

class POList extends Component {
  render () {
    var items = this.props.items.map((item, index) => {
      return (
        <POListItem key={index} item={item} index={index} removeItem={this.props.removeItem} markTodoDone={this.props.markTodoDone} items={this.props.items}/>
      );
    });
    return (
      <ul className="list-group"> {items} </ul>
    );
  }
}
  
class POListItem extends Component {
  constructor(props) {
    super(props);
  }
  onClickClose = () => {
    var index = parseInt(this.props.index);
    this.props.removeItem(index);
  }
  onClickDone = () => {
    var index = parseInt(this.props.index);
    this.props.markTodoDone(index);
  }
  render () {
    var todoClass = this.props.item.done ? 
        "list-group-item" : "list-group-item";
    return(
      <div >        
        <li  style={{display:"flex", flexDirection:"row",flexFlow:"row nowrap"}}>
          <div className={todoClass} style={{width:"40%", margin:"5px", textAlign:"right", color:"gray"}}>
            {(this.props.item.stepType === "PO") ? this.props.item.pageName : this.props.item.wrapper}
          </div>
          <div className={todoClass} style={{width:"100%", margin:"5px"}}>
            {(this.props.item.stepType === "PO") ? this.props.item.value : this.props.item.argString}
          </div>
          {((this.props.item.index === this.props.items.length)) ?
          <IconButton aria-label="Delete" colour="secondary" onClick={this.onClickClose}>
            <DeleteIcon fontSize="small" />
          </IconButton> :
          <IconButton aria-label="Delete" colour="secondary" disabled onClick={this.onClickClose}>
            <DeleteIcon fontSize="small" />
          </IconButton> }
          {/* <button type="button" className="close" style={{color:"red"}} onClick={this.onClickClose}>&nbsp;&times;</button> */}
        </li>    
      </div> 
    );
  }
}

//<span className="glyphicon glyphicon-ok icon" aria-hidden="true" onClick={this.onClickDone}></span>
//<button type="button" className="close" onClick={this.onClickClose}>&times;</button>

class WrapperCreation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedWrapper: ""
    }
  }

  loadAllWrappersOption = () => {
    let optionsWrappers = [];    
      var cntr = 1;
      // optionsWrappers.push(<MenuItem key="Select-wrapper" value="Select wrapper">Select wrapper...</MenuItem>);
      for (const wrapperName of Object.keys(this.props.wrapperDetails.web_utils)){
          optionsWrappers.push(<MenuItem key={cntr} value={wrapperName}>{wrapperName}</MenuItem>);
        cntr += 1;
      }
    return optionsWrappers;
  }

  miniWikiSection = () => {
    const{selectedWrapper} = this.state;
    let miniWikiElement = [];
    if ((selectedWrapper !== "") && (selectedWrapper !== "Select wrapper")){
      for (const line of this.props.wrapperDetails.web_utils[selectedWrapper].description.split("#")){
        miniWikiElement.push(<p style={{textAlign:"left"}}>{line}</p>)
      }
    }
    return miniWikiElement;

  }

  argSection = () => {
    const{selectedWrapper} = this.state;
    if ((selectedWrapper !== "") && (selectedWrapper !== "Select wrapper")){
      let mArgInputs = [];
      for (const mArg of this.props.wrapperDetails.web_utils[selectedWrapper].mandatoryArgs){
        mArgInputs.push(         
          <MUITextField 
              label={mArg}
              id={mArg}
              defaultValue=""
              fullWidth={true}
              required={true}
            />
            
        )
      }
      let mArgSection =       
        <div >
          {mArgInputs}
        </div>
      let oArgInputs = [];
      for (const oArg of this.props.wrapperDetails.web_utils[selectedWrapper].optionalArgs){
        var oArgDet = oArg.split("=");
        let id = oArgDet[0]
        let value = oArgDet[1]
        oArgInputs.push(
          <MUITextField 
              label={id}
              id={id}
              defaultValue={value}
              fullWidth={true}
            />
        )
      }
      let oArgSection =       
        <div>
          {oArgInputs}
        </div>

      let argInputs = []
      {mArgInputs.length>0 ? argInputs.push(mArgSection):{}}
      {oArgInputs.length>0 ? argInputs.push(oArgSection):{}}
      let newHeight = "160px"
      {this.props.isFlipped ?
        newHeight = String((mArgInputs.length + oArgInputs.length - 1) * 50 + 230 ) + "px"
        : {}        
      }
      
      
      document.getElementById("height-increaser").style.height = newHeight
      // this.props.setWrapSecHeight(newHeight)
      return <div>{argInputs} </div>
    }
    return <div/>
  }

  onWrapperSelect = (e) => {
    e.preventDefault();
    this.setState({selectedWrapper:e.target.value})
    // let newHeight = String(document.getElementById("wrapper-creation-section").offsetHeight + 50) + "px";
    // this.props.setWrapSecHeight(newHeight)
  }

  render(){
    return(
      <div id="wrapper-creation-section" style={{display:"flex", flexDirection:"column", width:"100%"}}>
        <form style={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
          
          <div style={{width:"200px"}}>
            <SingleSelect
                    value={this.state.selectedWrapper}
                    onChange={this.onWrapperSelect}                          
                    inputProps={{
                      name: 'selectedWrapper',
                      id: 'selected-wrapper',
                    }}
                    menuItems={this.loadAllWrappersOption}
                    label="Wrapper"
                  />
          </div>

          {/* <Tooltip TransitionComponent={Zoom} title={this.miniWikiSection()} style={fontSize="20"}>
            
          </Tooltip> */}
          {/* <MUIToolTip
            longText={this.miniWikiSection()}
            toolTipElement={<div style={{marginLeft:"20px",width:"500px"}}>
                              {this.argSection()}
                            </div>}
          /> */}

          <Tooltip
            html={(
              <div>
                {this.miniWikiSection()}
              </div>
            )}
            style={{width:"500px", fontSize:"2"}}
            animateFill={false}
            animation="scale"
            arrow={true}
            arrowSize="big"
            inertia={true}
            size="small"
          >
          {this.argSection()}
          </Tooltip>

        </form>

        {/* <div style={{marginTop:"40px"}} className="w3-center">
            {this.miniWikiSection()}
        </div> */}

      </div>
    );
  }
}

class POCreationForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
        checked:false,
        isFlipped: false,
        appChecked: false,
        currentApp:"portal",
    }
  }

  setPOHeight = () =>{
    document.getElementById("height-increaser").style.height = "160px";
  }

  handleSwitchChange = (checked) => {
    this.setState({ checked });
    if(checked){
      document.getElementById("poLabel").style.color = "#c2c4c6"
      document.getElementById("wrapperLabel").style.color = "black"
    }else{
      document.getElementById("poLabel").style.color = "black"
      document.getElementById("wrapperLabel").style.color = "#c2c4c6"
    }
    this.setState(prevState => ({ isFlipped: !prevState.isFlipped }));
    
    {checked ? 
      {} 
      : 
       this.setPOHeight()}
  }

  handleAppSwitchChange = (appChecked) => {
    this.setState({ appChecked });
    if(appChecked){
      document.getElementById("portalLabel").style.color = "#c2c4c6"
      document.getElementById("appianLabel").style.color = "black"      
      this.props.setParentState("currentApp", "appian");
      this.props.setPOInitialState("appian")
      // this.props.setParentState("selectedPage", "AppianLoginPage");
      // this.props.setParentState("selectedPageObject", "login_appian");
      
    }else{
      document.getElementById("portalLabel").style.color = "black"
      document.getElementById("appianLabel").style.color = "#c2c4c6"   
      this.props.setParentState("currentApp", "portal");
      this.props.setPOInitialState("portal")
      // this.props.setParentState("selectedPage", "PortalLoginPage");
      // this.props.setParentState("selectedPageObject", "login_portal");
    }
  }
  
  componentDidMount() {
    //this.refs.itemName.focus();
    
  }
  
  onSubmit = () => {
    
    // var newItemValue = this.refs.selectedPO.value;
    // var newItemPageName = this.refs.selectedPage.value;
    
    var newItemValue = document.getElementById("selected-page-object").value;
    var newItemPageName = document.getElementById("selected-page").value;
    var newItemReturnPageName = this.props.allPOMItems.po_classes[newItemPageName][newItemValue]
    var stepType = "PO";
    // document.getElementById("selected-page").value = newItemReturnPageName;
    
    if (newItemReturnPageName !== 'None' ){
      if (newItemReturnPageName ){

        this.props.setParentState("selectedPage", newItemReturnPageName);

        if (!Object.keys(this.props.allPOMItems.po_classes[newItemReturnPageName]).includes(newItemValue)){
          this.props.setParentState("selectedPageObject", "");
        }
      }
    }
    if(newItemValue) {
      this.props.addItem({newItemValue, newItemPageName, newItemReturnPageName, stepType});
      //this.refs.form.reset();
    }
  }

  addWrapperStep = () => {
    let wrapper = document.getElementById("selected-wrapper").value;
    let args = {}
    var stepType = "wrapper";
    let argStringList = [];
    if ((wrapper !== "") && (wrapper !== "Select wrapper")){
      for (const mArg of this.props.wrapperDetails.web_utils[wrapper].mandatoryArgs){  
        let mArgValue = document.getElementById(mArg).value;    
        args[mArg] = mArgValue;
        if (mArg.includes("element") || mArg.includes("number")) argStringList.push(mArg + "=" + mArgValue)
        else argStringList.push(mArg + "=" + "\"" + mArgValue + "\"")
      }

      for (const oArg of this.props.wrapperDetails.web_utils[wrapper].optionalArgs){
        var oArgDet = oArg.split("=");
        let id = oArgDet[0]
        let value = oArgDet[1]
        if (value !== document.getElementById(id).value.trim()) {
          let oArgValue = document.getElementById(id).value;
          args[id] = oArgValue          
          if (id.includes("element") || id.includes("number")) argStringList.push(id + "=" + oArgValue)
          else argStringList.push(id + "=" + "\"" + oArgValue + "\"")
        }
      }
      var argString = "(" + argStringList.join(", ") + ")";
      this.props.addItem({wrapper, args, argString, stepType});
      console.log(args);
    }
  }

  nextPage = () => {

  }
  loadAllPage = () => {
    let optionsPage = [];
    //if (this.props.items.length > 1) {      
      // var returnPage = this.props.items[this.props.items.length - 1].returnPageName
      var cntr = 1;
      for (const pageName of Object.keys(this.props.allPOMItems.po_classes)){
        optionsPage.push(<MenuItem key={cntr} value={pageName}>{pageName}</MenuItem>);
          // if (pageName===returnPage) optionsPage.push(<option key={cntr} value={pageName}>{pageName}</option>);
          // else optionsPage.push(<option key={cntr} value={pageName}>{pageName}</option>);
        cntr += 1;
      }
    //}
    return optionsPage;
  }

  loadAllPOForPage = () => {
    let optionsPO = [];
    if (Object.keys(this.props.allPOMItems.po_classes).length > 1){
      var selectedPage = "PortalLoginPage"
      if (document.getElementById("selected-page")!==null){
        selectedPage = document.getElementById("selected-page").value;
      }
      if (selectedPage !== ""){
        let cntr = 1;
        if (Object.keys(this.props.allPOMItems.po_classes).includes(selectedPage)){            
          var poList = Object.keys(this.props.allPOMItems.po_classes[selectedPage]);
          for (const po of poList){
            optionsPO.push(<MenuItem key={cntr} value={po}>{po}</MenuItem>);
              // optionsPO.push(<option key={cntr} value={po}>{[po]}</option>);
            cntr += 1;
          }
        }
      }
      
    }
    
      return optionsPO;
  }

  addWrapperStepValidation = () =>{
    if (document.getElementById("selected-wrapper")){
      let wrapper = document.getElementById("selected-wrapper").value;    
      if ((wrapper !== "") && (wrapper !== "Select wrapper")){
        for (const mArg of this.props.wrapperDetails.web_utils[wrapper].mandatoryArgs){  
          if(document.getElementById(mArg).value === "") return true;    
        }
      }else return true;
    }
    return false;
  }
  addPOStepValidation = () =>{
    if (document.getElementById("selected-page")){
      let page = document.getElementById("selected-page").value; 
      let pageObject = document.getElementById("selected-page-object").value;    
      if (!((page == "") || (pageObject == ""))){
        return false;
      }
        
    }
    return true;
  }

  onPageSelect = (e) => {
    e.preventDefault();
    let selectedPage = e.target.value;
    this.props.setParentState("selectedPage", selectedPage);
  }

  onPageObjectSelect = (e) => {
    e.preventDefault();
    let selectedPageObject = e.target.value;
    this.props.setParentState("selectedPageObject", selectedPageObject);
  }

  render () {
    return (
        <div className="w3-section w3-light-gray w3-card-4 " >
        <h5 className="pomCreationForm-title w3-center">Build</h5>
        
        <div className="w3-card-4 " style={{backgroundColor:"	#eaeaea", display:"flex", flexDirection: "row", width:"100%",justifyContent: "space-between"}}>
          <label htmlFor="material-switch" style={{marginTop:"17px"}}>
            <div style={{display:"flex"}}>
              <label id="poLabel" style={{margin:"5px 10px 5px 20px"}}>Page Object</label>
              <Switch
                checked={this.state.checked}
                onChange={this.handleSwitchChange}
                onColor="#fce392"
                offColor="#82E0AA"
                onHandleColor="#fcd249"
                offHandleColor="#28B463"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <label id="wrapperLabel" style={{margin:"5px", color:"#c2c4c6"}}>Wrapper</label>
            </div>
              
          </label>

          <label htmlFor="material-switch" style={{marginTop:"17px", marginRight:"75px"}}>
            <div style={{display:"flex"}}>
              <label id="portalLabel" style={{margin:"5px 10px 5px 20px"}}>Portal</label>
              <Switch
                checked={this.state.appChecked}
                onChange={this.handleAppSwitchChange}
                onColor="#54BAD0"
                offColor="#54BAD0"
                onHandleColor="#255A96"
                offHandleColor="#255A96"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <label id="appianLabel" style={{margin:"5px", color:"#c2c4c6"}}>Appian</label>
            </div>
              
          </label>

        </div>
        <ReactCardFlip isFlipped={this.state.isFlipped}>
          <div key="front" className="w3-card-4 " style={{backgroundColor:"#eeffe8"}}>
            <div style={{display:"flex", flexDirection: "row", width:"100%", justifyContent: "flex-end"}}>

            {/* <label htmlFor="material-switch" style={{marginTop:"10px"}}>
              <div style={{display:"flex"}}>
              <label id="poLabel" style={{margin:"5px 10px 5px 20px"}}>Page Object</label>
              <Switch
                checked={this.state.checked}
                onChange={this.handleSwitchChange}
                onColor="#fce392"
                offColor="#82E0AA"
                onHandleColor="#fcd249"
                offHandleColor="#28B463"
                handleDiameter={30}
                uncheckedIcon={false}
                checkedIcon={false}
                boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                height={20}
                width={48}
                className="react-switch"
                id="material-switch"
              />
              <label id="wrapperLabel" style={{margin:"5px", color:"#c2c4c6"}}>Wrapper</label>
              </div>
              
            </label> */}
            {/* <a href="#" title="Add PO step to test"  style={{color:"green", margin:"10px 20px 10px 0px"}} onClick={(e)=>{e.preventDefault(); this.onSubmit()}}><i className='fas fa-plus-circle' style={{fontSize:"30px", color:"green"}}></i></a> */}
            <MuiThemeProvider theme={theme}>
                <Button variant="fab" mini  color="primary" aria-label="Add" disabled={this.addPOStepValidation()} onClick={(e)=>{e.preventDefault(); this.onSubmit()}} style={{margin:"10px 20px 10px 0px"}}>
                  <AddIcon />
                </Button>
              </MuiThemeProvider>
            </div>
              <form className="formm w3-padding" style={{display:"flex", flexDirection:"row", justifyContent: "space-between"}}>
              
              <div style={{width:"300px"}}>
                <SingleSelect
                    value={this.props.state.selectedPage}
                    onChange={this.onPageSelect}                          
                    inputProps={{
                      name: 'selectedPage',
                      id: 'selected-page',
                    }}
                    menuItems={this.loadAllPage}
                    label="Page"
                  />
                </div>
              <div style={{marginLeft:"20px",width:"400px"}}>
                <SingleSelect
                      value={this.props.state.selectedPageObject}
                      onChange={this.onPageObjectSelect}                          
                      inputProps={{
                        name: 'selectedPageObject',
                        id: 'selected-page-object',
                      }}
                      menuItems={this.loadAllPOForPage}
                      label="Page Object"
                    />
                </div>
            </form>
          </div>
          <div key="back" className="w3-card-4" style={{backgroundColor:"#fff5e8"}}>
            <div style={{display:"flex", flexDirection: "row", width:"100%",justifyContent: "flex-end"}}>
              {/* <label htmlFor="material-switch"  style={{marginTop:"10px"}}>
                <div style={{width:"100%", display:"flex"}}>
                <label id="poLabel" style={{margin:"5px 10px 5px 20px", color:"#c2c4c6"}}>Page Object</label>
                <Switch
                  checked={this.state.checked}
                  onChange={this.handleSwitchChange}
                  onColor="#fce392"
                  offColor="#82E0AA"
                  onHandleColor="#fcd249"
                  offHandleColor="#28B463"
                  handleDiameter={30}
                  uncheckedIcon={false}
                  checkedIcon={false}
                  boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                  activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                  height={20}
                  width={48}
                  className="react-switch"
                  id="material-switch"
                />
                <label id="wrapperLabel" style={{margin:"5px"}}>Wrapper</label>
                </div>
                
              </label> */}
              {/* <a href="#" title="Add wrapper step to test" onClick={(e)=>{e.preventDefault(); this.addWrapperStep()}} style={{fontSize:"20px"}}><i className="fas fa-upload"></i></a> */}
              {/* <a disabled={true} href="#" title="Add wrapper step to test"  style={{color:"green", margin:"10px 20px 10px 0px"}} onClick={(e)=>{e.preventDefault(); this.addWrapperStep()}}><i className='fas fa-plus-circle' style={{fontSize:"30px", color:"green"}} ></i></a> */}
              
              <MuiThemeProvider theme={theme}>
                <Button variant="fab" mini  color="primary" disabled={this.addWrapperStepValidation()} aria-label="Add" onClick={(e)=>{e.preventDefault(); this.addWrapperStep()}} style={{margin:"10px 20px 10px 0px"}}>
                  <AddIcon />
                </Button>
              </MuiThemeProvider>
            </div>
            <form ref="wrapper-form" onSubmit={this.onSubmit} className="formm w3-padding">
              <WrapperCreation wrapperDetails={this.props.wrapperDetails} setWrapSecHeight={this.props.setWrapSecHeight} isFlipped = {this.state.isFlipped}/>
            </form>
            </div>            
          </ReactCardFlip>
        
      </div>
      
    );   
  }
}
//<button type="submit" className="btn btn-default form-control">Add</button> 
//<input type="text" ref="itemName" className="form-control" placeholder="add a new todo..."/>   onChange={(e)=>{this.onSubmit(e)}}
class POMHeader extends Component {
  render () {
    return <h4 className="w3-center"><b>Business Flow</b></h4>;
  }
}
  
export default class POM extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      todoItems: this.props.initItems,
      wrapperSectionHeight:"150px",
    };
  }
  addItem = (todoItem)=> {
    if (todoItem.stepType==="PO"){
      this.props.initItems.push({
        index: this.props.initItems.length+1, 
        stepType: todoItem.stepType,
        value: todoItem.newItemValue, 
        pageName: todoItem.newItemPageName,
        returnPageName:todoItem.newItemReturnPageName,
        done: false
      });
    }else{
      this.props.initItems.push({
        index: this.props.initItems.length+1, 
        stepType: todoItem.stepType,
        wrapper: todoItem.wrapper, 
        args: todoItem.arg,
        argString: todoItem.argString,        
        done: false
      });
    }
    this.setState({todoItems: this.props.initItems});
    window.scrollBy(0, 200);
    console.log(this.props.initItems)
  }
  removeItem = (itemIndex) => {
    this.props.initItems.splice(itemIndex, 1);
    let itemsLength = this.props.initItems.length;
    if (itemsLength>1 && this.props.initItems[itemsLength-1].stepType === "PO") {      
      this.props.setParentState("selectedPage", this.props.initItems[itemsLength-1].returnPageName);
    }else if (itemsLength ===0) {
      this.props.setPOInitialState();
    }
    this.setState({todoItems: this.props.initItems});
  }
  markTodoDone = (itemIndex) => {
    var todo = this.props.initItems[itemIndex];
    this.props.initItems.splice(itemIndex, 1);
    todo.done = !todo.done;
    todo.done ? this.props.initItems.push(todo) : this.props.initItems.unshift(todo);
    this.setState({todoItems: this.props.initItems});  
  }
  setWrapSecHeight = (wrapperSectionHeight) =>{
    this.setState({wrapperSectionHeight})
  }
  render() {
    const { wrapperSectionHeight } = this.state
    return (
      
      <div id="main">
        <POMHeader />
        <POList items={this.props.initItems} removeItem={this.removeItem} markTodoDone={this.markTodoDone} />
        <POCreationForm state={this.props.state}  setParentState={this.props.setParentState} addItem={this.addItem} items={this.props.initItems} allPOMItems={this.props.allPOMItems} wrapperDetails = {this.props.wrapperDetails} setWrapSecHeight={this.setWrapSecHeight} setPOInitialState={this.props.setPOInitialState}/>
        <div id="height-increaser" style={{height:"160px"}}></div>
      </div>
    );
  }
}
