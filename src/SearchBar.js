import React from 'react';
import './App.css';

export default class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.myRef = React.createRef();
  }
  onChange=(event)=>{
    const node = this.myRef.current;
    this.props.onChange(event,node);
  }
  render(){
    return(
    <div className="Search">
    <form>
    <input type="text" className="form-control" id="id1" placeholder="Search"  ref={this.myRef} value={this.props.searchValue} onChange={this.onChange}/>
    </form>
    </div>

    );
  }
}
