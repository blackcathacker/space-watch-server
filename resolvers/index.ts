import { queryLaunches } from './launches'
import { IResolvers } from 'graphql-tools'

const resolvers: IResolvers = {
    Query: {
        queryLaunches
    }
}

export default resolvers