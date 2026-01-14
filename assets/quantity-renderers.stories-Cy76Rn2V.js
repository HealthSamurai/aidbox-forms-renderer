import{j as p}from"./iframe-CJs7U6I_.js";import{a as m,b as y,c as S}from"./helpers-CuNbfLvO.js";import{R as c,E as a}from"./renderer-D8fIws__.js";import"./preload-helper-PPVm8Dsz.js";import"./index-CteRK0s8.js";import"./index-Dv4SGy_Z.js";import"./index-BZmF1yFM.js";const o="http://unitsofmeasure.org";function b(e){return e==="freeText"?[]:e==="singleOption"?[{system:o,code:"mg",display:"mg"}]:[{system:o,code:"mg",display:"mg"},{system:o,code:"kg",display:"kg"},{system:o,code:"mL",display:"mL"}]}function x(e,t){const n=[];t.forEach(Q=>{n.push({url:a.QUESTIONNAIRE_UNIT_OPTION,valueCoding:Q})});const i=t[0]?.code,d=e.boundsMode==="min"||e.boundsMode==="minMax"?{value:e.minValue,unit:i,system:i?o:void 0,code:i}:void 0,l=e.boundsMode==="max"||e.boundsMode==="minMax"?{value:e.maxValue,unit:i,system:i?o:void 0,code:i}:void 0;return d&&n.push({url:a.MIN_VALUE,valueQuantity:d}),l&&n.push({url:a.MAX_VALUE,valueQuantity:l}),n}function f(e,t,n){if(t===void 0)return[];const i=[{value:t,unit:n||void 0,code:n||void 0,system:n?o:void 0}];return e&&i.push({value:t+1,unit:n||void 0,code:n||void 0,system:n?o:void 0}),S("quantity",i)}function I(e){const t=b(e.unitMode),n=x(e,t);return e.useStep&&n.push({url:a.SLIDER_STEP_VALUE,valueDecimal:e.step}),y({linkId:"quantity-slider",text:"Quantity slider",type:"quantity",control:"slider",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:f(e.repeats,e.initialValue,e.initialUnit)})}function v(e){const t=b(e.unitMode),n=x(e,t);return y({linkId:"quantity-spinner",text:"Quantity spinner",type:"quantity",control:"spinner",repeats:e.repeats,readOnly:e.readOnly,extensions:n,initial:f(e.repeats,e.initialValue,e.initialUnit)})}const u={unitMode:{name:"Unit mode",options:["freeText","singleOption","multipleOptions"],control:{type:"select"}},repeats:{name:"Repeats",control:{type:"boolean"}},readOnly:{name:"Read-only",control:{type:"boolean"}},boundsMode:{name:"Bounds mode",options:["none","min","max","minMax"],control:{type:"select"}},minValue:{name:"Min value",control:{type:"number"}},maxValue:{name:"Max value",control:{type:"number"}},initialValue:{name:"Initial value",control:{type:"number"}},initialUnit:{name:"Initial unit",control:{type:"text"}}},g={title:"Renderers/Quantity",parameters:{layout:"padded",docs:{description:{component:"Quantity renderer playgrounds for slider and spinner behaviors."}}},argTypes:u,args:{unitMode:"multipleOptions",repeats:!1,readOnly:!1,boundsMode:"minMax",minValue:0,maxValue:100,initialValue:12,initialUnit:"mg"}},r={name:"Quantity slider",args:{useStep:!0,step:2.5},argTypes:{...u,useStep:{name:"Use step extension",control:{type:"boolean"}},step:{name:"Step",control:{type:"number"},if:{arg:"useStep",truthy:!0}}},render:(e,t)=>{const n=I(e);return p.jsx(c,{questionnaire:m(n),storyId:t.id,mode:"node"})}},s={name:"Quantity spinner",argTypes:u,render:(e,t)=>{const n=v(e);return p.jsx(c,{questionnaire:m(n),storyId:t.id,mode:"node"})}};r.parameters={...r.parameters,docs:{...r.parameters?.docs,source:{originalSource:`{
  name: "Quantity slider",
  args: {
    useStep: true,
    step: 2.5
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
    }
  },
  render: (arguments_, context) => {
    const item = buildQuantitySliderItem(arguments_);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
}`,...r.parameters?.docs?.source}}};s.parameters={...s.parameters,docs:{...s.parameters?.docs,source:{originalSource:`{
  name: "Quantity spinner",
  argTypes: baseArgumentTypes,
  render: (arguments_, context) => {
    const item = buildQuantitySpinnerItem(arguments_);
    return <Renderer questionnaire={buildQuestionnaire(item)} storyId={context.id} mode="node" />;
  }
}`,...s.parameters?.docs?.source}}};const h=["QuantitySliderRenderer","QuantitySpinnerRenderer"];export{r as QuantitySliderRenderer,s as QuantitySpinnerRenderer,h as __namedExportsOrder,g as default};
