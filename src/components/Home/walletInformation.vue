<template>
<div>
  <img src="https://bankr.nl/wp-content/uploads/2020/12/1200px-Ethereum-icon-purple.svg.png">
  <h1>ETH Price</h1>
  <p v-if="coinArray.length > 0">€ {{coinArray[0].price}}</p>
  <div v-if="coinArray.length > 0">
    <div class="d-flex justify-content-evenly">
      <div class="pd-20">
        <h1>Current Wallet Value</h1>
        <p>€ {{currentWalletValue}}</p>
      </div>
      <div class="pd-20">
        <h1>Currently invested</h1>
        <p>{{currentInvestedETH}} ETH</p>
      </div>
    </div>

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

  <!--<h1 class="pt-5 mb-5 fs-1">History</h1>-->
  <div>
    <button class="btn bg-eth text-white" v-if="coinPriceHistoryBool === false" type="button" @click="startPriceHistory">Starting price history</button>
    <h3 id="startingUp" class="bg-whf" v-if="startingUpMessage === true">Starting up... ({{countDown}} seconds)</h3>
  </div>

  <div v-if="coinPriceHistoryArray.length > 0" class="d-flex justify-content-center" >
    <table border="1" class="table">
      <tbody>
      <th>PRICE</th>
      <th>WALLET VALUE</th>
      <th>CURRENT STATUS</th>
      <tr :class="object.bullish ? 'table-success' : 'table-danger'" v-for="object in coinPriceHistoryArray">
        <td>€ {{object.price}}</td>
        <td>€ {{object.currentValue}}</td>
        <td>{{object.result}}</td>
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
        this.startPriceHistory();
      }

      if (dt.getHours() === 23 && dt.getMinutes() === 59){
        this.$store.state.startPriceHistory = false;
        this.$store.state.dayEndingValue = this.currentWalletValue
      }

      if (dt.getMinutes() === 10){
        this.$store.state.startPriceHistory = true;
        this.$store.state.dayStartingValue = this.currentWalletValue
        this.startPriceHistory();
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

h1 {
  font-size: 23px;
}

table {
  margin: auto;
}

.colorRed {
  color: red;
}

.colorGreen {
  color: green;
}

.pd-20 {
  padding: 20px;
}

img {
  width: 200px;
  margin: 20px;
}

.bg-eth {
  background: #626890;
}

#startingUp {
  background: #626890;
  color: white;
  width: 80%;
  margin: auto;
  border-radius: 10px;
  padding: 10px;
}
* {
  font-family: Arial,sans-serif;
}
</style>