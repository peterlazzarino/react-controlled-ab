import * as React from "react";
import * as PropTypes from "prop-types";
import indexOf from "array-index-of";

const canUseDOM = typeof window == 'undefined';

export interface Variant {
    name: string;
    node: JSX.Element;
}

export interface IEvergageABTestProps {
    variants: Array<Variant>;
    campaign: string;
    eventPrefix: string;
    timeout: number;
    defaultExperience: number;
}

export default class EvergageABTest extends React.Component<IEvergageABTestProps, any> {
    public static defaultProps: Partial<IEvergageABTestProps> = {        
        eventPrefix: "EvergageAB",
        timeout: 100,
        defaultExperience: 0
    };
    constructor(props){
        super(props);
        this.state = {
            selectedExperience: null
        }
        this.handleEvent = this.handleEvent.bind(this);
        this.checkForExperience = this.checkForExperience.bind(this);
    }
    componentDidMount(){
        if(!canUseDOM){
            return;
        }
        const { checkForExperience, handleEvent, props : { campaign,  eventPrefix, timeout } } = this;
        window.addEventListener(`${eventPrefix}-${campaign}`, handleEvent);
        window.onload = function() {
            window.setTimeout(checkForExperience, timeout);
        };
    }
    checkForExperience(){
        if(this.state.selectedExperience == null){            
            this.setState({
                selectedExperience: this.props.defaultExperience
            })
        }
    }
    handleEvent(listener){
        const {detail : experience} = listener;
        const chosenExperience = indexOf(this.props.variants, experience.variant, function(inArr, variant) {
            return inArr.name === variant;
        }); 
        if(chosenExperience != null){
            this.setState({
                selectedExperience: chosenExperience
            })
        }
    }
    public render(){
        if(!canUseDOM){
            return null!;
        }
        const { variants, campaign } = this.props;
        if(this.state.selectedExperience == null){
            return null!;
        }
        const experience = variants[this.state.selectedExperience];
        const experienceNode = experience.node;
        return (
            experienceNode
        );
    }
}