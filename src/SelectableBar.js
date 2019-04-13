import React from 'react';
import './App.css';

export default class SelectableBar extends React.Component{

  InputChange=(event)=>{
    this.props.onClick(event);
  }
 render(){
   return(
      <div className="Bar">
       <button className="btn btn-info" onClick={this.InputChange} name="Movies">Movies</button>
       <button className="btn btn-info" onClick={this.InputChange} autoFocus name="TV Shows">TV Shows</button>
      </div>
   );
 }

}
