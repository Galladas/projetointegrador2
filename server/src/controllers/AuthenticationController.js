const { User } = require('../models')
const jwt = require('jsonwebtoken')
const config = require('../config/config')
const LogCreate = require('../core/LogCreate')
const AuditCreate = require('../core/AuditCreate')
const SendMail = require('../core/SendMail')
const crypto = require('crypto')

function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7
  return jwt.sign(user, config.authentication.jwtSecret, {
    expiresIn: ONE_WEEK
  })
}

module.exports = {
  async register(req, res) {
    try {
      const user = await User.create(req.body)
      if (user.id === 1) {
        await User.update(
          {
            ind_admin: 'S',
            ind_usuario: 'S'
          },
          {
            where: {
              id: user.id
            }
          })
      }
      const userJson = user.toJSON()
      await AuditCreate.createAudit(null, user, "user", "CREATE", req.headers.userid, {});
      await SendMail.Enviar(req.body.email, 'Parabéns, bem vindo ao Educare', `Seu e-mail foi cadastrado com sucesso no educare!`);  
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      LogCreate.post(null, '/registerAuthentication', req.params, req.body, err)
      res.status(400).send({
        error: 'A conta de e-mail já está em uso!'
      })
    }
  },
  async new(req, res) {
    try {
      const user = await User.create(req.body)
      //const userJson = user.toJSON()
      res.send(user)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/newAuthentication', req.params, req.body, err)
      res.status(400).send({
        error: 'A conta de e-mail já está em uso!'
      })
    }
  },
  async put(req, res) {
    try {
      const prevUser = await User.findOne({
        where: {
          id: req.params.userId
        }
      })
      const user = await User.update(
        {
          nom_pessoa: req.body.nom_pessoa,
          num_cpf: req.body.num_cpf
        },
        {
          where: {
            id: req.params.userId
          }
        })
      await AuditCreate.createAudit(prevUser, user, "user", "UPDATE", req.headers.userid, {});        
      res.send(user)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/putAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao salvar usuário'
      })
    }
  },
  async index(req, res) {
    try {
      const users = await User.findAll({
        limit: 50
      })
      res.send(users)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/indexAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao buscar a lista de usuários'
      })
    }
  },
  async view(req, res) {
    try {
      const users = await User.findAll({
        where: [{
          ind_admin: 'N'
        }],
        order: [['ind_usuario', 'desc']],
        limit: 50,
      })
      res.send(users)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/viewAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao buscar a lista de usuários'
      })
    }
  },
  async permission(req, res) {
    try {
      console.log('permissao chegou')
      console.log(req.body.id.userId)
      const user = await User.findOne({
        where: {
          id: req.body.id.userId
        }
      })
      console.log(user)
      var tip_usuario = 'P'
      if (user.ind_usuario === 'P') {
        tip_usuario = 'A'
      }
      const u = await User.update(
        {
          ind_usuario: tip_usuario
        },
        {
          where: {
            id: req.body.id.userId
          }
        })
      res.send(u)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/permissionAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao alterar permissao'
      })
    }
  },
  async show(req, res) {
    try {
      const user = await User.findOne({
        where: {
          id: req.params.userId
        }
      })
      res.send(user)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/showAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao buscar o user'
      })
    }
  },
  async login(req, res) {
    try {
      const { email, password } = req.body
      const user = await User.findOne({
        where: {
          email: email
        }
      })
      console.log(user.toJSON())
      if (!user) {
        return res.status(403).send({
          error: 'Usuário inválido!'
        })
      }
      const isPasswordValid = user.comparePassword(password)
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        return res.status(403).send({
          error: 'Senha inválida!'
        })
      }
      const userJson = user.toJSON()
      res.send({
        user: userJson,
        token: jwtSignUser(userJson)
      })
    } catch (err) {
      console.log('erro login')
      LogCreate.post(null, '/loginAuthentication', req.params, req.body, err)
      console.log(err)
      res.status(500).send({
        error: 'Ocorreu um erro ao tentar logar'
      })
    }
  },
  async changePassword(req, res) {
    try {
      const prevUser = await User.findOne({
        where: {
          id: req.body.id
        }
      })
      if (req.body.password != req.body.password2) {
        return res.status(403).send({
          error: 'Senhas diferem. Verique!'
        })
      }
      const user = await User.update(
        {
          password: prevUser.senhaCriptografada(req.body.password)
        },
        { 
          individualHooks: true,
          where: {
            id: req.body.id
          }
        })
      await AuditCreate.createAudit(prevUser, user, "user", "CHANGE", req.headers.userid, {});      
      await SendMail.Enviar(prevUser.email, 'Sua senha foi alterada', `Caso você não solicitou esta alteração, entre em contato com o suporte!`);  
      res.send(user)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/putChangePassword', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao alterar senha do usuário'
      })
    }
  },
  async forgot(req, res) {
    try {
      const prevUser = await User.findOne({
        where: {
          email: req.params.email
        }
      })
      if (!prevUser) {
        return res.status(403).send({
          error: 'Usuário inválido!'
        })
      }
      const hash = prevUser.Id + crypto.randomBytes(12).toString('hex');
      const user = await User.update(
        {
          reset_password_token: hash,
          reset_password_date: Date.Now() + 3600000
        },
        {
          where: {
            id: prevUser.id
          }
        })
      await AuditCreate.createAudit(prevUser, user, "user", "FORGOT", req.headers.userid, {});       
      await SendMail.EnviarEmail(prevUser.email, 'Solicitação de alteração de senha', `Nova senha para acessar a conta e realizar a alteração é: !` + hash);  
      res.send(1)
    } catch (err) {
      LogCreate.post(req.headers.userid, '/showAuthentication', req.params, req.body, err)
      res.status(500).send({
        error: 'Ocorreu um erro ao buscar o user'
      })
    }
  }
}
