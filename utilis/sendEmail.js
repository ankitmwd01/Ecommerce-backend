import nodemailer from "nodemailer";
const sendMail = async (email, subject, text) => {    
    try {
        const transport = nodemailer.createTransport({
            host: process.env.USER_HOST,
            service: process.env.USER_SERVICE,
            port:Number(process.env.USER_PORT),
            secure: Boolean(process.env.USER_SECURE),
            auth: {
                user:process.env.ADMIN_EMAIL ,
                pass:process.env.PASSWORD,
            }
        });
        await transport.sendMail({
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: subject,
            text: text,
        }).then(() => console.log("Send Successfully"))
    }
    catch (e) {
        console.log(e);
    }
};
export default sendMail;