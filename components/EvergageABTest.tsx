import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { subscribeToCampaign } from "evergage-datalayer";

const canUseDOM = typeof window !== "undefined";

export interface IVariant {
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
    selectedExperience: JSX.Element;
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
        const { campaign,  eventPrefix, timeout } = this.props;
        subscribeToCampaign(this.handleEvent, campaign);
        if(document.readyState === "complete") {
            window.setTimeout(this.checkForExperience, timeout);
            return;
        }
        window.addEventListener("load", () => {
            window.setTimeout(this.checkForExperience, timeout);
        });
    }
    public checkForExperience () {
        const { children } = this.props;
        if(!this.state.campaignEventReceived && !this.props.supressFallback) {
            this.setState({
                selectedExperience: React.Children.only(children),
            });
        }
    }
    public handleEvent (campaign) {
        const currentExperienceIndex = parseInt(campaign.experienceName.match(/\d+/)[0], 10) - 1;
        const currentExperience = this.props.variants[currentExperienceIndex];
        this.setState({
            selectedExperience: currentExperience.node,
            campaignEventReceived: true,
        });
    }
    public render () {
        let experienceNode = null;
        const { supressFallback, placeholder, children } = this.props;
        const { selectedExperience } = this.state;
        const fallBackVariant = supressFallback ? null : React.Children.only(children);
        if(canUseDOM && selectedExperience != null) {
            experienceNode = selectedExperience;
        } else if (!supressFallback && placeholder) {
            const placeholderStyle = {
                visibility: "hidden",
            };
            return <div style={placeholderStyle}>{fallBackVariant}</div>;
        }
        return (
            experienceNode
        );
    }
}
