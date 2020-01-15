import React, {Component} from "react";
import "./app.css";
import ExecutionForm from "./../dynamic-form";
import modelForm from "./../../configs/form-object.json";

class Execution extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [
                {id:1, name:'a', age: 24, qualification:"Bsc", rating:3},
                {id:2, name:'b', age: 24, qualification:"Bsc", rating:4},
            ]
        }
    }
    onSubmit(model) {
        model.id = +new Date();
        // alert(JSON.stringify(model));
        fetch("http://127.0.0.1:5000/execute")
        .then(response => response.json())
        .then(data => this.setState({data:[data, ...this.state.data]}));
        this.setState({
            data:[model, ...this.state.data]
        });
    }

    componentWillUpdate(){
        // fetch("http://127.0.0.1:5000/execute")
        // .then(response => response.json())
        // .then(data = this.setState({resp}))
    }
    
    render(){
        return (
         <div className = "App">
             <ExecutionForm className="form"
                title = "Execution"
                model = {modelForm}
                onSubmit = {(model) => {this.onSubmit(model)}}             
             />
            <pre style= {{width:"300px"}}>
                {JSON.stringify(this.state.data)}
            </pre>
         </div>
        );
    }

}
export default Execution;