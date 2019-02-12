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
                    Campaign ID: <b>{key}</b> -
                    Variant :
                    <select
                        onChange={({ target: { value }}) => { updateCampaign(key, parseInt(value, 10));} }
                        value={this.state.campaigns[key]}
                    >
                        <option value={0}>Control</option>
                        <option value={1}>B</option>
                        <option value={2}>C</option>
                        <option value={4}>D</option>
                        <option value={5}>E</option>
                    </select>
                </div>,
            );
        }
        return (
            <div style={{
                position: "fixed",
                bottom: 0,
                right: 15,
                padding: "0 15px 15px",
                width: "300px",
                backgroundColor: "#efefef",
            }}>
                <h3 style={{ textAlign: "center" }}>Active A/B Tests</h3>
                {rows}
            </div>
        );
    }
    private showCampaign = (id, value) => {
        const newCampaignState = { ...this.state.campaigns };
        newCampaignState[id] = value;
        this.setState({
            campaigns: newCampaignState,
        });
    }
}
