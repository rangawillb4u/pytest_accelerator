import React from "react";
import ReactDOM from "react-dom";


class Button extends React.Component{

    render(){
        return(
            <div><button text ={this.props.text}></button> </div>
        );
    }
}

export default Button;