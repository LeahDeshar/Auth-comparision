### project init

nest new expense-tracker

### prisma setup

npm install prisma --save-dev
npm install @prisma/client
npx prisma init
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/expense-tracker"
Update the Prisma schema file
npx prisma migrate dev --name init
npx prisma generate
create prisma services

nest generate module prisma
nest generate service prisma
nest generate module auth
nest generate service auth
nest generate resolver auth

### Set Up GraphQL in NestJS

npm install @nestjs/graphql @nestjs/apollo graphql apollo-server-express
npm install graphql-tools graphql

#### In appModule

GraphQLModule.forRoot<ApolloDriverConfig>({
driver: ApolloDriver,
autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
