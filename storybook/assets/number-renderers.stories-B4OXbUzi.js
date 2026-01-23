import{j as d,E as t}from"./iframe-CBDoljZZ.js";import{a as u,d as p,b as m,c as T}from"./helpers-DLmuXnqe.js";import{R as b}from"./renderer-DKxI98zX.js";import"./preload-helper-PPVm8Dsz.js";import"./index-DBYB0CXh.js";import"./index-CvubN1HK.js";import"./index-B0SISItl.js";const h=["integer","decimal"];function s(e,n,r){return e==="integer"?{url:n,valueInteger:Math.round(r)}:{url:n,valueDecimal:r}}function c(e){const n=[];return(e.boundsMode==="min"||e.boundsMode==="minMax")&&n.push(s(e.answerType,t.MIN_VALUE,e.minValue)),(e.boundsMode==="max"||e.boundsMode==="minMax")&&n.push(s(e.answerType,t.MAX_VALUE,e.maxValue)),e.unitLabel.trim().length>0&&n.push({url:t.QUESTIONNAIRE_UNIT,valueCoding:{display:e.unitLabel}}),e.placeholder&&e.placeholder.trim().length>0&&n.push({url:t.ENTRY_FORMAT,valueString:e.placeholder}),n}function L(e,n){return e==="integer"?{url:t.SLIDER_STEP_VALUE,valueInteger:Math.round(n)}:{url:t.SLIDER_STEP_VALUE,valueDecimal:n}}function y(e,n,r){if(r===void 0)return[];const i=[r];if(n){const x=e==="integer"?1:.5;i.push(r+x)}return T(e,i)}function w(e){const n=c({answerType:e.answerType,boundsMode:e.boundsMode,minValue:e.minValue,maxValue:e.maxValue,unitLabel:e.unitLabel});e.useStep&&n.push(L(e.answerType,e.step));const r=[];return e.lowerLabel.trim().length>0&&r.push(p({linkId:"lower-label",text:e.lowerLabel,control:"lower"})),e.upperLabel.trim().length>0&&r.push(p({linkId:"upper-label",text:e.upperLabel,control:"upper"})),m({linkId:"number-slider",text:`Number slider (${e.answerType})`,type:e.answerType,control:"slider",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:y(e.answerType,e.repeats,e.initialValue),item:r})}function S(e){const n=c({answerType:e.answerType,boundsMode:e.boundsMode,minValue:e.minValue,maxValue:e.maxValue,unitLabel:e.unitLabel,placeholder:e.placeholder});return m({linkId:"number-spinner",text:`Number spinner (${e.answerType})`,type:e.answerType,control:"spinner",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:y(e.answerType,e.repeats,e.initialValue)})}const a={answerType:{name:"Answer type",options:h,control:{type:"select"}},repeats:{name:"Repeats",control:{type:"boolean"}},readOnly:{name:"Read-only",control:{type:"boolean"}},boundsMode:{name:"Bounds mode",options:["none","min","max","minMax"],control:{type:"select"}},minValue:{name:"Min value",control:{type:"number"}},maxValue:{name:"Max value",control:{type:"number"}},unitLabel:{name:"Unit label",control:{type:"text"}},initialValue:{name:"Initial value",control:{type:"number"}}},A={title:"Renderers/Numeric",parameters:{layout:"padded",docs:{description:{component:"Numeric renderer playgrounds for slider and spinner behaviors."}}},argTypes:a,args:{answerType:"decimal",repeats:!1,readOnly:!1,boundsMode:"minMax",minValue:0,maxValue:100,unitLabel:"mg",initialValue:25}},o={name:"Number slider",args:{useStep:!0,step:5,lowerLabel:"Low",upperLabel:"High"},argTypes:{...a,useStep:{name:"Use step extension",control:{type:"boolean"}},step:{name:"Step",control:{type:"number"},if:{arg:"useStep",truthy:!0}},lowerLabel:{name:"Lower label",control:{type:"text"}},upperLabel:{name:"Upper label",control:{type:"text"}}},render:(e,n)=>{const r=w(e);return d.jsx(b,{questionnaire:u(r),storyId:n.id,mode:"node"})}},l={name:"Number spinner",args:{placeholder:"Enter value"},argTypes:{...a,placeholder:{name:"Placeholder",control:{type:"text"}}},render:(e,n)=>{const r=S(e);return d.jsx(b,{questionnaire:u(r),storyId:n.id,mode:"node"})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Number slider",
  args: {
    useStep: true,
    step: 5,
    lowerLabel: "Low",
    upperLabel: "High"
  },
  argTypes: {
    ...baseArgumentTypes,
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
  render: (arguments_, context) => {
    const item = buildNumberSliderItem(arguments_);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
}`,...o.parameters?.docs?.source}}};l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  name: "Number spinner",
  args: {
    placeholder: "Enter value"
  },
  argTypes: {
    ...baseArgumentTypes,
    placeholder: {
      name: "Placeholder",
      control: {
        type: "text"
      }
    }
  },
  render: (arguments_, context) => {
    const item = buildNumberSpinnerItem(arguments_);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
}`,...l.parameters?.docs?.source}}};const U=["NumberSliderRenderer","NumberSpinnerRenderer"];export{o as NumberSliderRenderer,l as NumberSpinnerRenderer,U as __namedExportsOrder,A as default};
