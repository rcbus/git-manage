require('dotenv/config')

const s = require('shelljs')
const f = require('../functions')
const v = require('../version-app')
const fs = require('fs');

module.exports = {
    exec(){
        f.clear()

        f.banner([
            v.appName() + ' - VERSÃO ' + v.current(),
            'MENU PRINCIPAL'
        ]
        ,'c',true)

        f.question([
            '<br>',
            'ESCOLHA UMA OPÇÃO:',
            '<br>',
            '0 - SAIR',
            '1 - PROJETOS',
            '2 - BAIXAR PROJETO DO GITHUB',
            '3 - ALTERAR WORKSPACE',
            '<br>'
        ],(answer) => {
            if(answer=='0'){
                f.exit()
            }else if(answer=='1'){
                const projetos = require('./projetos')
                projetos.exec()
            }else if(answer=='2'){
                const baixarProjetoGithub = require('./baixarProjetoGithub')
                baixarProjetoGithub.exec()
            }else if(answer=='3'){
                const alterarWorkspace = require('./alterarWorkspace')
                alterarWorkspace.exec()
            }else{
                this.exec()
            }
        })
    }
}