import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as r,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"reference-wc-autocomplete-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!0,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:p("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/reference/with item-control/autocomplete/repeating/with answer-options",component:r,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:t=>a.jsx(r,{scenario:{name:"reference-wc-autocomplete-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-autocomplete-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,S as default};
