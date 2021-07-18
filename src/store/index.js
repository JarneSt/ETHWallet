import { createStore } from 'vuex'

export default createStore({
  state: {
    coinArr : [],
    investedETH : 8.33273612,
    startPriceHistory : false,
    startingUpMsg : false,
    coinPriceHistoryArr : [],
    profitLossHistory : [],

    dayStartingValue : 0,
    dayEndingValue: 0
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
