const s = require('shelljs')

module.exports = {
    
    ///// CLEAR - LIMPA TELA DO TERMINAL /////
    clear(){
        if(s.which('clear')){
            s.exec('clear')
        }else if(s.which('clean')){
            s.exec('clean')
        }else if(s.which('cls')){
            s.exec('cls')
        }
    },

    ///// BANNER - ESCREVE UM BANNER NA TELA /////
    banner(text,align,padding,brBottom,brTop){
        if(text !== undefined){
            if(typeof text !== 'object'){
                text = [text]
            }

            var newText = []
            text.map(t => {
                if(typeof t === 'string'){
                    newText.push(t)
                }
            })
            text = newText

            Object.keys(text).map(k => {
                var textWidth = this.count(text[k])
                
                if(textWidth>60){
                    text[k] = text[k].substring(0, 57) + '...'
                }

                if(textWidth>0){
                    if(align == 'right' || align == 'r'){
                        var textTemp = ''
                        for(var i = 0;i < (60 - textWidth);i++){
                            textTemp += ' '
                        }
                         text[k] = textTemp +  text[k]
                    }else if(align == 'center' || align == 'c'){
                        var widthLeft = Math.floor((60 - textWidth) / 2)
                        var widthRight = (60 - textWidth - widthLeft)
                        var spaceLeft = ''
                        var spaceRight = ''
                        for(var i = 0;i < widthLeft;i++){
                            spaceLeft += ' '
                        }
                        for(var i = 0;i < widthRight;i++){
                            spaceRight += ' '
                        }
                         text[k] = spaceLeft +  text[k] + spaceRight
                    }else{
                        for(var i = 0;i < (60 - textWidth);i++){
                             text[k] += ' '
                        }
                    }
                }else{
                    text[k] = false
                }
            })
        }else{
            text = []
        }

        brTop ? s.echo('') : null

        s.echo(`================================================================`)
        padding ? s.echo(`#                                                              #`) : null
        text.map(t => {
            if(t){
                if(t.indexOf('<br>')!=-1){
                    s.echo(`#                                                              #`)
                }else{
                    s.echo(`# ${t} #`)
                }
            }
        })
        padding ? s.echo(`#                                                              #`) : null
        s.echo(`================================================================`)

        brBottom ? s.echo('') : null
    },

    ///// BR - PULA UMA LINHA /////
    br(){
        s.echo('')
    },

    ///// CLEARSTRING - LIMPA A STRING /////
    clearString(str,withoutSpace,withoutDot){
        var newStr = str.normalize('NFD')
        newStr = newStr.replace(/[\u0300-\u036f]/g, '')
        newStr = newStr.replace(/\s/g, 'SpAcEsPaCe')
        newStr = newStr.replace(/\./g, 'DoTdOt')
        newStr = newStr.replace(/([^\w]+|\s+)/g, '')
    
        if(typeof withoutSpace !== 'undefined'){
            newStr = newStr.replace(/SpAcEsPaCe/g, '_')
        }else{
            newStr = newStr.replace(/SpAcEsPaCe/g, ' ')
        }
    
        if(typeof withoutDot !== 'undefined'){
            newStr = newStr.replace(/DoTdOt/g, '')
        }else{
            newStr = newStr.replace(/DoTdOt/g, '.')
        }
    
        return newStr
    },

    ///// COUNT - RETORNA O TAMANHO DE UMA STRING OU ARRAY /////
    count(value){
        if(value === undefined){
            return 0
        }else{
            return value.length
        }
    },

    ///// E - SIMPLIFICA A FUNÇÃO ECHO /////
    e(text){
        s.echo(text)
    },

    ///// EXIT - FUNÇÃO DE SAIDA DO PROGRAMA /////
    exit(noClear){
        if(!noClear){
            this.clear()
        }
        s.exit(1)
    },

    ///// LS - SIMPLIFICA A FUNÇÃO SHELL LS
    ls(path){
        var returnLs = s.ls(path)
        var newReturnLs = []
        returnLs.map(ls => {
            if(typeof ls === 'string'){
                newReturnLs.push(ls)
            }
        })
        return newReturnLs
    },

    ///// QUESTION - ESCREVE UMA PERGUNTA NA TELA E AGUARDA UMA RESPOSTA DO USUARIO /////
    question(question,callbackAnswer,noBr,brBottom,brTop){
        this.banner(question,'left',false,brBottom,brTop)

        if(noBr === undefined){
            this.br()
        }else if(noBr === false){
            this.br()
        }

        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        
        rl.question('R: ',(answer) => {
            rl.close();
            if(callbackAnswer){
                callbackAnswer(answer)
            }
        })
    },

    ///// STRLEN - CONTA O TAMANHO DE STRING DE FORMA SEGURA /////
    strlen(string){
        if(typeof string === 'undefined'){
            return 0
        }else{
            return string.toString().length
        }
    },

    ///// STRLOWER - TRANSFORMA A STRING EM MINUSCULA /////
    strlower(string){
        if(typeof string === 'undefined'){
            return ''
        }else{
            return string.toLowerCase()
        }
    },
    
    ///// STRLOWER - TRANSFORMA A STRING EM MAIUSCULA /////
    strupper(string){
        if(typeof string === 'undefined'){
            return ''
        }else{
            return string.toUpperCase()
        }
    },

    ///// ZEROLEFT - INSERE ZERO A ESQUERDA /////
    zeroLeft(value,digit){
        var zeroLeft = "";
    
        if(typeof value !== 'undefined'){
            for(var i = 0;i < (digit - value.toString().length);i++){
                zeroLeft = "0" + zeroLeft;
            }
        }
    
        zeroLeft = zeroLeft + value;
    
        return zeroLeft
    }

}