import axios from 'axios'
import NodeCache from 'node-cache'
import { QueryResponse, Query, Launch, LaunchApi, RocketApiMapped, RocketApi } from '../types/launches'
import { DateTime } from 'luxon'

const LAUNCH_CACHE_KEY = 'launches'
const ROCKETS_CACHE_KEY = 'rockets'

const launchApi = 'https://api.spacexdata.com/v4/launches'
const rocketApi = 'https://api.spacexdata.com/v4/rockets'

const localCache = new NodeCache({ stdTTL: 3600 })

export async function queryLaunches(_: void, { query }: { query: Query }): Promise<QueryResponse> {
    const { page = 1, rowsPerPage = 20 } = query
    const { launches: apiLaunches, rockets } = await getApiData()
    const launches = apiLaunches.map(l => ({
        id: l.id,
        name: l.name,
        flightNumber: l.flight_number,
        rocketId: l.rocket,
        rocketName: rockets[l.rocket]?.name,
        launchDate: l.date_utc,
        webcastUrl: l.links.webcast
    })).filter(l => launchMatches(l, query))
    return {
        totalLaunches: launches.length || 0,
        totalPages: Math.ceil(launches.length / rowsPerPage),
        page,
        launches: launches.slice(rowsPerPage * (page - 1), rowsPerPage * page)
    }
}

function launchMatches(launch: Launch, query: Query): boolean {
    return (!query.missionName || !!launch.name.match(new RegExp(query.missionName)))
        && (!query.rocketName || !!launch.rocketName.match(new RegExp(query.rocketName)))
        && (!query.launchYear || DateTime.fromISO(launch.launchDate).year === query.launchYear)
}

async function getApiData(): Promise<{ launches: Array<LaunchApi>, rockets: RocketApiMapped }> {
    let launches: Array<LaunchApi> | undefined = localCache.get(LAUNCH_CACHE_KEY)
    let rockets: RocketApiMapped | undefined = localCache.get(ROCKETS_CACHE_KEY)
    if (!launches) {
        console.log('cache miss')
        launches = (await axios.get(launchApi)).data
        localCache.set(LAUNCH_CACHE_KEY, launches)
    }
    if (!rockets) {
        rockets = (await axios.get(rocketApi)).data?.reduce((acc: object, r: RocketApi) => ({ ...acc, [r.id]: r }), {})
        localCache.set(ROCKETS_CACHE_KEY, rockets)
    }

    return { launches: launches || [], rockets: rockets || {} }
}