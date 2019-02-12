import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";

const currentCampaigns = [];

const getCookie = (name) => {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

export const subscribeToCampaign = (callback, campaignId) => {
    const currentCampaign = currentCampaigns[campaignId];
    if (currentCampaign) {
        callback(currentCampaign);
    } else {        
        findCampaignValue(callback, campaignId);
    }
}

const findCampaignValue = (callback, campaignId) => {
    let attempts = 0;
    let interval = setInterval(function(){                
        let campaignVal = getCookie(`_vis_opt_exp_${campaignId}_combi`);
        if(campaignVal){
            clearInterval(interval);
            passCampaign(callback, campaignId, campaignVal);
        } else if (attempts > 10){
            clearInterval(interval);
        }
    }, 50);
}

const passCampaign = (callback, campaignId, campaignVal) => {
    let campaign = {
        variantIndex: parseInt(campaignVal) - 1,
        campaignId
    }
    callback(campaign);
    storeCampaign(campaign, campaignId);   
}

const storeCampaign = (campaign, id) => {
    if (!currentCampaigns[id]) {
        currentCampaigns[id] = [];
    }
    currentCampaigns[id] = campaign;
}