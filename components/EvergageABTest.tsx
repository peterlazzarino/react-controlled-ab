import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { subscribeToCampaign } from "evergage-datalayer"

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
    selectedExperience: IVariant;
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
    }
    public componentDidMount () {
        if(!canUseDOM) {
            return;
        }
        const { campaign,  eventPrefix, timeout } = this.props;
        subscribeToCampaign(this.handleEvent, campaign);
    }
    public handleEvent (campaign) {
        const currentExperienceIndex = parseInt(campaign.experienceName.match(/\d+/)[0]);
        const currentExperience = this.props.variants[currentExperienceIndex];
        this.setState({
            selectedExperience: currentExperience,
            campaignEventReceived: true
        });
    }
    public render () {
        let experienceNode = null;
        const { variants, supressFallback, placeholder } = this.props;
        const { selectedExperience } = this.state;
        const fallBackVariant = supressFallback ? null : variants[0];
        if(canUseDOM && selectedExperience != null) {
            experienceNode = selectedExperience.node;
        } else if (!supressFallback && placeholder) {
            const placeholderStyle = {
                visibility: "hidden",
            };
            return <div style={placeholderStyle}>{fallBackVariant.node}</div>;
        }
        return (
            experienceNode
        );
    }
}
