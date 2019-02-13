import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";
import { sendInitialValue, setHandler } from "../../campaign"

const campaignValues = [];

export const subscribeToCampaign = (callback, campaignId) => {
    setHandler(campaignId, callback)
    findCampaignValue(campaignId, callback, sendInitialValue);
}

const findCampaignValue = (campaignId, callback, sendInitialValue) => {
    if(campaignValues[campaignId]){
        sendInitialValue(campaignId, campaignValues[campaignId], callback)
    }
    let attempts = 0;
    let interval = setInterval(function(){                
        const campaignDefaultVal = getCookie(`_vis_opt_exp_${campaignId}_combi`);
        const campaignDebugVal = getCookie(`debug_vis_opt_exp_${campaignId}_combi`);
        const campaignVal = campaignDefaultVal || campaignDebugVal;
        if(campaignVal){
            clearInterval(interval);
            const vwoVariant = parseInt(campaignVal) - 1;
            campaignValues[campaignId] = vwoVariant;
            sendInitialValue(campaignId, vwoVariant, callback)
        } else if (attempts > 10){
            clearInterval(interval);
            sendInitialValue(campaignId, 0, callback)
        }
    }, 50);
}

const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}