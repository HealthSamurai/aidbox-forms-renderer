import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"reference-wc-text-box-repeating-options-or-type",text:"Choose a reference",type:"reference",repeats:!0,control:"text-box",answerConstraint:"optionsOrType",answerOption:c("reference",[{reference:"Practitioner/alpha",display:"Dr. Ada Lovelace"},{reference:"Practitioner/beta",display:"Dr. Marie Curie"}])}),r=JSON.stringify(o.form.questionnaire,null,2),y={title:"Question/reference/with item-control/text-box/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:r},render:n=>a.jsx(t,{scenario:{name:"reference-wc-text-box-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-text-box-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOrType"];export{e as OptionsOrType,S as __namedExportsOrder,y as default};
