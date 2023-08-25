import React, {FC, useCallback, useState} from "react"
import {useIndicatorList} from "../../../_hooks/hooks"
import "./CommandLine.scss"

interface CommandLineProps {
    setIndicators: (mod: ((prev: string[]) => string[])) => void
    indicators: string[]
}

const CommandLine: FC<CommandLineProps> = (props) => {

    const {indicators} = useIndicatorList()
    const [text, setText] = useState<string>("")
    const [output, setOutput] = useState<string>("")

    const evaluate = useCallback((v: string) => {
        setText("")
        setOutput("")
        let args = v.split(" ")
        if (args.length === 0) {
            return
        }

        args = args.reverse()

        let kind = ""
        let actionName = args.pop()
        switch (actionName) {
            case "":
                setOutput("")
                return
            case "show":
            case "hide":
                kind = "toggle"
                break
            case "clear":
                kind = "clear"
                break
            case "indicators":
                setOutput(indicators.map(i => i.name).join(", "))
                return
            default:
                setOutput("unknown command: " + actionName)
                return
        }

        switch (kind) {
            case "clear": {
                if (args.length === 0) {
                    props.setIndicators(() => [])
                    return
                }
                const name = args.pop()
                if (name === undefined) return
                props.setIndicators(prev => {
                    return prev.filter(v => v.indexOf(name) !== 0)
                })
                return
            }
            case "toggle": {
                const name = args.pop()
                if (!name) {
                    setOutput("invalid indicator name")
                }
                let indicator = null
                indicators.forEach(ind => {
                    if (ind.name === name) {
                        indicator = ind
                    }
                })
                if (indicator === null) {
                    setOutput("unknown indicator: " + name)
                    return
                }
                const key = `${name}:${args.reverse().join(",")}`
                if (actionName === "show") {
                    props.setIndicators(prev => {
                        const cp = [...prev]
                        cp.push(key)
                        return cp
                    })
                } else {
                    props.setIndicators(prev => {
                        const cp = [...prev]
                        const index = cp.indexOf(key)
                        if (index === -1) return cp
                        cp.splice(index, 1)
                        return cp
                    })
                }
                break
            }
            default:
                setOutput("unknown option: " + args[0])
                return
        }

    }, [indicators])

    return (
        <form className="cl-container" onSubmit={e => {
            e.preventDefault()
            evaluate(text)
        }}>
            <div className="row">
                <div className="cl-prefix">
                    &gt;
                </div>
                <input className="cl-input" type="text" placeholder="Command" value={text}
                       onInput={e => {
                           const v = e.currentTarget.value
                           setText(v)
                       }}/>
            </div>
            {output.length > 0 ? (
                <div className="row">
                    <div className="cl-error">
                        {output}
                    </div>
                </div>
            ) : null}
        </form>
    )
}

export default CommandLine
