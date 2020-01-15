import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PyAXSpinner from './components/spinner';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/genie.css';
import "react-image-gallery/styles/css/image-gallery.css";
import "./App.css";
import Execution from "./containers/execution/index";
import TestLab from "./containers/test-lab";
import Home from "./containers/home";
import Triage from "./containers/triage";
import Navigation from "./components/navigation";
import {BrowserRouter, Route, Switch} from "react-router-dom"

// import { Router, Link, Location } from '@reach/router';
import posed, { PoseGroup } from 'react-pose';
import Spinner from './components/spinner';

var BranchLogo = require('./icons/source-branch.png');
const RouteContainer = posed.div({
    enter: { opacity: 1, delay: 300, beforeChildren: true },
    exit: { opacity: 0 }
  });
  
export default class App extends Component{
    constructor(props) {
        super(props);
        this.state = {
          loading: true,
          apiServer: "http://127.0.0.1:5000",
          branch:""
        }
      }
    
    getCurrentBranchAPI = () => {
        fetch(this.state.apiServer + "/get_current_branch", {mode: "cors"})
        .then(response => {
            if (response.ok){
            return response.json();
            }else{
                throw new Error('Something went wrong');
            } 
        })
        .then((data) => {
            this.setState({branch:data.branch})
        })
        .catch((error) => console.log(error + "Get test pack details"));        
    }

    componentDidMount(){
        this.getCurrentBranchAPI();
    }
    render(){
        return(
            <BrowserRouter>
                <Route
                    render={({ location }) => (
                        <div id="site-container">
                        <div id="content-container">            
                        <Navigation />
                        <PoseGroup>
                            <RouteContainer key={location.pathname}>
                            <Switch location={location}>
                                <Route exact path= "/" component={Home} key="home"/>
                                <Route exact path= "/testlab" component={TestLab} key="testlab"/>
                                <Route exact path= "/execution" component={Execution} key="execution"/>
                                <Route exact path= "/triage" component={Triage} key="triage"/>
                            </Switch>
                            </RouteContainer>
                        </PoseGroup>
                            
                        </div>
                        <footer >
                            <small className="main-footer">
                            <span>© 2020 Testing</span>
                            <div style={{display:"flex", flexDirection:"row"}}>
                                <img src={BranchLogo} height="17px"/>
                                <span style={{marginLeft:"2px"}}>{this.state.branch}</span>
                            </div>
                            <div className="main-footer-right">
                            <span>Contact: &nbsp;</span><a href="mailto:Ranganathan.Veluswamy@gmail.co.uk" style={{color:"white"}}>Ranganathan Veluswamy</a>
                            </div>
                            </small>
                                    
                        </footer>
                        </div>
                    )}
                />
            </BrowserRouter>
        );
    }
}

  
  