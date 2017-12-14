import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";

const canUseDOM = typeof window !== "undefined";

export interface IVariant {
    name: string;
    node: JSX.Element;
}

export interface IEvergageABTestProps {
    variants: IVariant[];
    campaign: string;
    eventPrefix: string;
    timeout: number;
    placeholder: boolean;
    supressFallback: boolean;
    defaultExperience: number;
}

export interface IEvergageABTestState {
    selectedExperience: number;
    campaignEventReceived: boolean;
}

export default class EvergageABTest extends React.Component<IEvergageABTestProps, IEvergageABTestState> {
    public static defaultProps: Partial<IEvergageABTestProps> = {
        eventPrefix: "EvergageAB",
        timeout: 100,
        defaultExperience: 0,
    };
    constructor (props) {
        super(props);
        this.state = {
            selectedExperience: null,
            campaignEventReceived: false,
        };
        this.handleEvent = this.handleEvent.bind(this);
        this.checkForExperience = this.checkForExperience.bind(this);
    }
    public componentDidMount () {
        if(!canUseDOM) {
            return;
        }
        const { checkForExperience, handleEvent, props : { campaign,  eventPrefix, timeout } } = this;
        window.addEventListener(`${eventPrefix}-${campaign}`, handleEvent);
        if(document.readyState === "complete") {
            window.setTimeout(checkForExperience, timeout);
            return;
        }
        window.addEventListener("load", () => {
            window.setTimeout(checkForExperience, timeout);
        });
    }
    public componentWillUnmount () {
        const { checkForExperience, handleEvent, props : { campaign,  eventPrefix, timeout } } = this;
        window.removeEventListener(`${eventPrefix}-${campaign}`, handleEvent);
    }
    public checkForExperience () {
        if(!this.state.campaignEventReceived && !this.props.supressFallback) {
            this.setState({
                selectedExperience: this.props.defaultExperience,
            });
        }
    }
    public handleEvent (listener) {
        const {detail : experience} = listener;
        const notFoundIndex = -1;
        const chosenExperience = indexOf(this.props.variants, experience.variant, (inArr, variant) => {
            return inArr.name === variant;
        });
        if(chosenExperience !== notFoundIndex) {
            this.setState({
                selectedExperience: chosenExperience,
            });
        }
        this.setState({
            campaignEventReceived: true,
        });
    }
    public render () {
        let experienceNode = null;
        const { variants, supressFallback, placeholder } = this.props;
        const { selectedExperience } = this.state;
        const fallBackVariant = supressFallback ? null : variants[0];
        if(canUseDOM && selectedExperience != null) {
            const experience = variants[selectedExperience];
            experienceNode = experience.node;
        }
        else if(!canUseDOM && fallBackVariant){
            return fallBackVariant;
        }
        else if(!canUseDOM && placeholder){
            var placeholderStyle = {
                visibility: "hidden"
            };
            return <div style={placeholderStyle}>{fallBackVariant}</div>
        }
        return (
            experienceNode
        );
    }
}
