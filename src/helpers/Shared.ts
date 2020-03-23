import { config } from "../config";
import { Response } from "express";
import nodemailer from "nodemailer";
import userModel from "../Models/userModel";
import { S3 } from "aws-sdk";
import { v1 } from "uuid";


/**
 * Shared class for commonly reused code`
 */
export class GeneralUtils {

    public static async sendEmail(email: IEmail): Promise<void> {

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

    public static sendErrorNotification(error: string): void {
        console.log();
        console.log("Error Start <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log(error);
        console.log("Error End >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        console.log();
        GeneralUtils.sendEmail({
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
    public static escapeHtml(text: string): string {
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

    private static getFileExtension(file: string): string {
        let ext = file.split(".");

        if (ext.length === 1 || (ext[0] === "" && ext.length === 2)) {
            return "";
        }
        return ext.pop();
    }

    public static async UploadFiles(options: IFileUploadConfig): Promise<string[]> {

        let fileSources: string[] = [];
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

        let s3 = new S3({
            "accessKeyId": config.aws.client_id,
            "secretAccessKey": config.aws.client_secret,
            "apiVersion": config.aws.api_version,
            "region": config.aws.region
        });

        //Process all files
        for (let i = 0; i < files.length; i++) {

            try {

                let fileName = `${v1()}.${GeneralUtils.getFileExtension(files[i].name)}`;

                let fileParams = {
                    "Bucket": config.aws.bucket,
                    "Key": fileName,
                    "Body": files[i].data,
                    "ContentType": files[i].mimetype,
                    "ACL": "public-read"
                };

                await s3.upload(fileParams).promise();

                //add to the results
                fileSources.push(fileName);

            } catch (err) {
                console.log(err);
            }
        }

        return fileSources;
    }

    public static DeactivateFiles(files: string[]) : void{

        let s3 = new S3({
            "accessKeyId": config.aws.client_id,
            "secretAccessKey": config.aws.client_secret,
            "apiVersion": config.aws.api_version,
            "region": config.aws.region
        });

        files.forEach(async (item) => {
            let fileParams = {
                "Bucket": config.aws.bucket,
                "Key": item
            }

            await s3.deleteObject(fileParams).promise();
        })

    }

    public static GetLoggedInUserId(res: Response): string {
        return res.locals.authentication.id;
    }

    public static GetLoggedInUserName(res: Response): string {
        return res.locals.authentication.given_name + " " + res.locals.authentication.family_name;
    }

    public static async GetNameById(id: string): Promise<string> {

        let userData: any = await userModel.findById(id);

        if (!userData) {
            return "";
        }

        return userData.firstname + " " + userData.lastname;
    }

    public static SetModelError(res: Response): void {
        //TODO
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