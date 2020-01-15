import React, {Component} from "react";
import posed, { PoseGroup } from "react-pose";
import styled from "styled-components";


// height: 100vh;
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Item = posed.li({
  visible: {
    opacity: 1,
    transition: { duration: 2000 }
  },
    enter: { opacity: 1, transition: { duration: 1000 } },
    exit: { opacity: 0 },
    
    
  });

const StyledItem = styled(Item)`
  padding: 15px;
  list-style-type: none;
  margin: 5px 0px 5px 0px;
  border: 1px solid #e3e3e3;
`;
const ItemList = ({ items }) => (
    <ul>
      <PoseGroup>
        {items.map(item => <StyledItem key={item.id}>{item.text}</StyledItem>)}
      </PoseGroup>
    </ul>
  );
class Home extends Component{
    constructor(props){
        super(props);
        this.state = {
            data: [],
            items: [
                { id: 1, text: "React" },
                { id: 2, text: "Javascript" },
                { id: 3, text: "Programming" },
                { id: 4, text: "Animations" }
              ]
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
      }
    componentDidMount() {
      document.getElementById("spinnerr").style.display = 'none';
    // this.interval = setInterval(this._shuffle, 2000);
    // for (var i = 0; i < 5; i++){
        
    //     setTimeout(() => {
    //         this.setState({
    //         items: this.state.items.concat([{ id: 5, text: "See how I fade in?" }])
    //         });
    //     }, 1000);
    // }

  
    //   setTimeout(() => {
    //     this.setState({
    //       items: [{ id: 6, text: "Can also fade in on top" }].concat(
    //         this.state.items
    //       )
    //     });
    //   }, 6000);
    }


    render(){
        return (
          <div>
          
      </div>
        );
    }

}
export default Home;

// <p>Home jkhk</p>
//           <Container>
//             <ItemList items={this.state.items} />
//           </Container>