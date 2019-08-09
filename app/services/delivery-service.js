"use strict"
const _ = require("lodash")
const nodemailer  = require("nodemailer")
const mailgun     = require("nodemailer-mailgun-transport")

class DeliveryService {
  constructor(logger, config, {models}) {
    const {mail, twilio} = config
    this.logger = logger
    this.models = models

    if(!_.isEmpty(mail.auth.api_key)) {
      this.mailDefaults = mail.defaults
      this.emailTransport = nodemailer.createTransport(mailgun({auth: mail.auth}), mail.defaults)
    }
  }
  async sendMail({address, subject, text, html}) {
    if(this.emailTransport) {
      //address {name: "Ruslan", address: "ruslan@mail.com"}
      await this.emailTransport.sendMail({
        ...this.mailDefaults,
        to: address,
        subject: subject,
        text: text,
        html: html
      })
    }
  }

  async process({type, ...data}) {
    switch(type) {
      case "email":
        await this.sendMail(data)
      break
    }
  }
}

module.exports = DeliveryService
