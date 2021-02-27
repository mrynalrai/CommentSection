const initialState = {
    user: {
        userId: 'mrynalrai',
        userName: 'Mrinal Rai',
        avatar: 'profile'

        // userId: 'cr7',
        // userName: 'Cristiano Ronaldo',
        // avatar: 'man'

        // userId: 'lm10',
        // userName: 'Lionel Messi',
        // avatar: 'beard'
    },
    data: null
  }
  
  // Use the initialState as a default value
  export default function appReducer(state = initialState, action) {
    // The reducer normally looks at the action type field to decide what happens
    switch (action.type) {
      // Do something here based on the different types of actions
      case 'userUpdated':
          return {
              ...state,
              user: action.payload
          }
      case 'dataUpdated':
          return {
              ...state,
              data: [...action.payload]
          }
      default:
        // If this reducer doesn't recognize the action type, or doesn't
        // care about this specific action, return the existing state unchanged
        return state
    }
  }