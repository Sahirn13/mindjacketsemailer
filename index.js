const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const details = require("./details.json");

const app = express();
var port = process.env.PORT || 8080;
app.use(cors({ origin: "*" }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.listen(port, () => {
    console.log("The server started on port " + port);
});


app.post("/sendmail", (req, res) => {
    let data = req.body;
    sendMail(data, info => {
        res.send(info);
    });
});

async function sendMail(data, callback) {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'reem@mind-jackets.com',
            pass: 'Mind2020$'
        }
    });

    let mailOptions = {
        from: '"Mind Jackets"<reem.mind-jackets.com>',
        to: 'reem@mind-jackets.com',
        subject: 'Jacket Design Request', // Subject line
        html: `<h1>Name: ${data.name}</h1><br>
               <h1>Email: ${data.email}</h1><br>
               <h1>Phone: ${data.number}</h1><br>`,
        attachments : [
            {
                filename: 'front.svg',
                path: data.frontUrl
            },
            {
                filename: 'back.svg',
                path: data.backUrl
            },
            {
                filename: 'left.svg',
                path: data.leftUrl
            },
            {
                filename: 'right.svg',
                path: data.rightUrl
            },
            {
                filename: 'inner.svg',
                path: data.innerUrl
            },
            {
                filename: 'back-image-attachment.jpeg',
                path: data.backSourceImage
            },
            {
                filename: 'front-right-image.jpeg',
                path: data.frontRightSourceImage
            },
            {
                filename: 'front-left-image.jpeg',
                path: data.frontLeftSourceImage
            },
            {
                filename: 'right-sleeve-image.jpeg',
                path: data.rightSleeveSourceImage
            },
            {
                filename: 'left-sleeve-image.jpeg',
                path: data.leftSleeveSourceImage
            }
        ]
    };


    // send mail with defined transport object
    let info = await transporter.sendMail(mailOptions);

    callback(info);
}