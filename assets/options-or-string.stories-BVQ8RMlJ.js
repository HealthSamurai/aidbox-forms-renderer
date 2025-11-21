import{j as i}from"./index-BsWNCus6.js";import{b as a,a as s,N as n,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"reference-wc-radio-button-non-repeating-options-or-string",text:"Choose a reference",type:"reference",repeats:!1,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/reference/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:s,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:t=>i.jsx(n,{scenario:{name:"reference-wc-radio-button-non-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:t.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-radio-button-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,S as default};
