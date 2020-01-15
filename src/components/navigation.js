import React, {Component} from "react";
import {NavLink} from "react-router-dom";
import PyAXSpinner from './spinner';
import "./comp.css"
var LOGO = require('./../icons/logoNew1.PNG');
export default class Navigation extends Component{
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      }
    }
    clickNavLink = (e) =>{
        e.preventDefault();
    }
    render(){
        return(
            <div className=" w3-bar w3-section w3-black w3-card-4" >
                <NavLink className="navlink w3-animate-zoom" exact to={{
                                                            pathname: "/",
                                                            hash: "#"}} refresh="false">Home</NavLink>
                <NavLink className="navlink w3-animate-zoom" to="/testlab"  href='#' >Test Lab</NavLink>
                <NavLink className="navlink w3-animate-zoom" to="/triage"  href='#' >Triage</NavLink>
                    <img src={LOGO} height="50px" className=" w3-right w3-animate-zoom"/>
                    <PyAXSpinner className="w3-center" state = {this.state}/>
            </div>
        );
    }
}

//              <NavLink className="navlink" to="/execution">Execution</NavLink>

//                <NavLink className="navlink" to="/execution">Execution</NavLink>