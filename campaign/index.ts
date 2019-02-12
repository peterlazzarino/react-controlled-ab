import * as React from "react";
import * as PropTypes from "prop-types";
import * as indexOf from "array-index-of";

const campaignChangeHandlers = [];
const campaignChangeSubscribers = [];

export const setHandler = (id, callback) => {
    if(!campaignChangeHandlers[id]){
        campaignChangeHandlers[id] = [];
    }
    campaignChangeHandlers[id].push({
        id,
        callback
    })
}

export const subscribeToCampaigns = (callback) => {
    campaignChangeSubscribers.push(callback);
}

export const sendInitialValue = (id, value, callback) => {
    sendValue(value, callback);
    notifyCampaignSubscribers(id, value);
}

export const updateCampaign = (id, value) => {
    const callbacks = getCallbacks(id);
    callbacks.forEach(({ callback }) => {
        callback(value);
    });
    notifyCampaignSubscribers(id, value);
}

const notifyCampaignSubscribers = (id, value) => {
    campaignChangeSubscribers.forEach((cb) => {
        cb(id, value)
    })
}

const getCallbacks = (id) => {
    return campaignChangeHandlers[id];
}

const sendValue = (value, callback) => {
    callback(value);
}