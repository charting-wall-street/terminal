import React, {FC} from "react"

export const VerticalPanelContainer: FC = ({children}) => (
    <div className="panel-container vertical-container">
        {children}
    </div>
)

export const PanelContainer: FC = ({children}) => (
    <div className="panel-container">
        {children}
    </div>
)

export const PanelEqualContainer: FC = ({children}) => (
    <div className="panel-container panel-equal">
        {children}
    </div>
)

type PanelWithTitleProps = {
    title: string
} & PanelProps

export const PanelWithTitle: FC<PanelWithTitleProps> = ({title, children, ...props}) => (
    <Panel {...props}>
        <div className="panel-title">
            {title}
        </div>
        {children}
    </Panel>
)


interface PanelProps {
    grow?: boolean
    className?: string
}

export const Panel: FC<PanelProps> = ({children, grow, className}) => (
    <div className={"panel " + (className ? className : "")} style={{flexGrow: grow ? 1 : undefined}}>
        <div className="inner-panel">
            {children}
        </div>
    </div>
)


interface ErrorModalProps {
    error?: any
}

export const ErrorModal: FC<ErrorModalProps> = ({error}) => {
    if (error === null || error === undefined) return null
    let message = "Error"
    if (typeof error === "string") {
        message = error
    } else if (typeof error === "object") {
        message = error.toString()
    }
    return (
        <div className="error-container">{message}</div>
    )
}
