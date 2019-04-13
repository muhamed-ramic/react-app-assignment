import React from 'react';
import packageJson from '../package.json';

import store from './store/index.js';
import { connect } from "react-redux";

let apiKey = packageJson.ApiSettings.key;
let imageUrl = packageJson['ApiSettings']['image-url'] + packageJson['ApiSettings']['backdrop_path'];

function CoverImageRender(props){
   return(
       <div className="row">
        <div className="col-md-4 col-sm-4">
         <img src={imageUrl+props.movie.backdrop_path} alt="thereisnopicuture"/>
         <h1>{props.movie.title || props.movie.name}</h1>
         <p>{props.movie.overview}</p>
        </div>
       </div>
   );
}

 class MovieDetail extends React.Component{
  constructor(props){
    super(props);
    this.state = {movie:{}};
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    this.props.history.goBack();
}
  componentDidMount(){
    let id = parseInt(this.props.match.params.id,10);
    let searchAPIURI = this.props.category==="Movies"?"https://api.themoviedb.org/3/movie/"+id + "?api_key="+apiKey
                     + "&language=en-US":"https://api.themoviedb.org/3/tv/"+id + "?api_key="+apiKey + "&language=en-US";

    fetch(searchAPIURI)
    .then(results=>results.json())
    .then(data=>this.setState({
      movie:data
    }));

    const element = document.getElementById("root3");
    element.style.display="none";
  }
  componentWillUnmount(){
    const element = document.getElementById("root3");
    element.style.display="block";
  }
  render(){
    return(
      <div className="container">
      <div className="row">
      <div className="col-md-3 col-sm-3 col-md-offset-3 col-sm-offset-3">
      <button className="btn btn-default" onClick={this.goBack}>&lt;Back</button>
      </div>
      <p></p>
      </div>
      <CoverImageRender movie={this.state.movie}/>
      </div>
    );
  }
}
const mapStateToProps = state =>{
  return { category: state.category };
}
export default connect(mapStateToProps)(MovieDetail);
