const routes = [{
        path: '/',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ('layouts/MainLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/Index.vue')
        }]
    },
    {
        path: '/inventory',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ('layouts/MainLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/Inventory.vue')
        }]
    },
    {
        path: '/sales',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ('layouts/MainLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/POS.vue')
        }]
    },
    {
        path: '/orders',
        meta: {
            requiresAuth: true
        },
        component: () =>
            import ('layouts/MainLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/Orders.vue')
        }]
    },
    {
        path: '/login',
        meta: {
            requiresVisitor: true
        },
        component: () =>
            import ('layouts/AuthLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/Login.vue')
        }]
    },
    {
        path: '/register',
        meta: {
            requiresVisitor: true
        },
        component: () =>
            import ('layouts/AuthLayout.vue'),
        children: [{
            path: '',
            component: () =>
                import ('pages/Register.vue')
        }]
    },

    // Always leave this as last one,
    // but you can also remove it
    {
        path: '*',
        component: () =>
            import ('pages/Error404.vue')
    }
]

export default routes