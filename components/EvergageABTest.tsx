import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { Campaign, ICampaign } from "../models/Campaign";
import { subscribeToCampaign } from "evergage-datalayer";

const canUseDOM = typeof window !== "undefined";

export interface IEvergageABTestProps {
    campaign: string;
    eventPrefix: string;
    timeout: number;
    isVisible: boolean;
    supressFallback: boolean;
    defaultExperience: number;
    onExperience: (ICampaign) => void;
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
        this.callbackExperience = this.callbackExperience.bind(this);
        this.checkForExperience = this.checkForExperience.bind(this);
        this.renderExperience = this.renderExperience.bind(this);
    }
    public componentDidMount () {
        if(!canUseDOM) {
            return;
        }
        const { campaign, eventPrefix, timeout } = this.props;
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
            this.callbackExperience(0);
        }
    }
    public handleEvent (campaign) {
        const currentExperienceIndex = parseInt(campaign.experienceName.match(/\d+/)[0], 10);
        this.setState({
            selectedExperience: currentExperienceIndex,
            campaignEventReceived: true,
        });
        this.callbackExperience(currentExperienceIndex);
    }
    public callbackExperience (experienceId) {
        const { campaign } = this.props;
        const campaignObj = new Campaign(experienceId, campaign);
        if(this.props.onExperience) {
            this.props.onExperience(campaignObj);
        }
    }
    public renderExperience (children, selectedExperience, campaign) {
        try {
            const experiencedReceived = children[selectedExperience];
            return (
                experiencedReceived
            );
        } catch(err) {
            const errorMessage = `You do not have enough children to match the amount of experiences you have
            configured in evergage... Campaign: ${campaign} Experience selected: ${selectedExperience}`;
            // tslint:disable-next-line:no-console
            console.warn(errorMessage);
            return null;
        }
    }
    public render () {
        const { supressFallback, isVisible, children, campaign} = this.props;
        const { selectedExperience } = this.state;
        if(!canUseDOM) {
            return null;
        }
        if (!supressFallback && isVisible && selectedExperience === undefined) {
            const isVisibleStyle = {
                visibility: "hidden",
            };
            return <div style={isVisibleStyle}>{children[0]}</div>;
        } else if (selectedExperience === undefined) {
            return null;
        }
        return this.renderExperience(children, selectedExperience, campaign);
    }
}
