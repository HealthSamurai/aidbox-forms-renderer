import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"reference-wc-radio-button-non-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!1,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),n=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/reference/with item-control/radio-button/non-repeating/with answer-options",component:o,parameters:s,argTypes:i},e={name:"options only",args:{questionnaireSource:n},render:t=>a.jsx(o,{scenario:{name:"reference-wc-radio-button-non-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-radio-button-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
