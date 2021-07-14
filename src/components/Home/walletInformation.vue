<template>
<div>
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
  </div>


  <h1 class="pt-5 mt-5">History</h1>

  <div v-if="coinPriceHistoryBool === false">
    <input type="button" @click="startPriceHistory" value="Starting price history">
  </div>

  <div v-if="coinPriceHistoryArray.length > 0" class="d-flex justify-content-center">
    <table border="1">
      <tbody>
      <th>PRICE</th>
      <tr v-for="object in coinPriceHistoryArray">
        <td class="p-2" style="margin-right: 50px" >€ {{object.price}}</td>
      </tr>
      </tbody>
    </table>
  </div>
</div>
</template>

<script>

export default {
  name: "walletInformation",
  computed : {
    coinArray(){
      return this.$store.state.coinArr;
    },
    currentWalletValue(){
      return this.$store.state.investedETH * this.$store.state.coinArr[0].price
    },
    currentInvestedETH(){
      return this.$store.state.investedETH;
    },
    coinPriceHistoryBool(){
      return this.$store.state.startPriceHistory;
    },
    coinPriceHistoryArray(){
      return this.$store.state.coinPriceHistoryArr;
    }
  },
  methods : {
    startPriceHistory(){
      this.$store.state.startPriceHistory = true;
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

        if (this.$store.state.startPriceHistory === true){
          this.$store.state.coinPriceHistoryArr.push(obj);
        }

      } catch (e) {
        console.log(e);
      }
    },
    async keepRequesting() {
      await setInterval(() => {
        this.requestData();
      }, 30000 );
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
      }

      if (dt.getHours() === 23 && dt.getMinutes() === 59){
        this.$store.state.startPriceHistory = false;
      }
    }, 1000)
  }
}
</script>

<style scoped>
p {
  font-size: 27px;
}

* {
  font-family: Arial;
}
</style>