import nodemailer from "nodemailer";
import { config } from "../config";
import fileModel from "../Models/fileModel";

/**
 * Shared class for commonly reused code`
 */
export class Shared {

    static async sendEmail(email: IEmail): Promise<void> {

        let account = { user: "", pass: "" }

        if (config.server.environment === "development") {
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
            to: email.to,
            subject: email.subject,
            html: email.body
        });

        if (config.server.environment === "development") {
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        }
    }

    static sendErrorNotification(error: string): void {
        Shared.sendEmail({
            to: [config.email.errorNotificationEmail],
            subject: "Error in ThatOneSpot",
            body: error
        });
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

    static getFileExtension(file: string): string {
        let ext = file.split(".");

        if (ext.length === 1 || (ext[0] === "" && ext.length === 2)) {
            return "";
        }
        return ext.pop();
    }

    static async UploadFiles(options: IFileUploadConfig): Promise<string[]> {

        let resultIds: string[] = [];
        let files: any[] = [];

        //make sure we always have an array
        if (!Array.isArray(options.files)) {
            //means we have only 1 file
            files.push(options.files);
        } else {
            files = options.files;
        }

        //validate file count
        if (options.limit < files.length) {
            throw new Error(`Invalid file amount. Expected a maximum of ${options.limit} files but recieved ${files.length}`);
        }

        //check each files type
        for (let i = 0; i < files.length; i++) {
            if (!options.accept.includes(files[i].mimetype)) {
                throw new Error(`File type of ${files[i].mimetype} is not allowed.`);
            }
        }

        //Process all files
        for (let i = 0; i < files.length; i++) {

            //create db object to track file
            let newFile = new fileModel({
                name: files[i].name,
                isActive: true,
                CreatedOn: Date.now()
            });

            try {
                let filedata = await newFile.save();

                //get extension
                let fileName = `${filedata._id}.${Shared.getFileExtension(files[i].name)}`;

                //add to the results
                resultIds.push(fileName);

                //move and rename file
                files[i].mv(`${config.path}/public/uploads/${fileName}`, (err1: any) => {
                    if (err1) throw err1;
                });

            } catch (err) {
                //do stuff here cuz save failed. Probably just pass on the exception
            }
        }

        return resultIds;
    }

    static async DeactivateFiles(files: string[]): Promise<void> {
        if (files.length > 0) {

            await fileModel.updateMany(
                {
                    _id: {
                        $in: files.filter(x => typeof x == "string").map(x => x.split(".")[0])
                    }
                },
                {
                    $set: {
                        isActive: false
                    }
                });
        }
    }
}


interface IFileUploadConfig {
    files: any,

    limit: number,

    accept: string[]
}

export interface IEmail {
    to: string[];
    subject: string;
    body: string;
}