<template>
<div>
  <h1>{{dateToday}}</h1>

  <h1>ETH Price</h1>
  <div v-if="coinArray.length > 0">
    <p>€ {{coinArray[0].price}}</p>
    <br>
    <br>
    <h1>Currently invested</h1>
    <p>{{currentInvestedETH}} ETH</p>
    <br>
    <br>
    <h1>Current Wallet Value</h1>
    <p>€ {{currentWalletValue}}</p>

    <div v-if="dayStartingVal !== 0">
      <div v-if="profitOrLossToday > 0">
        <h1>Profit Today</h1>
        <p class="colorGreen">€ {{profitOrLossToday}}</p>
      </div>
      <div v-else-if="profitOrLossToday < 0">
        <h1>Loss Today</h1>
        <p class="colorRed">€ {{profitOrLossToday}}</p>
      </div>
    </div>
  </div>


  <h1 class="pt-5 mt-5">History</h1>

  <div>
    <input v-if="coinPriceHistoryBool === false" type="button" @click="startPriceHistory" value="Starting price history">
    <h3 v-if="startingUpMessage === true">Starting up... (will take {{countDown}} seconds)</h3>
  </div>

  <div v-if="coinPriceHistoryArray.length > 0" class="d-flex justify-content-center">
    <table border="1" class="table">
      <tbody>
      <th>PRICE</th>
      <th>WALLET VALUE</th>
      <th>CURRENT STATUS</th>
      <tr :class="object.bullish ? 'table-success' : 'table-danger'" v-for="object in coinPriceHistoryArray">
        <td class="p-2" >€ {{object.price}}</td>
        <td class="p-2" >€ {{object.currentValue}}</td>
        <td class="p-2" >{{object.result}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>

export default {
  name: "walletInformation",
  data(){
    return {
      countDown : 0
    }
  },
  computed : {
    dateToday(){
      const dt = new Date();
      return `${dt.getDate()}/${dt.getMonth()}/${dt.getFullYear()}`;
    },
    coinArray(){
      return this.$store.state.coinArr;
    },
    currentWalletValue(){
      return (this.$store.state.investedETH * this.$store.state.coinArr[0].price).toFixed(2)
    },
    dayStartingVal(){
      return parseFloat(this.$store.state.dayStartingValue);
    },
    profitOrLossToday(){
      let dayStartVal = parseFloat(this.$store.state.dayStartingValue);
      let currentWalletVal = parseFloat(this.currentWalletValue);

      if (this.coinPriceHistoryArray.length > 0){
        this.$forceUpdate;
        return (currentWalletVal - dayStartVal).toFixed(2);
      }
    },
    currentInvestedETH(){
      return this.$store.state.investedETH;
    },
    coinPriceHistoryBool(){
      return this.$store.state.startPriceHistory;
    },
    coinPriceHistoryArray(){
      return this.$store.state.coinPriceHistoryArr;
    },
    startingUpMessage(){
      return this.$store.state.startingUpMsg;
    },

  },
  methods : {
    minuteCountDown(){
      this.countDown = 60;
      setInterval(() => {
        this.countDown--;
      }, 1000)
    },
    startPriceHistory(){
      this.$store.state.startPriceHistory = true;
      this.$store.state.startingUpMsg = true;

      this.$store.state.dayStartingValue = this.currentWalletValue
      this.minuteCountDown();
    },
    async requestData() {
      try {
        let response = await fetch('https://api.coingecko.com/api/v3/coins/ethereum');

        let res = await response.json();

        let obj = {
          price: res.market_data.current_price.eur
        }
        this.$store.state.coinArr = [];
        this.$store.state.coinArr.push(obj);

        this.$forceUpdate;
        if (this.$store.state.startPriceHistory === true){
          console.log('Starting value of the day',this.$store.state.dayStartingValue)
          console.log('The current wallet value',this.currentWalletValue)

          if (this.$store.state.dayStartingValue < this.currentWalletValue ){
            let historyObj = {
              price: res.market_data.current_price.eur,
              currentValue : parseFloat(this.currentWalletValue),
              bullish : true,
              result : 'PROFIT'
            }
            this.$store.state.coinPriceHistoryArr.push(historyObj);
          }
          else if (this.$store.state.dayStartingValue > this.currentWalletValue ) {
            let historyObj = {
              price: res.market_data.current_price.eur,
              currentValue : parseFloat(this.currentWalletValue),
              bullish : false,
              result : 'LOSS'
            }
            console.log(historyObj);
            this.$store.state.coinPriceHistoryArr.push(historyObj);
          }
        }
      } catch (e) {
        console.log(e);
      }
    },
    async keepRequesting() {
      await setInterval(() => {
        this.requestData();
      }, 60000 );
    },
  },
  async mounted() {
    await this.requestData();
    this.$store.state.fetchedStartupBool = true;
    await this.keepRequesting();


    setInterval(() => {
      const dt = new Date();
      if (dt.getHours() === 0){
        this.$store.state.startPriceHistory = true;
        this.$store.state.dayStartingValue = this.currentWalletValue
      }

      if (dt.getHours() === 23 && dt.getMinutes() === 59){
        this.$store.state.startPriceHistory = false;
        this.$store.state.dayEndingValue = this.currentWalletValue
      }

      if (this.coinPriceHistoryArray.length > 0){
        this.$store.state.startingUpMsg = false;
      }
    }, 1000)
  }
}
</script>

<style scoped>
p {
  font-size: 27px;
}

.colorRed {
  color: red;
}

.colorGreen {
  color: green;
}

* {
  font-family: Arial,sans-serif;
}
</style>