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
            'BAIXAR PROJETO DO GITHUB'
        ]
        ,'c',true)
    },
    exec(){
        this.head()

        f.question([
            'INFORME O NOME DO REPOSITÓRIO (EX.: rcbus/gitmanage)',
            '<br>',
            '0 - VOLTAR'
        ],(answer) => {
            if(answer=='0'){
                const menu = require('./menu')
                menu.exec()
            }else{
                const pathGithub = `https://github.com/${answer}.git`
                this.head()
                f.question([
                    'O ENDEREÇO DO REPOSITÓRIO ABAIXO ESTÁ CORRETO?',
                    '<br>',
                    pathGithub,
                    '<br>',
                    '1 - SIM | 0 - NÃO'
                ],(answer) => {
                    if(answer=='0'){
                        const baixarProjetoGithub = require('./baixarProjetoGithub')
                        baixarProjetoGithub.exec()
                    }else{
                        this.head()
                        s.cd(process.env.WORKSPACE_PATH)
                        if(s.exec('git clone ' + pathGithub).code !== 0) {
                            f.question([
                                'HOUVE UMA FALHA AO TENTAR BAIXAR O REPOSITÓRIO ABAIXO',
                                '<br>',
                                pathGithub,
                                '<br>',
                                '0 - VOLTAR'
                            ],(answer) => {
                                const baixarProjetoGithub = require('./baixarProjetoGithub')
                                baixarProjetoGithub.exec()
                            })
                        }else{
                            f.question([
                                'REPOSITÓRIO BAIXADO COM SUCESSO!',
                                '<br>',
                                '0 - VOLTAR'
                            ],(answer) => {
                                const menu = require('./menu')
                                menu.exec()
                            })
                        }
                    }
                })
            }
        })
    }
}