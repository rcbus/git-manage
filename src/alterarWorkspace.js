require('dotenv/config')

const s = require('shelljs')
const f = require('../functions')
const v = require('../version-app')
const fs = require('fs');

module.exports = {
    head(){
        f.clear()
        f.banner([
            v.appName() + ' - VERSÃO ' + v.current(),
            'ALTERAR WORKSPACE',
            '<br>',
            'ATUAL: ' + process.env.WORKSPACE_PATH,
            'USUARIO: ' + process.env.USER_NAME
        ]
        ,'c',true)
    },
    exec(){
        this.head()

        var content = ''
        f.question(['Informe o caminho do seu workspace','(Ex.: /home/user/documents/www/):','<br>','0 - VOLTAR'],(answer) => {
            if(answer=='0'){
                const menu = require('./menu')
                menu.exec()
            }else{
                var pos = answer.lastIndexOf('/')
                if(pos==-1 || pos!=(f.strlen(answer)-1)){
                    answer = answer + '/'
                }
                if(answer.indexOf('\\')!=-1){
                    answer = answer.replace(/\\/g, '/')
                }
                content = 'WORKSPACE_PATH=' + answer + '\n'
                f.question(['Informe o seu nome:','<br>','0 - VOLTAR'],(answer) => {
                    if(answer=='0'){
                        const menu = require('./menu')
                        menu.exec()
                    }else{
                        content = content + 'USER_NAME=' + f.strlower(f.clearString(answer,true,true)) + '\n'
                        f.question(['Informe a tecnologia:','<br>','0 - VOLTAR'],(answer) => {
                            if(answer=='0'){
                                const menu = require('./menu')
                                menu.exec()
                            }else{
                                content = content + 'TECH=' + f.strlower(f.clearString(answer,true,true)) + '\n'
                                const data = new Uint8Array(Buffer.from(content));
                                fs.writeFile('./.env', data, (error) => {
                                    if(error){
                                        f.banner('Houve uma falha: ' + error + '!')
                                    }else{
                                        f.banner(['Workspace salvo com sucesso!','Execute "node index" novamente.'])
                                        s.exit(1)
                                    }
                                });
                            }
                        });
                    }
                });
            }
        })
    }
}