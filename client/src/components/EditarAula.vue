<template>
  <v-layout ml-16 mr-16 mt-8>
    <v-flex>
      <panel title="Editar aula">
        <v-text-field label="Nome*" v-model="nom_aula" required :rules="[required]"></v-text-field>
        <v-text-field label="Descrição*" v-model="des_aula" required :rules="[required]"></v-text-field>
        <v-text-field label="Link vídeo*" v-model="src_video" required :rules="[required]"></v-text-field>
        <v-text-field label="Ordem*" v-model="seq_ordem" required :rules="[required]"></v-text-field>
        <div id="selector"><div class="checkbox"><v-checkbox v-model="ind_visivel" label="Visível"></v-checkbox></div></div>
        <div class="danger-alert" v-if="error">{{error}}</div>
        <v-btn class="green accent-3" @click="create" dark>Salvar</v-btn>
        <v-btn class="red" @click="navigateTo({name: 'editar-modulo', params: {cursoId: cursoId, moduloId: moduloId}})" dark>Cancelar</v-btn>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Panel from '@/components/Panel'
import AulasService from '@/services/AulasService'
export default {
  data () {
    return {
      aula: {},
      userId: null,
      token: this.$store.state.token,
      cursoId: null,
      moduloId: null,
      nom_aula: null,
      des_aula: null,
      src_video: null,
      seq_ordem: null,
      ind_visivel: null,
      error: null,
      required: (value) => !!value || 'Required.'
    }
  },
  async mounted () {
    this.userId = this.$store.state.userId
    this.cursoId = this.$store.state.route.params.cursoId
    this.moduloId = this.$store.state.route.params.moduloId
    this.aulaId = this.$store.state.route.params.aulaId
    this.aula = (await AulasService.show(this.userId, this.aulaId, this.token)).data
    this.nom_aula = this.aula.nom_aula
    this.des_aula = this.aula.des_aula
    this.src_video = this.aula.src_video
    this.seq_ordem = this.aula.seq_ordem
    var visivel = true
    if (this.aula.ind_visivel === 'N') {
      visivel = false
    }
    this.ind_visivel = visivel
  },
  methods: {
    async create () {
      this.error = null
      var visivel = 'N'
      if (this.ind_visivel) {
        visivel = 'S'
      }
      const aula = {
        id: this.$store.state.route.params.aulaId,
        nom_aula: this.nom_aula,
        des_aula: this.des_aula,
        src_video: this.src_video,
        seq_ordem: this.seq_ordem,
        id_modulo: this.moduloId,
        ind_visivel: visivel
      }
      const areAllFieldsFilledIn = Object
        .keys(aula)
        .every(key => !!aula[key])
      if (!areAllFieldsFilledIn) {
        this.error = 'Informe todos os campos obrigatórios'
        return
      }
      try {
        await AulasService.put(this.userId, aula, this.token)
        this.$router.push({name: 'editar-modulo', params: {cursoId: this.cursoId, moduloId: this.moduloId}})
      } catch (err) {
        console.log(err)
      }
    },
    navigateTo (route) {
      this.$router.push(route)
    }
  },
  components: {
    Panel
  }
}
</script>
<style scoped>
</style>
