import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"reference-wc-drop-down-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!0,control:"drop-down",answerConstraint:"optionsOnly",answerOption:c("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/reference/with item-control/drop-down/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:r},render:t=>a.jsx(o,{scenario:{name:"reference-wc-drop-down-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-drop-down-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOnly"];export{e as OptionsOnly,S as __namedExportsOrder,w as default};
