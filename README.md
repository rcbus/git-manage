<div align="justify">

# Git Manage

Sistema em node.js que simplifica a gestão do git local e do git remoto (github), usando um padrão de registro de branch da RCBUS.

## Sobre o Projeto

Esse projeto nasceu para simplificar, padronizar e otimizar o tempo de gestão do git hub. Trata-se de uma aplicação muito simples, que roda em node.js no terminal mesmo e basicamente ela te ajuda a gerenciar os seus projetos e fazer o git pull e push de uma forma padronizada e organizada. É importante frisar que existem muitas aplicações que facilitam muito o uso do git e do github, com interfaces gráficas e tudo mais, inclusive o próprio VS CODE possui extensões para isso, mas se você seguir com a instalação e/ou leitura do tópico "Recomendações e Observações" mais abaixo verá que a ideiar não é reinventar a roda do git e do github e sim ajudar a organizar o controle de versão do seu projeto de uma forma eficiente.

### Pre-Requesitos

Para rodar o sistema você vai precisar ter o npm e o node instalados:

```
npm -v
```

```
node -v
```

### Instalando

Para instalar o sistema basta clonar o mesmo:

```
git clone https://github.com/rcbus/git-manage.git
```

Depois disso, acesse o diretório do sistema:

```
cd git-manage
```

Depois execute a instalação do npm:

```
npm install
```

Por ultimo execute o sistema (repita essa ação sempre que for usar o sistema):

```
node index
```

### Primeiro Acesso

Ao rodar o sistema pela primeira vez, você deve obter uma tela como a imagem abaixo:

![](/public/slide-01.png)

Preencha com o caminho da pasta onde você armazena seus projetos.

Após preencher o caminho você deve obter uma tela como a imagem abaixo:

![](/public/slide-02.png)

Preencha com o seu nome abreviado ou completo.

Após informar o seu nome você deve receber uma mensagem de sucesso, conforme a imagem abaixo:

![](/public/slide-03.png)

Rode novamente o sistema:

```
node index
```
Pronto! Agora basta seguir as instruções da tela para gerenciar seus projetos. A tela inicial do sistema deve ser como a imagem abaixo:

![](/public/slide-04.png)

### Recomendações e Observações

- Use o sistema com o terminal maximizado ou em tela cheia para uma melhor experiencia de uso.

- O sistema tem como objetivo principal padronizar a forma como você registra as versões dos seus projetos. Portanto a cada pull completo (opção 4 do sistema) do seu projeto, o sistema vai perguntar se você deseja criar nova branch (ramo/versão) e ao optar por sim o sistema irá criar uma nova branch com um nome seguindo o formato abaixo: 

update_username_YYYYMMDD_HHIISS 

Exemplo: Digamos que seu nome seja Joaquim e você está executando um pull permitindo a criação de uma nova branch no dia 26 de Julho de 2020 as 15:35:41, então o nome da sua branch será parecida com a seguinte:

update_joaquim_20200726_153541

Dessa forma o seu github irá ficar organizado de forma crescente, e se você tiver outros contribuidores de projeto usando esse sistema, fica fácil de saber quem fez uma determinada alteração, quando fez e em qual versão fez.

- O sistema ainda pode se encarregar de administrar o número da versão do seu projeto, basta para isso que você crie um arquivo na raiz do seu projeto, com o nome version-app.js com a estrutura abaixo:

```
...

const version = '1.0.0'

...

/* 
HISTÓRIO DE VERSÕES

*/
```

- Perceba que a variavel version vem antes do histórico, isso é importante. Perceba também que o "HISTÓRIO DE VERSÕES" está dentro de um comentário "/* ... */", isso também é importante. O arquivo precisa ter pelo menos essas 2 informações para que o sistema entenda e comece a contabilizar as versões de forma automática. Caso queira criar alguma função para usar essa versão no seu projeto para apresentar na tela por exemplo, você pode fazer como quiser, se precisar de exemplo de uso veja o nosso próprio arquivo de versão [version-app](version-app.js). 

- Após criar o arquivo, sempre que executar o pull usando o nosso sistema (opção 4 do sistema), ele irá incrementar o número da versão automaticamente. Como o exemplo abaixo:


```

...

const version = '1.0.2'

...

/* 
HISTÓRIO DE VERSÕES

26/07/2020 AS 23:28:12 - 1.0.2 - BRANCH: update_cleiton_20200725_174439
06/07/2020 AS 13:48:05 - 1.0.1 - BRANCH: update_cleiton_20200706_070819
*/
```

