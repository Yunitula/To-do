
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import { emailHost, emailPassword, emailPort, emailSecure, emailUsername, tempDir } from 'src/config/config';

@Injectable()
export class MailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'Gmail',
      host: emailHost,
      port: emailPort,
      secure: emailSecure,
      auth: {
        user: emailUsername,
        pass: emailPassword,
      },
    });
  }

  async sendMail({
    to,
    subject,
    tmp,
    context,
  }: {
    to: string;
    subject: string;
    tmp: string;
    context: any;
  }) {
    const source = fs.readFileSync(`${tempDir}/${tmp}.hbs`, 'utf8');
    handlebars.registerHelper('counter', (index) => index + 1);
    handlebars.registerHelper('dateFormat', (date) => date.toDateString());
    const template = handlebars.compile(source);
    const emailContent = {
      from: `"No-Reply" <${emailUsername}>`,
      to: to,
      subject: subject,
      html: template({ ...context }),
    };
    await this.transporter.sendMail(emailContent);
  }
}
