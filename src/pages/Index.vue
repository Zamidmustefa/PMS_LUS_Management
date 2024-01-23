<template>
  <q-page class="bg-dark text-white">
    <div class="q-pt-lg"></div>
    <div class="flex flex-center" v-if="fetching">
      <q-spinner-oval
        color="primary"
        size="2rem"
        :thickness="5"
      />
    </div>
    <div v-else>
      <div style="display: flex; justify-content: space-between; padding: 0 25px;">
        <div class="text-center  q-pa-sm item q-mr-sm">
            <p style="font-weight: bold; margin: 0;">Total Revenue</p>
            <p class="text-green-2">Rs. {{ total_revenue.toFixed(0) }}</p>
          </div>
        <div class="text-center  q-pa-sm item ">
          <p style="font-weight: bold; margin: 0;">Total Profit</p>
          <p class="text-green-7">Rs. {{ total_profit.toFixed(0) }}</p>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; padding: 0 25px;">
        <div class="text-center  q-pa-sm item q-mr-sm">
          <p style="font-weight: bold; margin: 0;">Top Selling Item</p>
          <p class="text-green-7">{{ products[0].name }}</p>
          <b>Price:</b> {{ products[0].price }}
        </div>
        <div class="text-center  q-pa-sm item">
          <p style="font-weight: bold; margin: 0;">Items in Stock</p>
          <p class="text-red-4">{{ items_in_stock }}</p>
        </div>
      </div>
      <div class="text-center  q-pt-lg">
        <p>Products</p>
        <Product />
      </div>
    </div>
  </q-page>
</template>

<script>
import Product from 'src/components/Product.vue'
import { app } from 'src/boot/firebase'
export default {
  components: { Product },
  name: 'PageIndex',
  data(){
    return{
      fetching: true,
      products: [],
      items_in_stock: 0,
      total_revenue: 0,
      total_profit: 0
    }
  },
  created(){
    app.firestore().collection("inventory").orderBy("sales").onSnapshot(docs => {
      this.products = []
      this.items_in_stock = 0
      this.total_revenue = 0
      this.total_profit = 0
      
      docs.forEach(doc => {
        this.products.push({ ...doc.data(), id: doc.id, profit: (Number(doc.data().profit) * (Number(doc.data().profit_E) - Number(doc.data().i))) })
        this.items_in_stock += Number(doc.data().i)
        this.total_revenue += doc.data().sales
        this.total_profit += doc.data().sales > 0 ? (Number(doc.data().sales)/ Number(doc.data().price)) * Number(doc.data().profit)  : 0
      });
    })
    this.fetching = false
  }
}
</script>
<style >
.item{
  border: 1px solid gray;
  border-radius: 9px;
  height: 180px;
  width: 180px;
  margin-bottom: 10px;
}
</style>
