import * as React from "react";
import { Campaign, ICampaign } from "../models/Campaign";

const canUseDOM = typeof window !== "undefined";

export interface IABTestProps {
    campaign: string;
    timeout: number;
    placeholder: boolean;
    subscribeFunc: (a: any, b: any) => void;
    supressFallback: boolean;
    defaultExperience: number;
    onExperience: (ICampaign) => void;
}

export interface IABTestState {
    selectedExperience: number;
    campaignEventReceived: boolean;
}

export default class ABTest extends React.Component<IABTestProps, IABTestState> {
    public static defaultProps: Partial<IABTestProps> = {
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
        const { campaign, timeout, subscribeFunc } = this.props;
        subscribeFunc(this.handleEvent, campaign);
        if(document.readyState === "complete") {
            window.setTimeout(this.checkForExperience, timeout);
            return;
        }
        window.addEventListener("load", () => {
            window.setTimeout(this.checkForExperience, timeout);
        });
    }
    public checkForExperience () {
        if(!this.state.campaignEventReceived && !this.props.supressFallback) {
            this.setState({
                selectedExperience: 0,
            });
            this.callbackExperience(0);
        }
    }
    public handleEvent (campaign) {
        this.setState({
            selectedExperience: campaign.variantIndex,
            campaignEventReceived: true,
        });
        this.callbackExperience(campaign.variantIndex);
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
            configured.`;
            // tslint:disable-next-line:no-console
            console.warn(errorMessage);
            return null;
        }
    }
    public render () {
        const { supressFallback, placeholder, children, campaign} = this.props;
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
        return this.renderExperience(children, selectedExperience, campaign);
    }
}
