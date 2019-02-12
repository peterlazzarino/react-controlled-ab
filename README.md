# React Controlled AB

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

$ yarn add react-controlled-ab

```

## Usage

```javascript

import React, { Component } from 'react';
import ABTest, { DebugMenu } from "react-controlled-ab"
import { subscribeToCampaign } from "react-controlled-ab/datalayers/vwo/Datalayer"

<ABTest campaign={50} subscribeFunc={subscribeToCampaign}>
    <span>Test 50 - Instance 1 - Control</span>
    <span>Test 50 - Instance 1 - Variant B</span>
    <span>Test 50 - Instance 1 - Variant C</span>
</ABTest>

```

## Props

### campaign 
 
Type: number  Default: undefined

The number of the campaign you are testing, should correspond to the campaign ID in VWO.

### subscribeFunc 
 
Type: function  Default: undefined

The function imported from the datalayer you'd like to use. This prop allows ABTest to know when the campaign variant is identified and or changed.

### onExperience 
 
Type: function Returns: Campaign with experienceId (number) and isControl (boolean)

Callback that will be executed when an experience or the control is chosen.

### timeout

Type: number Default: 100

The amount of miliseconds to wait after dom content loaded to fallback to the control group if no event is received

### placeholder

Type: boolean Default: false

Mount the control with visibility: hidden set on a container so the place it would usually take up is taken up in the DOM, can help to avoid jarring transitions
