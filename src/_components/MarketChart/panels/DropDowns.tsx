import React, {FC, useState} from "react"
import {formatInterval} from "../../../_helpers/interval"
import {useIndicatorList, useIntervalList} from "../../../_hooks/hooks"

interface ChartActionProps {
    label: string
    onClick: () => void
    active?: boolean
}

export const ChartAction: FC<ChartActionProps> = ({label, onClick, active}) => (
    <div onClick={onClick} className={`chart-action ${active ? "active" : ""}`}>
        {label}
    </div>
)

interface DropDownOption {
    label: string
    action: () => void
    active?: boolean
}

interface DropDownMultiOption {
    label: string
    actions: DropDownOption[]
}

interface DropDownProps {
    label: string
    options: [string, () => void][]
}

const DropDown: FC<DropDownProps> = ({label, options}) => {
    const [hover, setHover] = useState<boolean>(false)
    return (
        <div onMouseLeave={() => setHover(false)} className="dropdown-container">
            <div onMouseEnter={() => setHover(true)} className="dropdown-label dropdown-button">{label}</div>
            <div className="dropdown-body" style={{display: hover ? "block" : "none"}}>
                {options.map(opt => <DropDownOption
                    key={opt[0]}
                    label={opt[0]}
                    action={() => {
                        setHover(false)
                        opt[1]()
                    }}
                />)}
            </div>
        </div>
    )
}

interface DropDownOptionProps {
    label: string
    action: () => void
    active?: boolean
}

const DropDownOption: FC<DropDownOptionProps> = ({label, action, active}) => (
    <div className={"dropdown-option " + (active === true ? "active" : "")} onClick={action}>
        {label}
    </div>
)

interface IntervalDropDownProps {
    setInterval: (a: number) => void
    interval: number
}

export const IntervalDropDown: FC<IntervalDropDownProps> = ({setInterval, interval}) => {
    const {intervals} = useIntervalList()
    return (
        <DropDown
            label={formatInterval(interval)}
            options={intervals.map(i => [formatInterval(i), () => {
                setInterval(i)
            }])}
        />
    )
}

interface MultiDropDownProps {
    label: string
    options: DropDownMultiOption[]
}

const DropDownSubOption: FC<DropDownMultiOption> = ({label, actions}) => {
    const [hover, setHover] = useState<boolean>(false)
    return (
        <div
            onMouseLeave={() => setHover(false)}
            className="dropdown-sub-option"
        >
            <div onMouseEnter={() => setHover(true)} className="dropdown-label">{label}</div>
            <div className="dropdown-body" style={{display: hover ? "inline-block" : "none"}}>
                {actions.map(opt => <DropDownOption
                    key={opt.label}
                    label={opt.label}
                    action={opt.action}
                    active={opt.active}
                />)}
            </div>
        </div>
    )
}

const MultiDropDown: FC<MultiDropDownProps> = ({label, options}) => {
    const [hover, setHover] = useState<boolean>(false)
    return (
        <div onMouseLeave={() => setHover(false)} className="dropdown-container">
            <div onMouseEnter={() => setHover(true)} className="dropdown-label dropdown-button">{label}</div>
            <div className="dropdown-body" style={{display: hover ? "block" : "none"}}>
                {options.map(opt => <DropDownSubOption
                    key={opt.label}
                    label={opt.label}
                    actions={opt.actions}
                />)}
            </div>
        </div>
    )
}

interface IndicatorDropDownProps {
    setSelected: (xs: string[]) => void
    selected: string[]
}

export const IndicatorDropDown: FC<IndicatorDropDownProps> = ({selected, setSelected}) => {
    const {indicators} = useIndicatorList()
    return (
        <MultiDropDown
            label={"Indicators"}
            options={indicators.map(ind => ({
                label: ind.name,
                actions: ind.presets.map(preset => {
                    const item = ind.name + ":" + preset.join(",")
                    return ({
                        label: item,
                        active: selected.indexOf(item) !== -1,
                        action: () => {
                            const index = selected.indexOf(item)
                            if (index === -1) {
                                setSelected([...selected, item])
                            } else {
                                const newList = [...selected]
                                newList.splice(index, 1)
                                setSelected(newList)
                            }
                        },
                    })
                }),
            }))}
        />
    )
}
