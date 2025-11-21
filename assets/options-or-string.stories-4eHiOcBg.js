import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"reference-wc-drop-down-non-repeating-options-or-string",text:"Choose a reference",type:"reference",repeats:!1,control:"drop-down",answerConstraint:"optionsOrString",answerOption:c("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/reference/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:r},render:t=>s.jsx(n,{scenario:{name:"reference-wc-drop-down-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-drop-down-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,S as default};
