# react-controlled-AB

React component for integrating test experiences with your react code from a source like VWO and evergage that decides what the variant should be.


## What it does

 - Listens for events dispatched by external sources (must be added manually, format below)
 - Can mount muliple experiences per campaign, experience will be decided by your provider and will be mounted after an event is fired in your experience.
 - Will fall back to control group with option for manual override. Will wait for experience to be triggered before reverting to control group if the campaign is not active.
 - Will not mount a component until an experience is recieved or the (customizeable) timeout expires after the window dom content loaded event to uphold anti-flicker-ness. 
 - Server Side Rendering friendly (will not mount on server side due to nature of campaigns)

## Installation

```

$ npm install --save react-controlled-ab

```

## Usage

to be written

## Props

### campaign 
 
Type: string  Default: undefined

The name of the campaign you are testing, should correspond to the campaign in evergage but is really just a way to group experiences.

### onExperience 
 
Type: function Returns: Campaign with experienceId (number) and isControl (boolean)

Callback that will be executed when an experience or the control is chosen.

### timeout

Type: number Default: 100

The amount of miliseconds to wait after dom content loaded to fallback to the control group if no event is received

### placeholder

Type: boolean Default: false

Mount the control with visibility: hidden set on a container so the place it would usually take up is taken up in the DOM, can help to avoid jarring transitions
