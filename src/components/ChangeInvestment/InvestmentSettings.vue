<template>
<div>
  <div>
    <h1>Your investment</h1>
    <p>{{totalInvestmentInETH}} ETH</p>
    <input type="button" value="Change investment">
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
}
</script>

<style scoped>

</style>