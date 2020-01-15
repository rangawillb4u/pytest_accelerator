import React from 'react';
import ImageGallery from 'react-image-gallery';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Zoom from '@material-ui/core/Zoom';


function Transition(props) {
    return <Zoom direction="up" {...props} />;
}

export default class ScreenshotViewer extends React.Component {
  state = {
      activeImage: 1
  };


  handleClose = () => {
    this.props.setScreenshotViewerOpenState(false, 0)    
  };

  imageList = () =>{
      var images = []
      var sortedStepImageDetails = this.props.state.stepImageDetails
      sortedStepImageDetails = sortedStepImageDetails.sort((a,b)=> a.stepNo - b.stepNo)
      for (const stepDetail of sortedStepImageDetails){
        images.push({original: stepDetail.imgUrl, thumbnailLabel: stepDetail.stepID, sizes:"(min-width: 400px, min-height:500px) 400px, 100vw"})
      }
      return images
  }

  currentStepRow = () =>{
    let currentStepNo = this.props.state.screenshotStartIndex + 1
    var results = this.props.state.selectedTestResult.results.results;
    if (results){
      for (const busKeyword of results.businessKeywordList){
        for (const step of busKeyword.stepList){
            if (step.stepDetails.stepNo === currentStepNo){
                return <table id='main' style={{width:'100%'}}>{this.props.colGroup}<tbody>
                <tr className='section'>
                    <td colSpan='5'>{busKeyword.businessKeyword}</td>
                </tr>
                {this.props.createStepRow(step, false)}
                </tbody></table>
            }
        }
      }
    }
  }

  setCurrentScreenshotIndex = (currentIndex) =>{
    this.props.setCurrentScreenshotIndex(currentIndex)
  }  

  render() {
    return (
        <div>
            <Dialog
            open={this.props.state.openScreenshotViewer}
            onClose={this.handleClose}
            fullWidth={true}
            maxWidth={false}          
            TransitionComponent={Transition}
            aria-labelledby="form-dialog-title"
            >
            <DialogTitle id="form-dialog-title">
                
            </DialogTitle>
            {/* variant="outlined"  */}
            <DialogContent>
                <div>
                    {this.currentStepRow()}
                </div>
                <div style={{display: "flex", justifyContent:"space-around"}}>
                    <div style={{width:"60%", minHeight:"500px" }}>
                        <ImageGallery items={this.imageList()} 
                        startIndex={this.props.state.screenshotStartIndex} 
                        onSlide={this.setCurrentScreenshotIndex}
                        useBrowserFullscreen={false}
                        />
                    </div>
                </div>
            </DialogContent>

            <DialogActions>
                <Button onClick={this.handleClose} color="primary">
                Close
                </Button>
            </DialogActions>
            </Dialog>
            
            
        </div>
    );
  }
}


