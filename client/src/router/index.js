import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Register from '@/components/Register'
import Login from '@/components/Login'
import Curso from '@/components/Curso'
import Perfil from '@/components/Perfil'
import CriarCurso from '@/components/CriarCurso'
import EditarCurso from '@/components/EditarCurso'
import ViewCurso from '@/components/ViewCurso'
import CriarModulo from '@/components/CriarModulo'
import EditarModulo from '@/components/EditarModulo'
import CriarAula from '@/components/CriarAula'
import EditarAula from '@/components/EditarAula'
import ViewAula from '@/components/ViewAula'
import HomeAluno from '@/components/HomeAluno'
import HomeVisitante from '@/components/HomeVisitante'
import Log from '@/components/Log'
import ViewLog from '@/components/ViewLog'
import Permissoes from '@/components/Permissoes'
import Auditoria from '@/components/Auditoria'
import ViewAuditoria from '@/components/ViewAuditoria'
import VueEllipseProgress from 'vue-ellipse-progress'
import CriarAssinatura from '@/components/CriarAssinatura'
import Assinatura from '@/components/Assinatura'
import EditarAssinatura from '@/components/EditarAssinatura'
import AssinaturaUsuario from '@/components/AssinaturaUsuario'
import ForgotPassword from '@/components/ForgotPassword'
import Pagamento from '@/components/Pagamento'
import UsuarioCurso from '@/components/UsuarioCurso'

Vue.use(VueEllipseProgress)
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: HelloWorld
    },
    {
      path: '/home/aluno',
      name: 'home-aluno',
      component: HomeAluno
    },
    {
      path: '/home/visitante',
      name: 'home-visitante',
      component: HomeVisitante
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/cursos',
      name: 'cursos',
      component: Curso
    },
    {
      path: '/criar/curso',
      name: 'criar-curso',
      component: CriarCurso
    },
    {
      path: '/editar/curso',
      name: 'editar-curso',
      component: EditarCurso
    },
    {
      path: '/view/curso',
      name: 'view-curso',
      component: ViewCurso
    },
    {
      path: '/criar/modulo',
      name: 'criar-modulo',
      component: CriarModulo
    },
    {
      path: '/editar/modulo',
      name: 'editar-modulo',
      component: EditarModulo
    },
    {
      path: '/criar/aula',
      name: 'criar-aula',
      component: CriarAula
    },
    {
      path: '/editar/aula',
      name: 'editar-aula',
      component: EditarAula
    },
    {
      path: '/view/aula',
      name: 'view-aula',
      component: ViewAula
    },
    {
      path: '/perfil',
      name: 'perfil',
      component: Perfil
    },
    {
      path: '/log',
      name: 'log',
      component: Log
    },
    {
      path: '/view/log',
      name: 'view-log',
      component: ViewLog
    },
    {
      path: '/permissoes',
      name: 'permissoes',
      component: Permissoes
    },
    {
      path: '/auditoria',
      name: 'auditoria',
      component: Auditoria
    },
    {
      path: '/view/auditoria',
      name: 'view-auditoria',
      component: ViewAuditoria
    },
    {
      path: '/criar/assinatura',
      name: 'criar-assinatura',
      component: CriarAssinatura
    },
    {
      path: '/assinatura',
      name: 'assinatura',
      component: Assinatura
    },
    {
      path: '/editar/assinatura',
      name: 'editar-assinatura',
      component: EditarAssinatura
    },
    {
      path: '/assinatura/usuario',
      name: 'assinatura-usuario',
      component: AssinaturaUsuario
    },
    {
      path: '/forgot',
      name: 'forgot',
      component: ForgotPassword
    },
    {
      path: '/pagamento',
      name: 'pagamento',
      component: Pagamento
    },
    {
      path: '/usuario/curso',
      name: 'usuario-curso',
      component: UsuarioCurso
    }
  ]
})
