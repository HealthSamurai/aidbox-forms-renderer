import{j as p}from"./iframe-DkmuYHKw.js";import{R as m,a as y,b as c,c as S}from"./renderer-adOzdDl_.js";import{E as a}from"./story-channel-hooks-GAfT5i3h.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CIOz3mgL.js";import"./index-BLh5tBf0.js";const r="http://unitsofmeasure.org";function b(e){return e==="freeText"?[]:e==="singleOption"?[{system:r,code:"mg",display:"mg"}]:[{system:r,code:"mg",display:"mg"},{system:r,code:"kg",display:"kg"},{system:r,code:"mL",display:"mL"}]}function x(e,t){const n=[];t.forEach(Q=>{n.push({url:a.QUESTIONNAIRE_UNIT_OPTION,valueCoding:Q})});const i=t[0]?.code,d=e.boundsMode==="min"||e.boundsMode==="minMax"?{value:e.minValue,unit:i,system:i?r:void 0,code:i}:void 0,l=e.boundsMode==="max"||e.boundsMode==="minMax"?{value:e.maxValue,unit:i,system:i?r:void 0,code:i}:void 0;return d&&n.push({url:a.MIN_VALUE,valueQuantity:d}),l&&n.push({url:a.MAX_VALUE,valueQuantity:l}),n}function f(e,t,n){if(t===void 0)return[];const i=[{value:t,unit:n||void 0,code:n||void 0,system:n?r:void 0}];return e&&i.push({value:t+1,unit:n||void 0,code:n||void 0,system:n?r:void 0}),S("quantity",i)}function I(e){const t=b(e.unitMode),n=x(e,t);return e.useStep&&n.push({url:a.SLIDER_STEP_VALUE,valueDecimal:e.step}),c({linkId:"quantity-slider",text:"Quantity slider",type:"quantity",control:"slider",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:f(e.repeats,e.initialValue,e.initialUnit)})}function v(e){const t=b(e.unitMode),n=x(e,t);return c({linkId:"quantity-spinner",text:"Quantity spinner",type:"quantity",control:"spinner",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:f(e.repeats,e.initialValue,e.initialUnit)})}const u={unitMode:{name:"Unit mode",options:["freeText","singleOption","multipleOptions"],control:{type:"select"}},repeats:{name:"Repeats",control:{type:"boolean"}},readOnly:{name:"Read-only",control:{type:"boolean"}},boundsMode:{name:"Bounds mode",options:["none","min","max","minMax"],control:{type:"select"}},minValue:{name:"Min value",control:{type:"number"}},maxValue:{name:"Max value",control:{type:"number"}},initialValue:{name:"Initial value",control:{type:"number"}},initialUnit:{name:"Initial unit",control:{type:"text"}}},R={title:"Renderers/Quantity",parameters:{layout:"padded",docs:{description:{component:"Quantity renderer playgrounds for slider and spinner behaviors."}}},argTypes:u,args:{unitMode:"multipleOptions",repeats:!1,readOnly:!1,boundsMode:"minMax",minValue:0,maxValue:100,initialValue:12,initialUnit:"mg"}},o={name:"Quantity slider",args:{useStep:!0,step:2.5},argTypes:{...u,useStep:{name:"Use step extension",control:{type:"boolean"}},step:{name:"Step",control:{type:"number"},if:{arg:"useStep",truthy:!0}}},render:(e,t)=>{const n=I(e);return p.jsx(m,{questionnaire:y(n),storyId:t.id})}},s={name:"Quantity spinner",argTypes:u,render:(e,t)=>{const n=v(e);return p.jsx(m,{questionnaire:y(n),storyId:t.id})}};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "Quantity slider",
  args: {
    useStep: true,
    step: 2.5
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
    }
  },
  render: (args, context) => {
    const item = buildQuantitySliderItem(args);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />;
  }
}`,...o.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Quantity spinner",
  argTypes: baseArgTypes,
  render: (args, context) => {
    const item = buildQuantitySpinnerItem(args);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} />;
  }
}`,...s.parameters?.docs?.source}}};const g=["QuantitySliderRenderer","QuantitySpinnerRenderer"];export{o as QuantitySliderRenderer,s as QuantitySpinnerRenderer,g as __namedExportsOrder,R as default};
