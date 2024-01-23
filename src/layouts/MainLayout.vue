<template>
  <q-layout view="lHh Lpr lFf" v-if="type">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title>
          PMS, {{ user }}
        </q-toolbar-title>
        <div @click="signout">
          <q-icon name="logout" size="24px" />
          Logout
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-1">
      <q-list v-if="type">
        <q-item-label header class="text-grey-8">
          Menu for {{ user }}
        </q-item-label>
        <q-item clickable :to="i.link" v-for="(i, l) in filteredLinks" :key="l">
          <q-item-section v-if="i.icon" avatar>
            <q-icon :name="i.icon" />
          </q-item-section>

          <q-item-section>
            <q-item-label>{{ i.title }}</q-item-label>
            <q-item-label caption>
              {{ i.caption }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view v-if="type" />
    </q-page-container>
  </q-layout>
</template>

<script>
import { app } from 'src/boot/firebase';

export default {
  name: 'MainLayout',
  data() {
    return {
      leftDrawerOpen: false,
      user: null,
      type: null,
      linksData: [
        {
          title: 'Home',
          icon: 'home',
          link: '/'
        },
        {
          title: 'Inventory',
          icon: 'inventory',
          link: '/inventory'
        },
        {
          title: 'POS',
          icon: 'point_of_sale',
          link: '/sales'
        },
        {
          title: 'Orders',
          icon: 'orders',
          link: '/orders'
        },
      ]
    }
  },
  computed: {
    filteredLinks() {
      const userType = this.type ? this.type.toLowerCase() : '';

      if (userType === 'admin') {
        return this.linksData;
      } else {
        const filteredLinks = this.linksData.filter(link => link.link.includes(`/${userType}`));

        // Check if userType includes 'sales' and add 'Orders' link
        if (userType.includes('sales')) {
          filteredLinks.push({
            title: 'Orders',
            icon: 'inventory_2',
            link: '/orders'
          });
        }

        return filteredLinks;
      }
    }

  },
  methods: {
    signout() {
      app.auth().signOut()
    }
  },
  created() {
    const currentUser = app.auth().currentUser;
    if (currentUser) {
      this.user = currentUser.displayName;
      app.firestore().collection("users").doc(currentUser.uid).get().then(u => {
        this.type = u.data().account_type;
      });
    }
  }
}
</script>
