# Corrections

Esse é o serviço GraphQL responsável pela gerenciamento e submissão dos desafios.

A submissão dos desafios é feita via Apache Kafka, requisitando ao serviço de comsumer de correções, a correção de um desafio retornando a nota e o status da submissão.

Aqui, nos comunicamos utilizando o tópico `challenge.correction` (consumer groupId: `challenge-consumer`).

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

### Executando o app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
