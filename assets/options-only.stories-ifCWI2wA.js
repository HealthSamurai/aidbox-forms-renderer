import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"reference-wc-spinner-non-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!1,control:"spinner",answerConstraint:"optionsOnly",answerOption:c("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),n=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/reference/with item-control/spinner/non-repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:n},render:t=>s.jsx(r,{scenario:{name:"reference-wc-spinner-non-repeating-options-only",title:"options only",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-spinner-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
