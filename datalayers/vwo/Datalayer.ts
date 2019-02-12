import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { sendInitialValue, setHandler } from "../../campaign"

const campaignValues = [];

export const subscribeToCampaign = (callback, campaignId) => {
    setHandler(campaignId, callback)
    sendInitialValue(campaignId, findCampaignValue(campaignId), callback)
}

const findCampaignValue = (campaignId) => {
    if(campaignValues[campaignId]){
        return campaignValues[campaignId];
    }
    let attempts = 0;
    let campaignValue = 0;
    let interval = setInterval(function(){                
        const campaignDefaultVal = getCookie(`_vis_opt_exp_${campaignId}_combi`);
        const campaignDebugVal = getCookie(`debug_vis_opt_exp_${campaignId}_combi`);
        const campaignVal = campaignDefaultVal || campaignDebugVal;
        if(campaignVal){
            clearInterval(interval);
            campaignValue = parseInt(campaignVal) - 1;
            campaignValues[campaignId] = campaignVal;
            return campaignValue;
        } else if (attempts > 10){
            clearInterval(interval);
        }
    }, 50);
    return campaignValue;
}

const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}