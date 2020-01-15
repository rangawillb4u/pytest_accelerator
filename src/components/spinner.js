import React from 'react';
import { css } from 'react-emotion';
import { PacmanLoader, PulseLoader, PropagateLoader, ClipLoader, ScaleLoader, FadeLoader, BeatLoader, BounceLoader, GridLoader } from 'react-spinners';
 
const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;
 
export default class PyAXSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  render() {
    return (
        <div>            
            <div id="spinnerr" className='sweet-loading' style={{padding:"6px"}}>
                <PacmanLoader 
                className={override}
                sizeUnit={"px"}
                size={18}

                //radius = {1}
                color={'#FFFFFF'}
                loading={this.props.state.loading}
                />
            </div>
        </div> 
    )
  }
}