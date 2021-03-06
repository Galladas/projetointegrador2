<template>
  <v-layout ml-16 mr-16 mt-8>
    <v-flex>
      <panel :title="nom_curso">
        <v-btn v-if="!$store.state.isUserLoggedInProf" slot="newButton" class="blue darken-2" fab ligth small absolute right middle :disabled="!enabledDownloadCertificate" @click="downloadCertificado()">
          <v-icon>file_download</v-icon>
        </v-btn>
        <v-btn v-if="$store.state.isUserLoggedInProf" slot="editButton" class="blue darken-2" fab ligth small absolute right middle @click="navigateTo({name: 'usuario-curso', params: {cursoId: cursoId}})">
          <v-icon>checklist_rtl</v-icon>
        </v-btn>
        <div class="error" v-html="errorCertificado"/>
        <v-textarea label="Descrição*" v-model="des_curso" readonly></v-textarea>
        <v-text-field label="Carga Horária*" v-model="des_carga_horaria" readonly></v-text-field>
      </panel>
      <br>
      <panel title="Modulos" back="false">
        <v-expansion-panels focusable>
          <v-expansion-panel v-for="modulo in modulos" :key="modulo.id">
            <v-expansion-panel-header>{{modulo.nom_modulo}}</v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-container class="grey lighten-5 mb-6">
                <v-row class="fill-height overflow-auto">
                  <v-col class="py-2" :cols="(12/itemsPerRow)" cs12 sm6 md4 lg3 v-for="aula in modulo.Aulas" :key="aula.id" >
                    <v-card class="card fill-height" tile outlined>
                      <v-img class="white--text align-end" :aspect-ratio="16/9" height="200px" :src="aula.src_thumbnail">
                      </v-img>
                      <v-card-title primary-title>
                        <div>
                          {{aula.nom_aula}}
                        </div>
                      </v-card-title>
                      <v-card-actions>
                        <v-btn color="deep-purple" text dark @click="navigateTo({name: 'view-aula', params: {aulaId: aula.id}})">
                          Abrir aula
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import Panel from '@/components/Panel'
import CursosService from '@/services/CursosService'
import UsuarioCursoService from '@/services/UsuarioCursoService'
import ModulosService from '@/services/ModulosService'
import axios from 'axios'
export default {
  data () {
    return {
      curso: {},
      modulos: {},
      usuarioCurso: {},
      cursoId: null,
      userId: null,
      token: this.$store.state.token,
      nom_curso: null,
      des_curso: null,
      des_carga_horaria: null,
      ind_visivel: null,
      errorCertificado: null,
      error: null,
      enabledDownloadCertificate: false,
      required: (value) => !!value || 'Required.'
    }
  },
  async mounted () {
    this.userId = this.$store.state.userId
    if (this.$store.state.route.params.cursoId) {
      this.cursoId = this.$store.state.route.params.cursoId
    } else if (localStorage.cursoId) {
      this.cursoId = localStorage.cursoId
    } else {
      this.navigateTo({name: 'root'})
    }
    this.curso = (await CursosService.show(this.userId, this.cursoId, this.token)).data
    this.modulos = (await ModulosService.view(this.userId, this.cursoId, this.token)).data
    this.usuarioCurso = (await UsuarioCursoService.get(this.userId, this.cursoId, this.token)).data
    if (this.usuarioCurso) {
      this.enabledDownloadCertificate = true
    } else {
      this.enabledDownloadCertificate = false
    }
    this.cursoId = this.curso.id
    this.nom_curso = this.curso.nom_curso
    this.des_curso = this.curso.des_curso
    this.des_carga_horaria = this.curso.des_carga_horaria
    var visivel = true
    if (this.curso.ind_visivel === 'N') {
      visivel = false
    }
    this.ind_visivel = visivel
  },
  components: {
    Panel
  },
  methods: {
    navigateTo (route) {
      this.$router.push(route)
    },
    geraCertificado () {
      alert('Geração de certificados em desenvolvimento. Aguarde!')
    },
    calcRowsPerPage () {
      let container = document.getElementById('container')
      let minItemHeight = 170
      if (container) {
        let containerHeight = parseInt(container.clientHeight, 0)
        this.rpp = Math.floor(containerHeight / minItemHeight)
      } else {
        this.rpp = 4
      }
    },
    created () {
      window.addEventListener('resize', () => {
        this.calcRowsPerPage()
      })
    },
    async downloadCertificado () {
      if (!this.enabledDownloadCertificate) {
        alert('Nenhum professor aprovou sua conclusão do curso. Entre em contato com o suporte!')
      } else {
        axios({
          url: `http://localhost:8080/geraCertificado/${this.userId}/${this.cursoId}`,
          method: 'POST',
          responseType: 'blob'
        }).then((response) => {
          this.errorCertificado = null
          var fileURL = window.URL.createObjectURL(new Blob([response.data]))
          var fileLink = document.createElement('a')
          fileLink.href = fileURL
          fileLink.setAttribute('download', 'certification.pdf')
          document.body.appendChild(fileLink)
          fileLink.click()
        }).catch((error) => {
          this.response = error.response
          this.errorCertificado = 'Ocorreu algum erro na geração do certificado, verifique se seu cadastro está completo na aba PERFIL. Em caso de dúvidas entre em contato com o suporte!'
        })
      }
    }
  },
  computed: {
    numberOfPages () {
      return Math.ceil(this.beers.length / this.ipp)
    },
    rowsPerPage () {
      return this.rpp
    },
    itemsPerRow () {
      switch (this.$vuetify.breakpoint.name) {
        case 'xs': return 1
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 4
        case 'xl': return 4
      }
    },
    ipp () {
      return Math.ceil(this.rowsPerPage * this.itemsPerRow)
    }
  },
  watch: {
    cursoId (cursoId) {
      localStorage.cursoId = cursoId
    }
  }
}
</script>
<style scoped>
</style>
