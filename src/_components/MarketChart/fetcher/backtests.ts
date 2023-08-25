import {ChartModel, SymbolResults} from "../../../_types/charts"
import ky from "ky"
import {SIMAR_URL} from "../../../_helpers/env"
import {getHistoryScenarioId, unpackRunId} from "../../../_helpers/urls"

let fetching = false

export const runScenarioFetcher = (chart: ChartModel) => {
    if (fetching) return
    if (chart.data.lastScenario !== getHistoryScenarioId(chart.scenario)) {
        const uid = getHistoryScenarioId(chart.scenario)
        const path = unpackRunId(chart.scenario)
        if (path.id === undefined || path.scenario === undefined || path.symbol === undefined) return
        fetching = true
        ky.get(`${SIMAR_URL}/simulations/${path.id}/results?scenario=${path.scenario}&symbol=${path.symbol}`)
            .json<SymbolResults>()
            .then(res => {
                if (uid !== getHistoryScenarioId(chart.scenario)) return
                chart.data.lastScenario = uid
                chart.data.scenario = res
            })
            .catch(err => console.log(err))
            .finally(() => {
                setTimeout(() => {
                    fetching = false
                }, 1000)
            })
    }
}
