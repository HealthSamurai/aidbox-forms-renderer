import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"reference-wc-slider-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:l("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/reference/with item-control/slider/repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:r},render:t=>s.jsx(n,{scenario:{name:"reference-wc-slider-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
