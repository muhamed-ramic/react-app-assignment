
const initialState = {
    category:'TV Shows',
    niz:[]
};
function rootReducer(state = initialState, action) {
  if(action.type==="CHANGE_CATEGORY")
  {
    return Object.assign({}, state, {
     category: action.payload
   });
  }
  return state;
};
export default rootReducer;
