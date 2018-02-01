import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { subscribeToCampaign } from "evergage-datalayer";

const canUseDOM = typeof window !== "undefined";

export interface IEvergageABTestProps {
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
            selectedExperience: undefined,
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
                selectedExperience: 0,
            });
        }
    }
    public handleEvent (campaign) {
        const currentExperienceIndex = parseInt(campaign.experienceName.match(/\d+/)[0], 10);
        this.setState({
            selectedExperience: currentExperienceIndex,
            campaignEventReceived: true,
        });
    }
    public render () {
        const { supressFallback, placeholder, children } = this.props;
        const { selectedExperience } = this.state;
        if(!canUseDOM) {
            return null;
        }
        if (!supressFallback && placeholder && selectedExperience === undefined) {
            const placeholderStyle = {
                visibility: "hidden",
            };
            return <div style={placeholderStyle}>{children[0]}</div>;
        } else if (selectedExperience === undefined) {
            return null;
        }
        return (
            children[selectedExperience]
        );
    }
}
