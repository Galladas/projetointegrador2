<template>
  <v-layout ml-16 mr-16 mt-8>
  </v-layout>
</template>

<script>

export default {
  name: 'HelloWorld',
  data () {
    return {
    }
  },
  async mounted () {
    if (this.$store.state.isUserLoggedIn) {
      this.navigateTo({name: 'home-aluno'})
    } else {
      this.navigateTo({name: 'home-visitante'})
    }
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.center {
  margin: 0;
  position: absolute;
  top: 50%;
  left: 50%;
  -ms-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
}
</style>
