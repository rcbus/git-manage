require('dotenv/config')

const s = require('shelljs')
const f = require('../functions')
const v = require('../version-app')
const fs = require('fs');

module.exports = {
    ///// HEAD - PADRONIZA A TOPO DA TELA /////
    head(projeto,noClear){
        if(noClear === undefined){
            f.clear()
        }
        f.banner([
            v.appName() + ' - VERSÃO ' + v.current(),
            projeto ? 'PROJETO: ' + projeto : 'PROJETOS'
        ]
        ,'c',true,true)
    },

    ///// EXEC - FUNÇÃO PRINCIPAL DO MÓDULO /////
    exec(projeto){
        this.head()

        const returnLs = f.ls(process.env.WORKSPACE_PATH)
        var newReturnLs = []
        Object.keys(returnLs).map(k => {
            newReturnLs.push(((k * 1) + 1) + ' - ' + returnLs[k])
        })
        f.banner(newReturnLs)

        if(f.count(projeto)==0){
            f.question([
                '<br>',
                'ESCOLHA UM PROJETO ACIMA OU UMA OPÇÃO ABAIXO:',
                '<br>',
                '0 - VOLTAR',
                '<br>'
            ],(answer) => {
                this.select(answer,returnLs)
            })
        }else{
            this.select('',returnLs,projeto)
        }
    },

    ///// BRANCH - APRESENTA AS BRANCH DO REPOSITÓRIO LOCAL /////
    branch(projetoSelected){
        this.head(projetoSelected)
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        const branch = s.exec('git branch')
        if(branch.code !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR A BRANCH!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{
            f.question([
                '<br>',
                'ESCOLHA UMA OPÇÃO:',
                '<br>',
                '0 - VOLTAR',
                '<br>'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }
    },

    ///// GETBRANCH - PEGA A BRANCH ATIVA DO REPOSITÓRIO LOCAL /////
    getBranch(projetoSelected){
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        const branch = s.exec('git branch')
        if(branch.code !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR A BRANCH!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{
            var branchArray = branch.stdout.split('\n');
            var currentBranch = ''
            branchArray.map(b => {
                if(b.indexOf('*')!=-1){
                    currentBranch = b.substring(2)
                }
            })

            return currentBranch
        }
    },

    ///// LISTBRANCH - LISTA AS BRANCH DO REPOSITÓRIO LOCAL EM UM ARRAY /////
    listBranch(projetoSelected){
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        const branch = s.exec('git branch')
        if(branch.code !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR A BRANCH!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{
            var branchArray = branch.stdout.split('\n');
            var newBranchArray = []
            branchArray.map(b => {
                if(f.count(b)>0){
                    newBranchArray.push(b.substring(2))
                }
            })

            return newBranchArray
        }
    },

    ///// NEWBRANCH - NOVA BRANCH (RAMO/VERSÃO) /////
    newBranch(){
        const now = new Date()
        return 'update_' + process.env.USER_NAME + '_'  + now.getFullYear() + f.zeroLeft(now.getMonth()+1,2) + f.zeroLeft(now.getDate(),2) + '_' + f.zeroLeft(now.getHours(),2) + f.zeroLeft(now.getMinutes(),2) + f.zeroLeft(now.getSeconds(),2)
    },

    ///// PULLFULL - EXECUTA O PULL COMPLETO (BRANCH,CHECKOUT,PULL)
    pullFull(projetoSelected){
        this.head(projetoSelected)
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        f.question([
            '<br>',
            'CRIAR UMA NOVA BRANCH (RAMO/VERSÃO)?',
            '<br>',
            '1 - SIM | 0 - NÃO | 2 - VOLTAR',
            '<br>'
        ],(answer) => {
            if(answer=='1' || answer=='0'){
                const branch = this.newBranch()
                if(answer=='1'){
                    f.br()
                    if(s.exec('git branch ' + branch).code !== 0) {
                        f.question([
                            'HOUVE UMA FALHA AO TENTAR CRIAR A BRANCH!',
                            '<br>',
                            '0 - VOLTAR'
                        ],(answer) => {
                            const projetos = require('./projetos')
                            projetos.exec(projetoSelected)
                        })
                    }else{
                        f.br()
                        if(s.exec('git checkout ' + branch).code !== 0) {
                            f.question([
                                'HOUVE UMA FALHA AO TENTAR MIGRAR PARA A NOVA BRANCH!',
                                '<br>',
                                '0 - VOLTAR'
                            ],(answer) => {
                                const projetos = require('./projetos')
                                projetos.exec(projetoSelected)
                            })
                        }else{
                            var listBranch = this.listBranch(projetoSelected)
                            var noDelete = f.count(listBranch) - 10
                            Object.keys(listBranch).map(k => {
                                if(listBranch[k]=='master' || k < noDelete){
                                    f.br()
                                    s.exec('git branch -D ' + listBranch[k])
                                }
                            })
                        }
                    }
                }
                f.br()
                if(s.exec('git pull origin master').code !== 0) {
                    f.question([
                        'HOUVE UMA FALHA AO TENTAR EXECUTAR O PULL!',
                        '<br>',
                        '0 - VOLTAR'
                    ],(answer) => {
                        const projetos = require('./projetos')
                        projetos.exec(projetoSelected)
                    })
                }else{
                    f.question([
                        answer=='1' ? 'NOVA BRANCH: ' + branch : null,
                        'PULL REALIZADO COM SUCESSO!',
                        '<br>',
                        '0 - VOLTAR'
                    ],(answer) => {
                        const projetos = require('./projetos')
                        projetos.exec(projetoSelected)
                    },false,false,true)
                }
            }else{
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            }
        })
    },

    ///// PUSHFULL - EXECUTA O PUSH COMPLETO (STATUS,ADD,COMMIT E PUSH)
    pushFull(projetoSelected){
        this.head(projetoSelected)
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        if(s.exec('git status').code !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR O STATUS!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{
            f.question([
                '<br>',
                'PROSSEGUIR COM O "ADD ." ?',
                '<br>',
                '1 - SIM | 0 - NÃO',
                '<br>'
            ],(answer) => {
                if(answer=='1'){
                    const branch = this.getBranch(projetoSelected)
                    this.head(projetoSelected)
                    if(s.exec('git add .').code !== 0) {
                        f.question([
                            'HOUVE UMA FALHA AO TENTAR EXECUTAR O ADD!',
                            '<br>',
                            '0 - VOLTAR'
                        ],(answer) => {
                            const projetos = require('./projetos')
                            projetos.exec(projetoSelected)
                        })
                    }else{
                        f.question([
                            '<br>',
                            'DESEJA PROSSEGUIR COM O COMMIT?',
                            'COMMIT: ' + branch,
                            '<br>',
                            '1 - SIM | 0 - NÃO',
                            '<br>'
                        ],(answer) => {
                            if(answer=='1'){
                                this.head(projetoSelected)
                                if(s.exec('git commit -m "' + branch + '"').code !== 0) {
                                    f.question([
                                        'HOUVE UMA FALHA AO TENTAR EXECUTAR O COMMIT!',
                                        '<br>',
                                        '0 - VOLTAR'
                                    ],(answer) => {
                                        const projetos = require('./projetos')
                                        projetos.exec(projetoSelected)
                                    })
                                }else{
                                    f.question([
                                        '<br>',
                                        'DESEJA PROSSEGUIR COM O PUSH?',
                                        'PUSH BRANCH: ' + branch,
                                        '<br>',
                                        '1 - SIM | 0 - NÃO',
                                        '<br>'
                                    ],(answer) => {
                                        if(answer=='1'){
                                            this.head(projetoSelected)
                                            if(s.exec('git push -u origin ' + branch).code !== 0) {
                                                f.question([
                                                    'HOUVE UMA FALHA AO TENTAR EXECUTAR O PUSH!',
                                                    '<br>',
                                                    '0 - VOLTAR'
                                                ],(answer) => {
                                                    const projetos = require('./projetos')
                                                    projetos.exec(projetoSelected)
                                                })
                                            }else{
                                                f.question([
                                                    'PUSH REALIZADO COM SUCESSO!',
                                                    '<br>',
                                                    '0 - VOLTAR'
                                                ],(answer) => {
                                                    const projetos = require('./projetos')
                                                    projetos.exec(projetoSelected)
                                                },false,true,true)
                                            }
                                        }else{
                                            const projetos = require('./projetos')
                                            projetos.exec(projetoSelected)
                                        }
                                    },false,true,true)
                                }
                            }else{
                                const projetos = require('./projetos')
                                projetos.exec(projetoSelected) 
                            }
                        },false,true,true)
                    }
                }else{
                    const projetos = require('./projetos')
                    projetos.exec(projetoSelected)
                }
            },false,true,true)
        }
    },

    ///// SELECT - SELECIONA UM PROJETO /////
    select(answer,returnLs,projetoSelected){
        if(answer=='0'){
            const menu = require('./menu')
            menu.exec()
        }else{
            if(f.count(projetoSelected)==0){
                projetoSelected = returnLs[((answer * 1) - 1)]
            }
            
            this.head(projetoSelected)

            f.question([
                '<br>',
                'ESCOLHA UMA OPÇÃO:',
                '<br>',
                '0 - VOLTAR',
                '1 - VERIFICAR A BRANCH (RAMO/VERSÃO)',
                '2 - VERIFICAR O STATUS',
                '3 - EXECUTAR PUSH (ENVIO PARA GITHUB) COMPLETO',
                '4 - EXECUTAR PULL (BAIXAR DO GITHUB) COMPLETO',
                '5 - ABRIR PROJETO NO VSCODE',
                '<br>'
            ],(answer) => {
                if(answer=='1'){
                    this.branch(projetoSelected)
                }else if(answer=='2'){
                    this.status(projetoSelected)
                }else if(answer=='3'){
                    this.pushFull(projetoSelected)
                }else if(answer=='4'){
                    this.pullFull(projetoSelected)
                }else if(answer=='5'){
                    s.cd(process.env.WORKSPACE_PATH + projetoSelected)
                    s.exec('code .')
                    const projetos = require('./projetos')
                    projetos.exec(projetoSelected)
                }else{
                    const projetos = require('./projetos')
                    projetos.exec()
                }
            })
        }
    },

    ///// STATUS - APRESENTA STATUS GIT DO REPOSITÓRIO LOCAL /////
    status(projetoSelected){
        this.head(projetoSelected)
        s.cd(process.env.WORKSPACE_PATH + projetoSelected)
        if(s.exec('git status').code !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR O STATUS!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{
            f.question([
                '<br>',
                'ESCOLHA UMA OPÇÃO:',
                '<br>',
                '0 - VOLTAR',
                '<br>'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }
    },
}