import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import { google } from 'googleapis';

dotenv.config();
const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
    const oauth2Client = new OAuth2(
        process.env.CLIENT_ID,
        process.env.CLIENT_SECRET,
        "https://developers.google.com/oauthplayground"
    );
    
    oauth2Client.setCredentials({
        refresh_token: process.env.REFRESH_TOKEN
    });
    console.log(oauth2Client);

    const accessToken = await new Promise((resolve, reject) => {
        oauth2Client.getAccessToken((err, token) => {
            if (err) {
                reject('Failed to create access token.');
            }
            resolve(token);
        });
    })
    .then(resolve => console.log('Got AccessToken!'))
    .catch(reject => console.log(reject));
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: process.env.EMAIL,
            accessToken: accessToken,
            clientId: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            refreshToken: process.env.REFRESH_TOKEN
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    return transporter;
}

const sendMail = async (emailOptions) => {
    let emailTransporter = await createTransporter();
    await emailTransporter.sendMail(emailOptions);
}

const get_html_verify = (link) => `
    <div style="font-size: 20px;">
        Click this <a href="${link}">link</a> to verify your account.
    </div>
`;

const get_html_reset_password = (link) => `
    <div style="font-size: 20px;">
        Click this <a href="${link}">link</a> to reset your password.
    </div>
`;

export default sendMail;
export { get_html_reset_password, get_html_verify };

