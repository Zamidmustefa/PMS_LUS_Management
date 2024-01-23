<template>
  <q-page class="bg-dark text-white">
    <div class="text-center  q-pt-lg">
      <q-btn color="primary" icon="add" label="Add New Item" @click="new_i_model = !new_i_model" />
    </div>
    <div>
      <q-card dark bordered class="q-ma-md" v-for="(p, k) in products" :key="k"
        style="display: flex; justify-content: space-between;">
        <q-card-section>
          <div class="text-subtitle2 q-mb-sm">{{ p.name }}</div>
          <b>Price:</b> {{ p.price }} <b>Units:</b> {{ p.i }}
        </q-card-section>
        <q-card-section>
          <q-btn round color="red-6" class="q-mr-sm" icon="delete" @click="delProduct(p.id)" />
          <q-btn round color="primary" icon="edit" @click="updateProduct(p.id, p)" />
        </q-card-section>
      </q-card>
    </div>
    <q-dialog v-model="new_i_model" persistent>
      <q-card class="bg-accent">
        <q-card-section class="">
          <q-input label-color="primary" v-model="product.name" filled type="text" label="Name" />
          <q-input label-color="primary" class="q-my-md" v-model="product.price" filled type="number" label="Price" />
          <q-input label-color="primary" class="q-my-md" v-model="product.profit" filled type="number" label="Profit" />
          <q-input label-color="primary" v-model="product.i" filled type="number" label="Units" />
        </q-card-section>
        <q-card-section>
          <img v-if="product.image" :src="product.image" width="100%" alt="Product Image" />
          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            style="display: none"
            @change="handleFileChange"
          />
          <q-btn
            color="primary"
            icon="upload"
            label="Upload Image"
            @click="triggerFileInput"
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancel" color="primary" v-close-popup />
          <q-btn flat :label="edit ? 'Update' : 'Add'" color="primary" :loading="loading" @click="addProduct()" />
        </q-card-actions>
      </q-card>
    </q-dialog>s
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
      loading: false,
      edit: false,
      id_u: null,
      product: {
        name: '',
        price: 0,
        i: 0,
        sales: 0,
        profit:  0,
        profit_E: 0,
        sold_items:  0,
        image: null
      },
      products: []
    }
  },
  methods: {
    triggerFileInput() {
      // Programmatically trigger the file input
      this.$refs.fileInput.click();
    },
    handleFileChange(event) {
      const file = event.target.files[0];

      if (file) {
        // Call the uploadImage method from your previous code
        this.uploadImage(file);
      }
    },
    async uploadImage() {
      const fileInput = this.$refs.fileInput; // Assuming you have a file input in your template

      if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const imageName = file.name;
        const storageRef = app.storage().ref();
        const fileRef = storageRef.child(
          `${app.auth().currentUser.uid}/${imageName}`
        );
        await fileRef.put(file);
        let fileURL = await fileRef.getDownloadURL();
        this.product.image = fileURL;
      }
    },
    delProduct(id) {
      app.firestore().collection("inventory").doc(id).delete().then(() => {
        this.products = this.products.filter(x => x.id != id)
      })
    },
    updateProduct(id, p) {
      this.edit = true
      this.product = p
      console.log(id, p);
      this.id_u = id
      this.product.id = null
      this.new_i_model = true
    },
    addProduct() {
      this.loading = true
      if (this.product.name && this.product.price > 0 && this.product.i > 0) {
        console.log(this.edit);
        if (!this.edit) {
          this.product.profit_E = this.product.i
          let add_product = app.firestore().collection("inventory").add({ ...this.product, time_added: moment().unix() })
          add_product.then(doc => {
            console.log(doc);
            this.loading = false
            this.product = {
              name: '',
              price: 0,
              i: 0,
              sales: 0,
              profit: 0,
              profit_E: 0,
              sold_items: 0
            }
            this.new_i_model = false
            this.$q.notify({
              message: 'Product added',
              color: 'green-6',
              icon: 'done'
            })
          }).catch(err => {
            console.log(err);
          })
        }
        if (this.edit) {
          let update_product = app.firestore().collection("inventory").doc(this.id_u).update({ ...this.product, time_updated: moment().unix() })
          update_product.then(() => {
            this.id_u = null
            this.edit = false
            this.loading = false
            this.product = {
              name: '',
              price: 0,
              i: 0,
              sales: 0,
              profit: 0,
              profit_E: 0,
              sold_items: 0
            }
            this.new_i_model = false
            this.$q.notify({
              message: 'Product updated',
              color: 'green-6',
              icon: 'done'
            })
          }).catch(err => {
            console.log(err);
          })
        }

      } else {
        this.loading = false
        this.$q.notify({
          message: 'All fields required, Price & Units should be more than 0',
          color: 'red-6',
          icon: 'error'
        })
      }
    }
  },
  created() {
    app.firestore().collection("inventory").onSnapshot(docs => {
      this.products = []
      docs.forEach(doc => {
        this.products.push({ ...doc.data(), id: doc.id })
      });
    })
    console.log(this.products);
  }
}
</script>
