import nodemailer from "nodemailer";
import { config } from "../config";

/**
 * Shared class for commonly reused code`
 */
export class Shared {

    static async sendEmail(email: IEmail) {

        let account = { user: "", pass: "" }
        if (config.server.enviroment === "development") {
            account = await nodemailer.createTestAccount();
        } else {
            account = {
                user: config.email.username,
                pass: config.email.password
            }
        }

        let transporter = nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user,
                pass: account.pass
            }
        });

        // send mail with defined transport object
        let info = await transporter.sendMail({
            from: config.email.from,
            to: email.email,
            subject: email.subject,
            html: email.body
        });

        if (config.server.enviroment === "development") {
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }

    }

    /**
     * Method designed to escape html in a string
     * @param text
     * @returns an escaped string
     */
    static escapeHtml(text: string): string {
        let map: any = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return text.replace(/[&<>"']/g, function (m) {
            return map[m];
        });
    }
}


export interface IEmail {
    email: string;
    subject: string;
    body: string;
}