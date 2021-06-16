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
                'U - ATUALIZAR OS SUBMODULOS COMPONENTS E',
                '    LIBS DE TODOS OS PROJETOS',
                '<br>'
            ],(answer) => {
                if(f.strlower(answer)=='u'){
                    Object.keys(returnLs).map(k => {
                        this.updateSubModuleComponents(returnLs[k],true)
                        if(k<(f.count(returnLs)-1)){
                            this.updateSubModuleComponents(returnLs[k],true)
                        }else{
                            this.updateSubModuleComponents(returnLs[k],true,true)
                        }
                    })
                }else{
                    this.select(answer,returnLs)
                }
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

    ///// NEWVERSION - GERA A NOVA VERSÃO E ATUALIZADO O ARQUIVO version-app.js /////
    newVersion(projetoSelected,branch,callback){
        const lineReader = require('line-reader');

        var newFileVersion = []
        var gateHistoric = false
        var oldVersion = ''
        var newVersion = ''
        var save = false
        var extension = 'php'

        s.cd(process.env.WORKSPACE_PATH + projetoSelected)

        fs.access('version-app.' + extension, fs.constants.R_OK, (err) => {
            if(err){
                extension = 'js'
            }

            lineReader.eachLine('version-app.' + extension, (line, last) => {
                if(gateHistoric===true && f.strlen(newVersion)>=5 && f.strlen(newVersion)<=11 && f.strlen(line)>0 && save===false){
                    gateHistoric = false
                    save = true

                    const now = new Date()
                    var newHistoric = f.zeroLeft(now.getDate(),2) + '/' + f.zeroLeft(now.getMonth()+1,2) + '/' + now.getFullYear() + ' AS ' + f.zeroLeft(now.getHours(),2) + ':' + f.zeroLeft(now.getMinutes(),2) + ':' + f.zeroLeft(now.getSeconds(),2) + ' - ' + newVersion + ' - BRANCH: ' + branch

                    newFileVersion.push(newHistoric)
                    newFileVersion.push(line)
                }else if(line.indexOf('const version')!=-1 || line.indexOf('$_VERSION')!=-1){
                    var quotation = ''
                    if(line.indexOf('\'')!=-1){
                        quotation = '\''
                    }else if(line.indexOf('"')!=-1){
                        quotation = '"'
                    }
                    if(f.strlen(quotation)==0){
                        f.banner(['Formato da versão inválido!(1)'],'left',false,true,true)
                    }else{
                        var posA = line.indexOf(quotation)
                        var subString = line.substring(posA + 1)
                        var posB = subString.indexOf(quotation)
                        var versionString = subString.substring(0,posB)
                        if(f.strlen(versionString)<5 || f.strlen(versionString)>11){
                            f.banner(['Formato da versão inválido!(2)'],'left',false,true,true)
                        }else{
                            var version = versionString.split('.')
                            if(f.count(version)!=3){
                                f.banner(['Formato da versão inválido!(3)'],'left',false,true,true)
                            }else{
                                oldVersion = versionString
                                Object.keys(version).map(k => {
                                    version[k] = version[k] * 1
                                })
                                if(version[2]==9){
                                    version[2] = 0
                                    if(version[1]==9){
                                        version[1] = 0
                                        version[0] = version[0] + 1
                                    }else{
                                        version[1] = version[1] + 1
                                    }
                                }else{
                                    version[2] = version[2] + 1
                                }
                                newVersion = version[0] + '.' + version[1] + '.' + version[2]
                                if(line.indexOf('const version')!=-1){
                                    newFileVersion.push('const version = \'' + newVersion + '\'')
                                }else if(line.indexOf('$_VERSION')!=-1){
                                    newFileVersion.push('$_VERSION = \'' + newVersion + '\';')
                                }
                            }
                        }
                        
                    }
                }else if(line.toLowerCase().indexOf('hist')!=-1){
                    newFileVersion.push(line)
                    gateHistoric = true
                }else{
                    newFileVersion.push(line)
                }
                if(line.indexOf(branch)!=-1){
                    save = 1
                }
            },() => {
                if(save===false){
                    f.banner(['Houve uma falha ao tentar gerar a nova versão!'],'left',false,true,true)
                    callback()
                }else if(save==1 && save!==true){
                    f.banner(['Mantendo a mesma versão ' + oldVersion + ' gerada anteriormente!'],'left',false,true,true)
                    callback()
                }else{
                    var content = ''
                    newFileVersion.map(line => {
                        content += line + '\n'
                    })
                    const data = new Uint8Array(Buffer.from(content));
                    fs.writeFile('version-app.' + extension, data, (error) => {
                        if(error){
                            f.banner(['Houve uma falha: ' + error + '!'],'left',false,true,true)
                            callback()
                        }else{
                            f.banner(['Nova versão ' + newVersion + ' gerada com sucesso!'],'left',false,true,true)
                            callback()
                        }
                    });
                }
            })
        })
    },

    ///// NPMINSTALL - EXECUTA A INSTALAÇÃO DO PROJETO /////
    npmInstall(projetoSelected){
        this.head(projetoSelected)
        const pathProject = process.env.WORKSPACE_PATH + projetoSelected + '/'
        s.cd(pathProject)
        fs.access(pathProject + '.next', fs.constants.F_OK, (error) => {
            if(!error){
                f.banner('APAGANDO A PASTA .NEXT...','left',false,true,true)
                s.rm('-rf', pathProject + '.next');
            }
            fs.access(pathProject + 'node_modules', fs.constants.F_OK, (error) => {
                if(!error){
                    f.banner('APAGANDO A PASTA NODE_MODULES...','left',false,true,false)
                    s.rm('-rf', pathProject + 'node_modules');
                }
                fs.access(pathProject + 'package-lock.json', fs.constants.F_OK, (error) => {
                    if(!error){
                        f.banner('APAGANDO O ARQUIVO PACKAGE-LOCK.JSON...','left',false,true,false)
                        s.rm('-rf', pathProject + 'package-lock.json');
                    }
                    f.banner('INSTALANDO O PROJETO ' + projetoSelected + '...','left',false,true,false)
                    if(s.exec('npm install').code !== 0) {
                        f.question([
                            'HOUVE UMA FALHA AO TENTAR INSTALAR O PROJETO!',
                            '<br>',
                            '0 - VOLTAR'
                        ],(answer) => {
                            const projetos = require('./projetos')
                            projetos.exec(projetoSelected)
                        })
                    }else{
                        f.question([
                            'PROJETO INSTALADO COM SUCESSO!',
                            '<br>',
                            '0 - VOLTAR'
                        ],(answer) => {
                            const projetos = require('./projetos')
                            projetos.exec(projetoSelected)
                        })
                    }
                })
            })
        })
    },

    ///// PULLFULL - EXECUTA O PULL COMPLETO (BRANCH,CHECKOUT,PULL) /////
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
                                if(listBranch[k]=='master' || listBranch[k]=='main' || k < noDelete){
                                    f.br()
                                    s.exec('git branch -D ' + listBranch[k])
                                }
                            })
                        }
                    }
                }
                f.br()
                f.question([
                    '<br>',
                    'ORIGIN?',
                    '<br>',
                    '1 - MASTER | 2 - MAIN | 0 - VOLTAR',
                    '<br>'
                ],(answer) => {
                    if(answer=='1' || answer=='2'){
                        var origin = 'master'
                        if(answer=='2'){
                            origin = 'main'
                        }
                        if(s.exec('git pull origin ' + origin).code !== 0) {
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
        /*if(f.gitStatus() !== 0) {
            f.question([
                'HOUVE UMA FALHA AO TENTAR VERIFICAR O STATUS!',
                '<br>',
                '0 - VOLTAR'
            ],(answer) => {
                const projetos = require('./projetos')
                projetos.exec(projetoSelected)
            })
        }else{*/
        f.gitStatus(
            f.question([
                '<br>',
                'PROSSEGUIR COM O "ADD ." OU',
                'ADICIONAR ESPECÍFICAMENTE?',
                '(SEPARE POR VIRGULA)',
                '<br>',
                'Y - SIM | N - NÃO',
                '<br>'
            ],(answer) => {
                if(answer=='y' || answer=='Y'){
                    const branch = this.getBranch(projetoSelected)
                    this.head(projetoSelected)
                    this.newVersion(projetoSelected,branch,() => {
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
                    })
                }else if(answer=='n' || answer=='N'){
                    const projetos = require('./projetos')
                    projetos.exec(projetoSelected)
                }else{
                    var specific = answer.split(',')

                    const branch = this.getBranch(projetoSelected)
                    this.head(projetoSelected)
                    this.newVersion(projetoSelected,branch,() => {
                        f.gitAddSpecific(specific,() => {
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
                        })
                    })
                }
            },false,true,true)
        )
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
                '6 - ATUALIZAR SUBMODULO COMPONENTS E LIBS',
                '7 - INSTALAR PROJETO (NPM INSTALL)',
                '8 - EXECUTAR O PROJETO (NPM RUN DEV)',
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
                }else if(answer=='6'){
                    this.updateSubModuleComponents(projetoSelected)
                }else if(answer=='7'){
                    this.npmInstall(projetoSelected)
                }else if(answer=='8'){
                    s.cd(process.env.WORKSPACE_PATH + projetoSelected)
                    s.exec('npm run dev')
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

    ///// UPDATESUBMODULECOMPONENTS - ATUALIZA OS SUBMÓDULOS COMPONENTS /////
    updateSubModuleComponents(projetoSelected,allProjects,endPoint){
        if(allProjects === undefined){
            this.head(projetoSelected)
        }
        fs.access(process.env.WORKSPACE_PATH + projetoSelected + '/components/', fs.constants.F_OK, (error) => {
            if(error){
                f.banner(['PROJETO: ' + projetoSelected,'ESSE PROJETO NÃO POSSUI O SUBMODULO COMPONENTS!'],'left',false,true,true)
                this.updateSubModuleLibs(projetoSelected,allProjects,endPoint)
            }else{
                s.cd(process.env.WORKSPACE_PATH + projetoSelected + '/components/')
                f.question([
                    '<br>',
                    'ORIGIN?',
                    '<br>',
                    '1 - MASTER | 2 - MAIN | 0 - VOLTAR',
                    '<br>'
                ],(answer) => {
                    if(answer=='1' || answer=='2'){
                        var origin = 'master'
                        if(answer=='2'){
                            origin = 'main'
                        }
                        if(s.exec('git pull origin ' + origin).code !== 0) {
                            f.banner(['PROJETO: ' + projetoSelected,'HOUVE UMA FALHA AO TENTAR ATUALIZAR O SUBMODULO COMPONENTS!'],'left',false,true,true)
                            this.updateSubModuleLibs(projetoSelected,allProjects,endPoint)
                        }else{
                            f.banner(['PROJETO: ' + projetoSelected,'SUBMODULO COMPONENTS ATUALIZADO COM SUCESSO!'],'left',false,true,true)
                            this.updateSubModuleLibs(projetoSelected,allProjects,endPoint)
                        }
                    }else{
                        const projetos = require('./projetos')
                        projetos.exec(projetoSelected)
                    }
                });
            }
        })
    },

    ///// UPDATESUBMODULELIBS - ATUALIZA OS SUBMÓDULOS LIBS /////
    updateSubModuleLibs(projetoSelected,allProjects,endPoint){
        fs.access(process.env.WORKSPACE_PATH + projetoSelected + '/libs/', fs.constants.F_OK, (error) => {
            if(error){
                f.banner(['PROJETO: ' + projetoSelected,'ESSE PROJETO NÃO POSSUI O SUBMODULO LIBS!'],'left',false,true,true)
                if(allProjects === undefined){
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
                }else if(endPoint !== undefined){
                    f.question([
                        '<br>',
                        'ESCOLHA UMA OPÇÃO ABAIXO:',
                        '<br>',
                        '0 - VOLTAR',
                        '<br>'
                    ],(answer) => {
                        const projetos = require('./projetos')
                        projetos.exec()
                    })
                }
            }else{
                s.cd(process.env.WORKSPACE_PATH + projetoSelected + '/libs/')
                f.question([
                    '<br>',
                    'ORIGIN?',
                    '<br>',
                    '1 - MASTER | 2 - MAIN | 0 - VOLTAR',
                    '<br>'
                ],(answer) => {
                    if(answer=='1' || answer=='2'){
                        var origin = 'master'
                        if(answer=='2'){
                            origin = 'main'
                        }
                        if(s.exec('git pull origin ' + origin).code !== 0) {
                            f.banner(['HOUVE UMA FALHA AO TENTAR ATUALIZAR O SUBMODULO LIBS!'],'left',false,true,true)
                            if(allProjects === undefined){
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
                            }else if(endPoint !== undefined){
                                f.question([
                                    '<br>',
                                    'ESCOLHA UMA OPÇÃO ABAIXO:',
                                    '<br>',
                                    '0 - VOLTAR',
                                    '<br>'
                                ],(answer) => {
                                    const projetos = require('./projetos')
                                    projetos.exec()
                                })
                            }
                        }else{
                            f.banner(['PROJETO: ' + projetoSelected,'SUBMODULO LIBS ATUALIZADO COM SUCESSO!'],'left',false,true,true)
                            if(allProjects === undefined){
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
                            }else if(endPoint !== undefined){
                                f.question([
                                    '<br>',
                                    'ESCOLHA UMA OPÇÃO ABAIXO:',
                                    '<br>',
                                    '0 - VOLTAR',
                                    '<br>'
                                ],(answer) => {
                                    const projetos = require('./projetos')
                                    projetos.exec()
                                })
                            }
                        }  
                    }else{
                        const projetos = require('./projetos')
                        projetos.exec()
                    }          
                });    
            }
        })
    },
}