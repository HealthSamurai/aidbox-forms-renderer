import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"reference-wc-text-box-non-repeating-options-only",text:"Choose a reference",type:"reference",repeats:!1,control:"text-box",answerConstraint:"optionsOnly",answerOption:p("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),n=JSON.stringify(r.form.questionnaire,null,2),y={title:"Question/reference/with item-control/text-box/non-repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:n},render:t=>a.jsx(o,{scenario:{name:"reference-wc-text-box-non-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-text-box-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOnly"];export{e as OptionsOnly,S as __namedExportsOrder,y as default};
