# Space Watch GraphQL Server

GraphQL server wrapping the SpaceX Launch API[https://github.com/r-spacex/SpaceX-API/]

To run

```
npm install
npm start
```

This will startup the GraphQL server at port 3001 on the localhost. 

There is a single GraphQL query defined called `queryLaunches`. This endpoint provides a GraphQL paged and queriable endpoint for the launches available via API. The `queryLaunches` endpoint takes a single query parameter with the following properties

* page
* rowsPerPage
* missionName
* rocketName
* launchYear

missionName and rocketName will do case-insensitive, contains based searches. `queryLaunches` returns a list of `launches`, `totalLaunches` that match any query parameters, `page` requested and `totalPages`. See the [GraphQL Playground](http://localhost:3001/graphql) for additional documentation on what information is provided.