import envConfig from '@/config/env.config';
import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
interface IEmailOptions {
  reciverEmail: string;
  subject: string;
  body: string;
}
const sendEmail = async (options: IEmailOptions) => {
  const transporter = nodemailer.createTransport({
    host: envConfig.smtp_host,
    port: envConfig.smtp_port,
    secure: true,
    service: envConfig.smtp_service,
    auth: {
      user: envConfig.smtp_mail,
      pass: envConfig.smtp_password,
    },
  } as SMTPTransport.Options);
  const mailOptions = {
    from: envConfig.smtp_mail,
    to: options.reciverEmail,
    subject: options.subject,
    html: options.body,
  };

  await transporter.sendMail(mailOptions);
};

export default sendEmail;
