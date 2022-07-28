# Corrections

Esse é o serviço GraphQL responsável pela gerenciamento e submissão dos desafios.

A submissão dos desafios é feita via Apache Kafka, requisitando ao serviço de comsumer de correções, a correção de um desafio retornando a nota e o status da submissão.

Aqui, nos comunicamos utilizando o tópico `challenge.correction` (consumer groupId: `challenge-consumer`).

## 🚰 Fluxo esperado

- Uma submissão de um desafio é enviada;
- A submissão é registrada com o status Pending;
  - ⚠️ Caso não exista o desafio ou a url não seja um repositório do github a submissão é registrada com status Error e um erro é retornado ao usuário, dando fim a esse fluxo;
- O serviço corrections é notificado e retorna a correção da submissão;
- O status e a nota da submissão são atualizados;

```typescript
interface AnswerChallengeInput {
  challengeId: string;
  repositoryLink: string;
}

interface ResponseAnswer {
  id: string;
  challengeId?: string;
  repositoryLink: string;
  status: string;
  grade: number;
  createdAt: Date;
}
```

## 🚀 Instruções e ferramentas

### Executando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

### Docker

Criamos um `docker-compose` que faz a configuração de 3 _containers_ incluindo as credenciais (login do postgres, database, etc):

| Container | Ports       |
| --------- | ----------- |
| Postgres  | `5432:5432` |
| Kafka     | `9092:9092` |
| Zookeper  | `2181:2181` |

### Kafka

Escolhemos o utilizar o [Kafka](https://kafka.apache.org/) para a comunicação com o serviço de [corrections](../corrections). Caso você utilizamos Nest.js, porque o mesmo possui uma [integração completa com essa ferramenta](https://docs.nestjs.com/microservices/kafka).

Nas instruções do serviço de [corrections](../corrections) estão especificados os tópicos e eventos que a aplicação deve utilizar.

![image](https://user-images.githubusercontent.com/40845824/122421461-c3950500-cf62-11eb-903a-0b629cc8502f.png)

:warning: É necessário iniciar o serviço de [corrections](../corrections/) para que os tópicos do Kafka sejam criados.

### GraphQL

A interação com os desafios e submissões deve ser feita via GraphQL, para isso deixamos abaixo _schema_ das operações:

```graphql
Query {
  challenges(...): [Challenge!]!
  answers(...): [Answer!]!
}

Mutation {
 createChallenge(...): Challenge!
 updateChallenge(...): Challenge!
 deleteChallenge(...): Challenge!

 answerChallenge(...): Answer!
}
```
