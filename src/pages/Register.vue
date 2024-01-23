<template>
    <q-page class="flex flex-center">
        <q-page-container>
            <div class="q-pa-md">
                <q-card style="width: 350px;" class="bg-accent text-white">
                    <q-card-section>
                        <div class="q-gutter-md">
                            <h5 class="q-mb-md q-pa-lg text-center">Register for PMS</h5>
                            <q-input v-model="email" label-color="primary" label="Email" type="email" filled
                                @input="clearError" />
                            <q-input v-model="user_name" label-color="primary" label="Name" type="text" filled />
                            <q-input v-model="password" label-color="primary" label="Password"
                                :type="isPwd ? 'password' : 'text'" filled @input="clearError">
                                <template v-slot:append>
                                    <q-icon :name="isPwd ? 'visibility_off' : 'visibility'" class="cursor-pointer"
                                        color="primary" @click="isPwd = !isPwd" />
                                </template>
                            </q-input>
                            <q-select v-model="account_type"  label-color="primary"
                                :options="['Admin', 'Inventory', 'Sales']" label="Account Type"
                                filled />
                            <q-btn label="Register" color="primary" @click="register" :loading="loading"  />
                            <p class=" q-mt-md q-mb-md text-negative">{{ errorMessage }}</p>
                        </div>
                                                    <p class=" q-mt-md q-mb-md">Already a user? <a style="text-decoration: none; color: white; font-weight: bold;" @click="$router.push({path : '/login'})">Login!</a></p>
                    </q-card-section>
                </q-card>
            </div>
        </q-page-container>
    </q-page>
</template>

<script>
import { app } from 'src/boot/firebase'; // Import your Firebase Authentication instance
import moment from 'moment'
export default {
    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
            account_type: '',
            user_name: '',
            isPwd: true,
            loading: false,
        };
    },
    methods: {
        clearError() {
            this.errorMessage = '';
        },
        register() {
            if (this.email.length > 5 && this.password.length > 6 && this.account_type.length > 3 && this.user_name.length > 4) {
                this.loading = true
                app.auth().createUserWithEmailAndPassword(this.email, this.password)
                    .then(user => {
                        console.log(user);
                        app.auth().currentUser.updateProfile({
                            displayName: this.user_name
                        })
                        app.firestore().collection("users").doc(user.user.uid).set({
                            email: this.email,
                            user_name: this.user_name,
                            account_type: this.account_type,
                            created_at: moment().unix()
                        }).then(() => {
                            const userType = account_type ? account_type.toLowerCase() : '';
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
            }else{
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
