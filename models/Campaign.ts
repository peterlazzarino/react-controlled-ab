export interface ICampaign extends Campaign {
    isControl: boolean;
    experienceId: string;
}

export class Campaign { 
    constructor(experienceId, campaignName){
        this.experienceId = experienceId;
        this.campaign = campaignName;
    }
    experienceId: string;
    campaign: string
    isControl: boolean;
}