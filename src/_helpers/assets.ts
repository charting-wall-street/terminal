import {AssetIdentifier} from "../_types/types"

export const AssetIdentifierToSymbol = (identifier: AssetIdentifier): string => {
    return `${identifier.broker}:${identifier.exchange}:${identifier.symbol}`
}