import{j as s}from"./iframe-DkmuYHKw.js";import{R as m,a as d,d as u,b,c as T}from"./renderer-adOzdDl_.js";import{E as r}from"./story-channel-hooks-GAfT5i3h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIOz3mgL.js";import"./index-BLh5tBf0.js";const h=["integer","decimal"];function p(e,n,t){return e==="integer"?{url:n,valueInteger:Math.round(t)}:{url:n,valueDecimal:t}}function c(e){const n=[];return(e.boundsMode==="min"||e.boundsMode==="minMax")&&n.push(p(e.answerType,r.MIN_VALUE,e.minValue)),(e.boundsMode==="max"||e.boundsMode==="minMax")&&n.push(p(e.answerType,r.MAX_VALUE,e.maxValue)),e.unitLabel.trim().length>0&&n.push({url:r.QUESTIONNAIRE_UNIT,valueCoding:{display:e.unitLabel}}),e.placeholder&&e.placeholder.trim().length>0&&n.push({url:r.ENTRY_FORMAT,valueString:e.placeholder}),n}function L(e,n){return e==="integer"?{url:r.SLIDER_STEP_VALUE,valueInteger:Math.round(n)}:{url:r.SLIDER_STEP_VALUE,valueDecimal:n}}function y(e,n,t){if(t===void 0)return[];const i=[t];if(n){const x=e==="integer"?1:.5;i.push(t+x)}return T(e,i)}function w(e){const n=c({answerType:e.answerType,boundsMode:e.boundsMode,minValue:e.minValue,maxValue:e.maxValue,unitLabel:e.unitLabel});e.useStep&&n.push(L(e.answerType,e.step));const t=[];return e.lowerLabel.trim().length>0&&t.push(u({linkId:"lower-label",text:e.lowerLabel,control:"lower"})),e.upperLabel.trim().length>0&&t.push(u({linkId:"upper-label",text:e.upperLabel,control:"upper"})),b({linkId:"number-slider",text:`Number slider (${e.answerType})`,type:e.answerType,control:"slider",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:y(e.answerType,e.repeats,e.initialValue),item:t})}function S(e){const n=c({answerType:e.answerType,boundsMode:e.boundsMode,minValue:e.minValue,maxValue:e.maxValue,unitLabel:e.unitLabel,placeholder:e.placeholder});return b({linkId:"number-spinner",text:`Number spinner (${e.answerType})`,type:e.answerType,control:"spinner",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:y(e.answerType,e.repeats,e.initialValue)})}const a={answerType:{name:"Answer type",options:h,control:{type:"select"}},repeats:{name:"Repeats",control:{type:"boolean"}},readOnly:{name:"Read-only",control:{type:"boolean"}},boundsMode:{name:"Bounds mode",options:["none","min","max","minMax"],control:{type:"select"}},minValue:{name:"Min value",control:{type:"number"}},maxValue:{name:"Max value",control:{type:"number"}},unitLabel:{name:"Unit label",control:{type:"text"}},initialValue:{name:"Initial value",control:{type:"number"}}},R={title:"Renderers/Numeric",parameters:{layout:"padded",docs:{description:{component:"Numeric renderer playgrounds for slider and spinner behaviors."}}},argTypes:a,args:{answerType:"decimal",repeats:!1,readOnly:!1,boundsMode:"minMax",minValue:0,maxValue:100,unitLabel:"mg",initialValue:25}},o={name:"Number slider",args:{useStep:!0,step:5,lowerLabel:"Low",upperLabel:"High"},argTypes:{...a,useStep:{name:"Use step extension",control:{type:"boolean"}},step:{name:"Step",control:{type:"number"},if:{arg:"useStep",truthy:!0}},lowerLabel:{name:"Lower label",control:{type:"text"}},upperLabel:{name:"Upper label",control:{type:"text"}}},render:(e,n)=>{const t=w(e);return s.jsx(m,{questionnaire:d(t),storyId:n.id})}},l={name:"Number spinner",args:{placeholder:"Enter value"},argTypes:{...a,placeholder:{name:"Placeholder",control:{type:"text"}}},render:(e,n)=>{const t=S(e);return s.jsx(m,{questionnaire:d(t),storyId:n.id})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Number slider",
  args: {
    useStep: true,
    step: 5,
    lowerLabel: "Low",
    upperLabel: "High"
  },
  argTypes: {
    ...baseArgTypes,
    useStep: {
      name: "Use step extension",
      control: {
        type: "boolean"
      }
    },
    step: {
      name: "Step",
      control: {
        type: "number"
      },
      if: {
        arg: "useStep",
        truthy: true
      }
    },
    lowerLabel: {
      name: "Lower label",
      control: {
        type: "text"
      }
    },
    upperLabel: {
      name: "Upper label",
      control: {
        type: "text"
      }
    }
  },
  render: (args, context) => {
    const item = buildNumberSliderItem(args);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />;
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Number spinner",
  args: {
    placeholder: "Enter value"
  },
  argTypes: {
    ...baseArgTypes,
    placeholder: {
      name: "Placeholder",
      control: {
        type: "text"
      }
    }
  },
  render: (args, context) => {
    const item = buildNumberSpinnerItem(args);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />;
  }
}`,...l.parameters?.docs?.source}}};const A=["NumberSliderRenderer","NumberSpinnerRenderer"];export{o as NumberSliderRenderer,l as NumberSpinnerRenderer,A as __namedExportsOrder,R as default};
