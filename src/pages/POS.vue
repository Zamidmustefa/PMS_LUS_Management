<template>
  <q-page class="bg-dark text-white">
    <div class="text-center  q-pt-lg">
      <q-input v-model="searchText" class="q-ma-md" type="text" label="Search" dark outlined />
    </div>
    <div>
      <q-card dark bordered class="q-ma-md" v-for="(p, k) in filProducts" :key="k"
        style="display: flex; justify-content: space-between;">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ p.name }}</div>
          <b>Price:</b> {{ p.price }} <b>Units:</b> {{ p.i }} <br> <b>Sales:</b>Rs. {{ p.sales }}
        </q-card-section>
        <q-card-section>
          <q-btn round color="red-6" class="q-mr-sm" ripple icon="add"
            @click="updateProduct(p.id, 'add', p.i, p.price, p.sales, p.profit, p.profit_E, p.sold_items)" />
          <q-btn round color="primary" icon="remove" ripple
            @click="updateProduct(p.id, 'minus', p.i, p.price, p.sales, p.profit, p.profit_E, p.sold_items)" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { app } from 'src/boot/firebase'
import moment from 'moment'
export default {
  name: 'Inventory',
  data() {
    return {
      new_i_model: false,
      searchText: '',
      products: [],
      filProducts: []
    }
  },
  watch: {
    searchText(val) {
      console.log(val);
      if (val.length > 0) {
        this.filProducts = this.products.filter(x => x.name.toLowerCase().includes(val.toLowerCase()));
      } else {
        this.filProducts = this.products;
      }
      console.log(this.filProducts);
    }
  },
  methods: {
    updateProduct(id, t, i, p, s, pr, pe, s_i) {
      console.log(pr, pe);
      if (t == 'add') {
        app.firestore().collection("inventory").doc(id).update({
          sales: i != 0 ? Number(s) + Number(p) : Number(s),
          i: i == 0 ? 0 : --i,
          sold_items: i == 0 ? s_i : s_i + 1,
        })
      } if (t == 'minus') {
        app.firestore().collection("inventory").doc(id).update({
          i: s > 0 ? ++i : i,
          sales: s > 0 ? Number(s) - Number(p) : Number(s),
          sold_items: s == 0 ? s_i : s_i - 1,
        })
      }
    },
  },
  created() {
    app.firestore().collection("inventory").onSnapshot(docs => {
      this.products = []
      docs.forEach(doc => {
        this.products.push({ ...doc.data(), id: doc.id })
      });
      this.filProducts = this.products
    })
    console.log(this.products);
  }
}
</script>
