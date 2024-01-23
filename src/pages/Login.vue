<template>
    <q-page class="flex flex-center">
        <q-page-container>
            <div class="q-pa-md">
                <q-card style="width: 350px;" class="bg-accent text-white">
                    <q-card-section>
                        <div class="q-gutter-md">
                            <h5 class="q-mb-md q-pa-lg text-center">Login to PMS</h5>
                            <q-input v-model="email" label-color="primary" label="Email" type="email" filled
                                @input="clearError" />
                            <q-input v-model="password" label-color="primary" label="Password"
                                :type="isPwd ? 'password' : 'text'" filled @input="clearError">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        color="primary" @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <q-btn label="Login" color="primary" @click="register" :loading="loading" />
                            <p class=" q-mt-md q-mb-md">Not a user? <a style="text-decoration: none; color: white; font-weight: bold;" @click="$router.push({ path: '/register' })">Register Now!</a></p>
                            <p class="q-mt-md q-mb-md text-negative">{{ errorMessage }}</p>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </q-page-container>
    </q-page>
</template>

<script>
import { app } from 'src/boot/firebase'; // Import your Firebase Authentication instance
export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            account_type: '',
            isPwd: true,
            loading: false,
        };
    },
    methods: {
        clearError() {
            this.errorMessage = '';
        },
        register() {
            if (this.email.length > 5 && this.password.length > 8) {
                this.loading = true
                app.auth().signInWithEmailAndPassword(this.email, this.password)
                    .then(user => {
                        app.firestore().collection("users").doc(app.auth().currentUser.uid).get().then(c => {
                            const userType = c.data().account_type ? c.data().account_type.toLowerCase() : '';
                            if (userType === 'admin') {
                                this.$router.push('/');
                            } else {
                                this.$router.push(`/${userType}`);
                            }
                            this.loading = false
                        })
                    })
                    .catch((error) => {
                        this.loading = false
                        // Handle registration error
                        this.errorMessage = error.message;
                    });
            } else {
                this.$q.notify({
                    message: 'All fields required, Password should be more than 8 char',
                    color: 'red-6',
                    icon: 'error'
                })
            }
        },
    },
};
</script>
