import React from "react";
import ReactDOM from "react-dom";


class Label extends React.Component{

    render(){
        return(
            <div><label><h1>{this.props.text} </h1></label> </div>
        );
    }
}

export default Label;