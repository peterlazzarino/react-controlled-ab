import * as React from "react";
import { subscribeToCampaigns, updateCampaign } from "../campaign";

export default class DebugMenu extends React.Component<any, any> {
    constructor () {
        super();
        this.state = {
            campaigns: [],
        };
    }
    public componentDidMount () {
        subscribeToCampaigns(this.showCampaign);
    }
    public render () {
        const rows = [];
        for(const key of Object.keys(this.state.campaigns)){
            rows.push(
                <div>
                    <b>{key}</b> -
                    <select
                        onChange={({ target: { value }}) => { updateCampaign(key, parseInt(value, 10));} }
                        value={this.state.campaigns[key].value}
                    >
                        <option value={0}>Control</option>
                        <option value={1}>B</option>
                        <option value={2}>C</option>
                        <option value={4}>D</option>
                        <option value={5}>E</option>
                    </select>
                    {!this.state.campaigns[key].isInDatalayer &&
                        <p style={{ fontSize: "10px" }}><i>Not found in datalayer</i></p>
                    }
                </div>,
            );
        }
        return (
            <div style={{
                position: "fixed",
                bottom: 0,
                right: 15,
                padding: "15px",
                width: "200px",
                backgroundColor: "#efefef",
            }}>
                <span style={{
                    display: "inline-block",
                    marginBottom: "10px",
                }}><b>Campaign ID</b> - Variant ID</span>
                {rows}
            </div>
        );
    }
    private showCampaign = (id, value) => {
        const isInDatalayer = typeof value !== "undefined";
        const campaignObj = {
            id,
            isInDatalayer,
            value,
        };
        this.setState((prevState) => ({
            campaigns: {
                ...prevState.campaigns,
                [id]: campaignObj,
            },
        }));
    }
}
