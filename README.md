# react-evergage-AB

Integrate Evergage AB testing experiences into your react code.


## What it does

 - Listens for events dispatched by evergage experiences (must be added manually, format below)
 - Can mount muliple experiences per evergage campaign, experience will be decided by evergage and will be mounted after an event is fired in your evergage experience.
 - Will fall back to control group with option for manual override. Will wait for experience to be triggered by evergage before reverting to control group if the campaign is not active.
 - Will not mount a component until evergage gives an experience or the (customizeable) timeout expires after the window dom content loaded event to uphold anti-flicker-ness. 
 - Server Side Rendering friendly (will not mount on server side due to nature of campaigns)

## Installation

```
$ npm install --save react-evergage-ab
```

## Usage

Set up your campaign in evergage, for each experience (except for control) paste the following into the experience javascript for an invisible message.

Where campaign is the name of your campaign and variant is a descriptor for the experience you are editing.

```javascript    

    var event = document.createEvent("CustomEvent");
    event.initCustomEvent("EvergageAB-campaign", false, true, { variant: "variant"});
    window.dispatchEvent(event);

```
The EvergageAB can be overriden in the component props. 

Then in your application use the EvergageAB component for your campaign, giving it an array of variants each with its experience descriptor and a component to render.

```javascript
import React from 'react';
import EvergageAB from "react-evergage-ab";

class Header extends Component {
    render() {
        return (
            <div>
                <EvergageAB campaign="logoTest" variants={[
                    {
                        name: "headingTest",
                        node: <h1>Test header</h1>
                    }, {
                        name: "spanHeading",
                        node: <span>Test header in span</span>
                    }, {
                        name: "boldHeading",
                        node: <span><b>Bold header in span</b></span>
                    }
                ]} />
            </div>
        )
    };
}

```


## Props

### variants

Type: Array({Name: string, Node: JSX.Element}) Default: undefined

Your name / node pairs of experience descriptors and the node that will mount if that experience is chosen.

### campaign

Type: string  Default: undefined

The name of the campaign you are testing, should correspond to the campaign in evergage but is really just a way to group experiences.

### eventPrefix

Type: string Default: EvergageAB

The prefix for events that the components listens to

### timeout

Type: number Default: 100

The amount of miliseconds to wait after dom content loaded to fallback to the control group if no event is received

### defaultExperience

Type: number Default: 0

The index of the variants array to show after timeout after dom loaded to fallback to, uses 0 by default.