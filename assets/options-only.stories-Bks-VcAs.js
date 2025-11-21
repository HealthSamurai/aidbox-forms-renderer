import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"reference-wc-radio-button-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:u("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/reference/with item-control/radio-button/repeating/with answer-options",component:o,parameters:s,argTypes:i},e={name:"options only",args:{questionnaireSource:r},render:t=>a.jsx(o,{scenario:{name:"reference-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
