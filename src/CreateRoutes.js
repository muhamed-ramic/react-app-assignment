import React from 'react';
import {Route } from 'react-router-dom';
import App from './App.js';
import MovieDetail from './MovieDetail.js';

 const CreateRoutes = () =>(
     <main>
     <Route exact path="/detail/:id" component={MovieDetail}/>
     <Route exact path="localhost" render={()=><App/>}/>
     </main>
)
export default CreateRoutes;
