const express  = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

require('./models/Orcamento'); //importando Orçamento
const Orcamento = mongoose.model('Orcamento');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "X-PINGOTHER ,Content-Type, Authorization");
    app.use(cors());
    next();
});

mongoose.connect('mongodb://localhost:27017/paulo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexão estabelecida com sucesso!');
}).catch((err) => {
    console.log('Falha na conexão com o banco de dados: ' + err);
});

app.post('/orcamento', async (req, res) => {
    await Orcamento.create(req.body, (err) => {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: solicitação de orçamento não enviada com sucesso!"
        })
    })

    var transport = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "0826ca73f98bdc", 
          pass: "733335c2e79f4c", 
        },
    });

    var emailHtml = 'Prezado(a)<br><br> Recebi a solicitação de orçamento.<br><br> Em breve será enviado o orçamento.';
    var emailTexto = 'Prezado(a)\n\n Recebi a solicitação de orçamento.\n\n Em breve será enviado o orçamento.';

    var emailSendInfo = {
        from: 'c491833685-6cea00@inbox.mailtrap.io', // sender address
        to: req.body.email, // list of receivers
        subject: "Recebi a solicitação de orçamento", // Subject line
        text: emailTexto, // plain text body
        html: emailHtml, // html body
    }

    await transport.sendMail(emailSendInfo, function(err) {
        if (err) return res.status(400).json({
            error: true,
            message: "Erro: solicitação de orçamento não enviada com sucesso!"
        });

        return res.json({
            error: false,
            message: "Solicitação de orçamento enviada com sucesso!"
        }); 
    });
})
   
app.listen(8080, () => {
    console.log('Server running in port 8080');
});