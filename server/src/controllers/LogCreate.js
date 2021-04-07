const { Log } = require('../models')

module.exports.post = async (userId, nomUrl, desParams, desBody, desErro) => {
  try {
    console.log("chegou no cria log")
    
    log = {
      id_user: userId,
      nom_url: nomUrl,
      nom_erro: desErro.name,
      des_params: JSON.stringify(desParams),
      des_body: JSON.stringify(desBody),
      des_erro: JSON.stringify(desErro)
    }
    await Log.create(log)
  } catch (err) {
    console.log(err)
  }
}