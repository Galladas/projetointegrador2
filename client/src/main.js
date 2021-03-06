// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css'
import { sync } from 'vuex-router-sync'
import store from '@/store/store'
import moment from 'moment'
import VueSimpleAlert from 'vue-simple-alert'
import VueYouTubeEmbed from 'vue-youtube-embed'

// import colors from 'vuetify/lib/util/colors'

Vue.config.productionTip = false

Vue.use(Vuetify)
Vue.use(VueSimpleAlert)
Vue.use(VueYouTubeEmbed)

Vue.filter('formatDate', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm')
  }
})

Vue.filter('formatDate2', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY HH:mm:ss')
  }
})

Vue.filter('nomeUser', function (value) {
  if (value) {
    return value.nom_pessoa || value.email
  } else {
    return 'Desconhecido'
  }
})

Vue.filter('indSimNao', function (value) {
  if (value) {
    if (value === 'S') {
      return 'Sim'
    } else {
      return 'Não'
    }
  }
})

Vue.filter('indUsuario', function (value) {
  if (value) {
    if (value === 'P') {
      return 'Professor'
    } else {
      return 'Aluno'
    }
  }
})

Vue.filter('indAssinatura', function (value) {
  if (value) {
    if (value === 'M') {
      return 'Mensal'
    } else {
      return 'Anual'
    }
  }
})

Vue.filter('toCurrency', function (value) {
  if (typeof value !== 'number') {
    return value
  }
  var formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })
  return formatter.format(value)
})

const opts = {}

export default new Vuetify(opts)

sync(store, router)

/* eslint-disable no-new */
new Vue({
  vuetify: new Vuetify(),
  vuesimplealert: new VueSimpleAlert(),
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
