const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const https = require('https');

const details = require("./details.json");

const app = express();
var port = process.env.PORT || 8080;

const apiUrl = 'https://3fc9a07bff71932e4986621c9145e8e4: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@mindjackets.myshopify.com';
const assetsEndpoint = '/admin/api/2020-04/themes/81246584897/assets.json';

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({limit: '50mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.listen(port, () => {
    console.log("The server started on port " + port);
});

app.get("/", (req, res) => {
   res.send('hello world');
});

app.get("/getassets", (req, res) => {
    console.log('end point hit');
    https.get(apiUrl + assetsEndpoint, (resp) => {
        let data = '';

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });

        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            res.send(data);
        });

    }).on("error", (err) => {
        console.log("Error: " + err.message);
        res.send(err);
    });
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