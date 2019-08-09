"use strict"
const _         = require("lodash")


class MailerService {
  constructor(logger, config, {models, services, jobs}) {
    let {application: {public_uri}} = config

    this.logger = logger
    this.models = models
    this.services =  services
    this.jobs     = jobs
    this.public_uri = public_uri
  }
  async sendMail(address, subject, body) {
    if(process.env.NODE_ENV === "development") {
      this.logger.debug(address, subject, body)
    } else {
      await this.jobs.queues.delivery.add({type: "email", address, subject, text: body})
    }
    return true
  }

  async getTemplate(name, locale, params) {
    return ({
      title: name,
      body: "Text"
    })
    // require template
    // const {EmailTemplate} = this.models
    // let template = await EmailTemplate.findOne({where: {name, locale}})
    // return ({
    //   title: _.template(template.subject, {interpolate: /{{([\s\S]+?)}}/g})(params),
    //   body: _.template(template.body, {interpolate: /{{([\s\S]+?)}}/g})(params),
    // })
  }
  async sendUserRegisterEmail(user, authToken) {
    const {title, body} = await this.getTemplate("userRegister", user.locale, {
        name: user.name,
        url: this.public_uri,
        authToken
    })
    return await this.sendMail(user.email, title, body)
  }
  async sendPasswordForgotEmail(user, authToken) {
    const {title, body} = await this.getTemplate("passwordForgot", user.locale, {
        name: user.name,
        url: this.public_uri,
        authToken
    })
    return await this.sendMail(user.email, title, body)
  }

}

module.exports = MailerService
