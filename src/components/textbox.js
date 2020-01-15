import React from "react";
import ReactDOM from "react-dom";


class TextBox extends React.Component{

    render(){
        return(
            <div><input type='text' placeholder={ this.props.text}></input> </div>
        );
    }
}

export default TextBox;