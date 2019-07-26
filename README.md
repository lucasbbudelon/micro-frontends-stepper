# micro-frontends-stepper

Este projeto trata-se de um POC que desenvolvi para validar uma hipótese baseada em uma arquitetura de micro front-end, no qual todos eles devem se comunicar em uma espécie de wizard. 

## Sobre a aplicação

Para ilustrar esse cenário, este projeto simula o processo de preenchimento de dados para contratação de um produto ou serviço, em um formato de wizard, no qual cada etapa tem como objetivo coletar determinado dados e no final do processo um contrato deve ser assinado. As etapas são as seguintes:

- **Documento de Identificação:** CPF ou RG e número do documento
- **Dados básicos:** Nome completo, nome do pai/mãe, profissão e naturalidade
- **Endereço:** Rua, número, bairro, cidade, etc
- **Tempo de Experiência:** Junior, pleno ou sênior
- **Pacote promocional:** Pequeno, médio ou grande
- **Contrato:** Cláusulas do contrato e confirmação dos dados

### Fluxo de contratação
O fluxo de contratação está dividido em três partes: Dados da pessoa, parametrização do serviço e assinatura do contrato.

#### Dados da pessoa
Responsável por coletar os dados que dizem respeito a identificação da pessoa. A ideia é que estes dados sejam dinâmicos, e o bff deverá dizer quais dados devem ser preenchidos em cada etapa. Esta parte do fluxo contempla as seguintes etapas:
- Documento de Identificação
- Dados básicos
- Endereço

#### Parametrização
Aqui entra os microfrontend externos ao processo. O motivo de esses micro frontends serem externos é que essa parte de parametrização seja dinâmica e escalável, no sentido que através desse fluxo possa ser contratado qualquer serviço ou produto. Uma vez que basta incorporar no fluxo uma nova aplicação completamente externa ao processo. Esta parte do fluxo contempla as seguintes etapas:
- Tempo de experiência
- Pacote promocional

#### Assinatura de contrato
No final do processo um contrato será gerado de acordo com os produtos e serviços contratados. As cláusulas devem ser aceitas e os dados conferidos. O contrato só poderá ser assinado se todos os dados obrigatórios forem preenchidos. Esta parte do fluxo contempla as seguintes etapas:
- Assinatura do contrato

OBS: Após o processo estar concluído (todos os dados preenchidos e o contrato assinado) é possível consultar o processo, porém, nenhum dado pode ser alterado.

## Arquitetura

A ideia é ter um frontend principal, que será responsável por conduzir o fluxo de aquisição, um bff que irá interagir com os frontends e cuidar da manipulação dos dados, um servidor de mensageria para trocar informações entre as partes envolvidas e dois microfrontend em tecnologias distintas, que irão compor o fluxo.

![architecture](https://raw.githubusercontent.com/lucasbbudelon/micro-frontends-stepper/master/architecture.png)

### Frontend principal (process-frontend)
Ele é responsável por conduzir o fluxo da contratação do serviço ou produto. Ele interage com bff para mostrar dinamicamente e salvar os dados da parte de identificação da pessoa, chamar as aplicações externas de parametrização de serviço/produto e fazer a assinatura do contrato. Ele também interage com o serviço de mensageria para enviar e receber mensagens. Ele enviar mensagens referente a mudanças na etapas e alterações de dados e é o único componente na arquitetura que fica “ouvindo” as mensagens enviadas por outros componentes.

### Backend (process-bff)
Cuida da parte dos dados da pessoa e do fluxo. Ele é responsável por dizer qual a etapa atual, anterior e próxima e também por saber quais os dados mínimos para a contratação do produto ou serviço.

### Mensageria (process-messenger)
Esse componente da arquitetura é responsável apenas por fazer a comunicação entre todos os frontends, ele não salva dados e não mantém estado. Sua única responsabilidade e distribuir mensagens.

### Micro frontends (micro-frontend-react e micro-frontend-angular)
Simula a parametrização dos serviços/produtos. Ele interage com o bff para obter dados do processo e salvar os dados referente a parametrização. Ele não “escuta” mensagens do serviço de mensageria, apenas envia mensagens. As mensagens enviadas são:

- **Ao carregar:** Quando ele renderiza ele envia uma mensagem informando que conseguir carregar, isso serve para caso uma aplicação externa estar fora o frontend principal possa tomar uma decisão;
- **Atualização de dados:** Sempre que os dados da etapa são alterados, desta forma o frontend principal pode atualizar os dados no fluxo principal;
- **Ao finalizar:** No final da parametrização ele enviar uma mensagem para que o frontend principal possa tomar mover as etapas.

