import {ChartModel} from "../../../_types/charts"
import {runCandleFetcher} from "./candles"
import {runIndicatorFetcher} from "./indicators"
import {runScenarioFetcher} from "./backtests"
import {runTransitionFetcher} from "./transitions"
import {runTIndicatorFetcher} from "./tindicators"
import {runAlgorithmFetcher} from "./algorithms"

export const fetcher = (chart: ChartModel) => {
    runCandleFetcher(chart)
    runIndicatorFetcher(chart)
        .catch(err => console.log(err))
    runScenarioFetcher(chart)
    runAlgorithmFetcher(chart)
    runTransitionFetcher(chart)
    runTIndicatorFetcher(chart)
        .catch(err => console.log(err))
}
