import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"integer-wc-slider-non-repeating-options-or-type",text:"Enter integer value",type:"integer",repeats:!1,control:"slider",answerConstraint:"optionsOrType",answerOption:u("integer",[1,2,3])}),r=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/integer/with item-control/slider/non-repeating/with answer-options",component:o,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"integer-wc-slider-non-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-slider-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
