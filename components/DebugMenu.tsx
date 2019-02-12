import * as React from "react";

export default class ABTest extends React.Component<any, any> {
    public render () {
        return (
            <div style={{
                position: "fixed",
                bottom: 0,
                right: 15,
                padding: "15px",
                width: "300px",
                backgroundColor: "#efefef",
            }}>
                <h3 style={{ textAlign: "center" }}>Active A/B Tests</h3>
            </div>
        );
    }
}
