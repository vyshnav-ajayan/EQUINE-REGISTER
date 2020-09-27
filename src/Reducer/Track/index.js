

const initialState = {
  TrackDetails:[],
  RideId : 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TRACK_DATA":
        let {TrackDetails,RideId} = state;
      
        RideId = RideId + 1
        TrackDetails.push(action.payload )
        return { 
                ...state, 
                TrackDetails,
                RideId };

    default:
      return state;
  }
};

export default reducer;
