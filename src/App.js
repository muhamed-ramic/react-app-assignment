import React, { Component } from 'react';
import './App.css';
import packageJson from '../package.json';
import SelectableBar from './SelectableBar.js';
import SearchBar from './SearchBar.js';
import CreateRoutes from './CreateRoutes.js';
import {Link} from 'react-router-dom';

import store from './store/index.js';
import { connect } from "react-redux";
import {updateCategory} from './actions/index.js';


let apiKey = packageJson.ApiSettings.key;
let imageUrl = packageJson['ApiSettings']['image-url'] + packageJson['ApiSettings']['poster-size'];

//Image component
function Image(props){
  //Get only tv shows or movies or searchable movies.
  let array = [];
  let isInSearch = props.isInSearch;
  if(props.category!=='search' && isInSearch===false)
  {
    array = props.category==="TV Shows"? props.arr.slice(10,20):props.arr.slice(0,10);
    const element = <ImageRender arr={array} top10Movies={props.top10Movies}/>;
    return element;
  }
  else {
    array = props.arr.map(x=>imageUrl+x.poster_path);
    const element = <ImageRender arr={array} moviearr={props.arr}/>;
    return element;
  }
}

//Rendering image from uri of images.
function ImageRender(props){
  return props.arr.map((movie,index)=>(
    <div className="Images" key={index}>
    <div className="Border-Image">
 {
       props.top10Movies!==null && props.top10Movies!==undefined && props.top10Movies.length>0?
      <Link to={'/detail/'+props.top10Movies[index].id}>
      <img src={movie} key={index} alt="there is no picutre"/>
      </Link>
      :<Link to={'/detail/'+props.moviearr[index].id}>
      <img src={movie} key={index} alt="there is no picutre"/>
      </Link>
  }

    {props.top10Movies!==null&&props.top10Movies!==undefined?<p>{props.top10Movies[index].original_name || props.top10Movies[index].title}</p>
    :<p>{props.moviearr[index].original_name||props.moviearr[index].title}</p>
  }
  </div>
  </div>
));
}

class App extends Component {

  ControlButtonSelectableBar = (event)=>{
    //Purpose is here to switch buttons between top 10 movies and shows, and to trigger search again with selected tab.
    const target = event.target;
    const elementsWithFocus = document.getElementsByClassName('oboji');
    for (let key of elementsWithFocus) {
      key.classList.remove('oboji');
    }
    target.classList.add("oboji");
    const value = target.name==="Movies"?"Movies":"TV Shows";
    this.setState({
      category:value
    });
    this.props.updateCategory(value);
    this.fetchDataAfterSwitchingButton();
  }
   fetchDataAfterSwitchingButton(){
       if(this.state.isInSearch){
         let apiURI="",element;
         element = this.state.searchValue;
         //For more search with tabs tv and movie, extra search.
          const category = this.props.category;
          if(category==="TV Shows"){
            apiURI = "https://api.themoviedb.org/3/search/movie?api_key="+apiKey+"&query=" + element;
          }
          else if(category!=="TV Shows"){
            apiURI="https://api.themoviedb.org/3/search/tv?api_key="+apiKey+"&query=" + element;
          }
          fetch(apiURI)
          .then(results=>results.json())
          .then(data=>{return this.setState({searchableItems:data.results})});
       }
   }

  handleKeyUp = (event)=>{
    const value =event.target.value;
    let interval,apiURI="https://api.themoviedb.org/3/search/multi?api_key="+apiKey+"&query=" + value;
    const category = this.state.category;
    //Prepare for searching.
    if(value.length>3)
    {
      this.setState({category:'search'});
      clearTimeout(interval);
      interval = setTimeout(()=>{
        fetch(apiURI)
        .then(results=>results.json())
        .then(data=>{return this.setState({searchableItems:data.results})});
      },1000);
    }
    else if(value.length<3)
    {
        this.setState({
          category:'TV Shows',
          isInSearch:false
        });
    }
  }

  //Handle search input value and on keyup event.
  onChange = (event,node)=>{
    this.setState({searchValue:event.target.value,isInSearch:true});
    node.addEventListener('keyup',this.handleKeyUp);
  }


  constructor(props){
    super(props);
    this.state = {
      topRatedMovies:[],
      topRatedTvShows:[],
      moviePictures:[],
      category:'TV Shows',
      searchableItems:[],
      searchValue:'',
      isInSearch:false
    };
  }
  getTop10OfArray = (array)=>{
    return array.slice(0,10);
  }


  componentDidMount(){
    store.subscribe(()=>console.log(store.getState()));

    let movieImages=[];
    //Get top 10 rated movies from the API.
    fetch("https://api.themoviedb.org/3/movie/top_rated?api_key="+ apiKey + "&language=en-US&page=1")
    .then(results=> results.json())
    .then(data=>{
      let top10Movies = this.getTop10OfArray(data.results);
      movieImages = top10Movies.map(movie=>imageUrl+movie.poster_path);
      //Set images and movies in state.
      this.setState({topRatedMovies:top10Movies});
      this.setState({moviePictures:movieImages});
    });
    //Get top 10 rated tv shows.
    fetch("https://api.themoviedb.org/3/tv/top_rated?api_key="+ apiKey+"&language=en-US&page=1")
    .then(results=> results.json())
    .then(data=>{
      let top10TvShows = this.getTop10OfArray(data.results);
      movieImages = movieImages.concat(top10TvShows.map(movie=>imageUrl+movie.poster_path));
      this.setState({
        topRatedTvShows:top10TvShows
      });
      this.setState((prevState,props)=>({
        moviePictures:movieImages
      }))
    })
  }
  render() {
    const searchableItems = this.state.searchableItems;
    const search = this.state.searchValue;
    let movies = searchableItems.length===0?this.state.moviePictures:searchableItems;
    if(search.length<4)
    movies = this.state.moviePictures;
    const category = this.state.category;

    return (
      <div>
       <CreateRoutes/>
      <div id="root3">
      <SelectableBar onClick={this.ControlButtonSelectableBar} category ={this.state.category} />
      <br/>
      <SearchBar searchValue={this.state.searchValue} onChange={this.onChange} />
      <br/>
      <Image arr={movies} isInSearch={this.state.isInSearch} category={category} top10Movies={category==="TV Shows"?this.state.topRatedTvShows:this.state.topRatedMovies}/>
      </div>
      </div>
    );
  }
}
const mapStateToProps = state => {
  return { category: state.category };
};
const mapDispatchToProps = dispatch =>{
  return {updateCategory:category=>dispatch(updateCategory(category))};
}

export default connect(mapStateToProps,mapDispatchToProps)(App);
