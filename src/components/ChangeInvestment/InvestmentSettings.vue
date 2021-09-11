<template>
<div>
  <div>
    <h1>Your investment</h1>
    <p>{{totalInvestmentInETH}} ETH</p>
    <input type="button" value="Change investment" @click="changeInvestmentClicked">
  </div>
</div>
</template>

<script>
export default {
  name: "InvestmentSettings",
  computed : {
    totalInvestmentInETH(){
      return this.$store.state.investedETH
    }
  },
  methods : {
    changeInvestmentClicked(){
      let newInvestment = parseFloat(prompt('Enter your amount of owned ETH'));
      if (!isNaN(newInvestment)){
        localStorage.setItem('investedETH', newInvestment.toString());
        this.$store.state.investedETH = newInvestment;
        this.$forceUpdate;
        this.$router.push('/');
        alert('Investment value succesfully changed');
      }
      else {
        alert('Please fill in an amount and not any letters');
      }
    }
  }
}
</script>

<style scoped>

</style>