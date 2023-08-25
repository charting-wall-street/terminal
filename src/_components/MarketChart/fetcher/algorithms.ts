import {AlgorithmResults, ChartModel} from "../../../_types/charts"
import ky from "ky"
import {ALGO_URL} from "../../../_helpers/env"

let fetching = false

export const runAlgorithmFetcher = (chart: ChartModel) => {
    if (fetching) return
    if (chart.algorithm === "") {
        chart.data.algorithm = null
        chart.data.lastAlgorithm = ""
        return
    }
    if (chart.data.lastAlgorithm !== chart.algorithm) {
        fetching = true
        const uid = chart.algorithm
        const [algoId, params, flags] = uid.split(":")
        ky.get(`${ALGO_URL}/algorithms/${algoId}/symbols/${chart.symbol}?resolution=${chart.resolution}&params=${params}&${flags}`)
            .json<AlgorithmResults>()
            .then(res => {
                if (uid !== chart.algorithm) return
                chart.data.lastAlgorithm = uid
                chart.data.algorithm = res
            })
            .catch(err => {
                console.log(err)
                chart.algorithm = ""
            })
            .finally(() => {
                setTimeout(() => {
                    fetching = false
                }, 1000)
            })
    }
}
