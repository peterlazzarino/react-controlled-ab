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
        if(!canUseDOM) {
            return <div />;
        }
        const { variants, campaign } = this.props;
        if(this.state.selectedExperience == null) {
            return <div />;
        }
        const experience = variants[this.state.selectedExperience];
        const experienceNode = experience.node;
        return (
            experienceNode
        );
    }
}
