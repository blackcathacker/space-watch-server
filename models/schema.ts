import { gql } from 'apollo-server-express'

export const typeDefs = gql`
type Launch {
    id: String!
    flightNumber: Int!
    name: String
    rocketId: String!
    rocketName: String
    launchDate: String
    webcastUrl: String
}

type QueryResponse {
    launches: [Launch]!
    totalLaunches: Int!
    page: Int!
    totalPages: Int!
}

input QueryParams {
    missionName: String
    rocketName: String
    launchYear: Int
    page: Int,
    rowsPerPage: Int
}

type Query {
    queryLaunches(query: QueryParams): QueryResponse!
}`