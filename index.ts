import express from 'express'
import http from 'http'
import { ApolloServer } from 'apollo-server-express'
import { typeDefs } from './models/schema'
import resolvers from './resolvers'

const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true,
    playground: true,
})

const app = express()
server.applyMiddleware({ app, path: '/graphql' })

const httpServer = http.createServer(app)

httpServer.listen(3001)