- Perceba que usamos um número sequencial, então no nosso sistema não usamos aquelas classificações complexas de versão onde cada "." representa a versão de uma determinada camada do sistema. Achamos mais simples usar um número sequencial, quando o exemplo acima chegar em 1.0.9 o próximo número será 1.1.0, e quando chegar a 1.9.9 o próximo número será 2.0.0, e quando chegar a 9.9.9 o próximo número será 10.0.0, e assim por diante podendo chegar até 9999999.9.9 que é um número razoavel de versões rsrsrs.

- Note o seguinte, a data do histórico da versão nem sempre é a mesma data da branch, isso porque o que queremos sugerir com esse sistema é que você saiba a partir de que data uma nossa alteração foi iniciada (nesse caso a data da criação da nova branch ao executar o pull completo), e a data exata em que a branch subiu para o github com um novo número de versão (nesse caso a data registrada no histórico de versão). 

- Você deve estar se perguntando, mas e se eu não trabalho sozinho, tenho outros contribuidores do projeto, as versões não irão conflitar? Sim, irão, mas todo projeto construído com mais de um desenvolvedor precisa ter um coordenador, que será o responsável por fazer o merge das versões, e ele decidirá qual versão será adotada. 

- Dica importante: Se você tem uma equipe de desenvolvedores, defina um dia da semana, do mês ou qualquer data que seja para que todos os desenvolvedores realizem o push completo (opção 3 do sistema) de suas branch, é importante que todos façam isso no mesmo dia, e não realizem mais alterações até que o merge seja feito. Após o merge ser executado, todos devem executar o pull completo, assim todos estarão trabalhando com a versão mais rescente do sistema sempre. Um bom dia para isso é na sexta-feira no final do expediente, assim o coordenador do projeto terá o final de semana para realizar o merge, e na segunda-feira de manhã todos podem realizar o pull completo e continuar com o desenvolvimento.

- Dica extra: Evite ter mais de um desenvolvedor mexendo em um mesmo arquivo, divida a equipe de modo a cada um ser "dono" de uma parte do projeto e consequente de um grupo de arquivos, assim evita-se os conflitos de pull request e merge, e principalmente evita-se o conflito de merge local, ocasionado quando por exemplo eu retive as alterações de um arquivo, por exemplo, porque não conclui o desenvolvimento e não deve subir para produção ainda, e outro desenvolvedor fez uma alteração que subiu, dai quando eu for fazer o git pull origin master (no nosso caso o pull completo pelo sistema), vai dar erro e vai dar um certo trabalho para corrigir isso e evitar que as alterações sejam perdidas. Caso haja realmente a necessidade de mais de um desenvolvedor mexer em um mesmo arquivo, é melhor coloca-los para trabalharem juntos nessa parte do sistema, assim eles decidem juntos o que será mudado, quando e porque. 

- Caso tenha que fazer alguma pequena alteração no projeto que não há necessidade de troca de versão, basta não realizar o pull completo ou faze-lo sem criar uma nova branch, assim o sistema entende que você deseja manter a mesma versão.

- Caso o seu projeto não tenha um arquivo version-app.js ou caso não tenha o formato acima, o sistema irá avisar na tela mas não irá impedir o push ou pull.

### Versão

Verifique o histórico de versão do sistema em [version-app](version-app.js)

### Licença

Este projeto está licensiado através da: 

GNU - GENERAL PUBLIC LICENSE 

[LICENSE](LICENSE)

### Autor / Desenvolvedor

Cleiton Cavalcanti dos Santos - Marido, Pai, Gestor e Full Stack Developer, especializado em Javascript e PHP, tanto Frontend quanto Backend. Especiazado no uso e configuração de banco de dados MySQL, SQL Server e MongoDB. Com mais de 18 anos de experiencia em desenvolvimento, implatação, migração, manutenção e gerenciamento de software, utilizando as mais variadas linguagens de programação, tais como: C, C++, C#, PHP, Javacript, HTML, CSS, Python, Ruby, Go... Bem como também utilizando os mais diversos framework's e api's, tais como: React, React Native, Next, Zend, Laravel... E os mais variados bancos de dados, tais como MySQL, SQL Server, MongoDB.

<br/>

#### Frase de Inspiração:

_"... As desculpas matam os sonhos!_

_Se não sabe fazer, APRENDE! ..."_

<br/>

#### Entre em contato comigo: 

cleiton.rce@gmail.com

[LINKEDIN](https://www.linkedin.com/in/cleiton-cavalcanti-dos-santos-734500123/)

Veja outros projetos de minha autoria em [RCBUS](https://github.com/rcbus)

<br/>

### Sobre a RCBUS

Ramalho Cavalcanti Business - Empresa fundada por Cleiton Cavalcanti com o foco no desenvolvimento de software usando as mais modernas tecnologias do mercado.

</div>