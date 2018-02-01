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

Set up your campaign in evergage, with as many experiences as you would like test variants.

Then in your application use the EvergageAB component for your campaign, giving it children to render for each experience. The first child is the control and subsequent children should be experiences in order, First experience is second child and so on.

```javascript
import React from 'react';
import EvergageAB from "react-evergage-ab";

class Header extends Component {
    render() {
        return (
            <div>
                <EvergageAB campaign="logoTest">
                    <h1>Test header</h1>
                    <span>Test header in span</span>
                    <span><b>Bold header in span</b></span>
                </EvergageAB>
            </div>
        )
    };
}
```


## Props

### campaign

Type: string  Default: undefined

The name of the campaign you are testing, should correspond to the campaign in evergage but is really just a way to group experiences.

### timeout

Type: number Default: 100

The amount of miliseconds to wait after dom content loaded to fallback to the control group if no event is received

### placeholder

Type: boolean Default: false

Mount the control with visibility: hidden set on a container so the place it would usually take up is taken up in the DOM, can help to avoid jarring transitions
