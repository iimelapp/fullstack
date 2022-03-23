const initialState = {
    good: 0,
    ok: 0,
    bad: 0
  }
  
  const counterReducer = (state = initialState, action) => {
    console.log(action)
    switch (action.type) {
      case 'GOOD':
        const goodInc = state.good + 1
        const changedGood = {
            ...state,
            good: goodInc
        }
        return changedGood
      case 'OK':
        const okInc = state.ok + 1
        const changedOk = {
            ...state,
            ok: okInc
        }
        return changedOk
      case 'BAD':
          const badInc = state.bad +1
          const changedBad = {
              ...state,
              bad: badInc
          }
        return changedBad
      case 'ZERO':
        return initialState
      default: return state
    }
    
  }
  
  export default counterReducer