require('dotenv/config')

const s = require('shelljs')
const f = require('./functions')
const v = require('./version-app')
const fs = require('fs');

const menu = require('./src/menu')

f.clear()

fs.access('./.env', fs.constants.F_OK, (error) => {
    f.banner('BEM VINDO AO ' + v.appName() + ' - VERSÃO ' + v.current(),'c',true)
    f.br()
    if(error){
        var content = ''
        f.question(['Informe o caminho do seu workspace','(Ex.: /home/user/documents/www/):'],(answer) => {
            var pos = answer.lastIndexOf('/')
            if(pos==-1 || pos!=(f.strlen(answer)-1)){
                answer = answer + '/'
            }
            if(answer.indexOf('\\')!=-1){
                answer = answer.replace(/\\/g, '/')
            }
            content = 'WORKSPACE_PATH=' + answer + '\n'
            f.question(['Informe o seu nome:'],(answer) => {
                content = content + 'USER_NAME=' + f.strlower(f.clearString(answer,true,true)) + '\n'
                const data = new Uint8Array(Buffer.from(content));
                fs.writeFile('./.env', data, (error) => {
                    if(error){
                        f.banner('Houve uma falha: ' + error + '!')
                    }else{
                        f.banner(['Workspace salvo com sucesso!','Execute "node index" novamente.'])
                        s.exit(1)
                    }
                });
            });
        })
    }else{
        fs.access(process.env.WORKSPACE_PATH, fs.constants.F_OK, (error) => {
            if(error){
                f.question(['Informe um caminho válido do seu workspace!','Caminho informado: ' + process.env.WORKSPACE_PATH,'(Ex.: /home/user/documents/www/):'],(answer) => {
                    content = 'WORKSPACE_PATH=' + answer + '\n'
                    f.question(['Informe o seu nome:'],(answer) => {
                        content = content + 'USER_NAME=' + f.strlower(f.clearString(answer,true,true)) + '\n'
                        const data = new Uint8Array(Buffer.from(content));
                        fs.writeFile('./.env', data, (error) => {
                            if(error){
                                f.banner('Houve uma falha: ' + error + '!')
                            }else{
                                f.banner(['Workspace salvo com sucesso!','Execute "node index" novamente.'])
                                s.exit(1)
                            }
                        });
                    });
                })
            }else{
                if(!s.which('git')){
                    f.banner(['Para usar o ' + v.appName() + ', o git deve estar instalado!'])
                    f.exit(true)
                }else{
                    menu.exec()
                }
            }
        })
    }
})