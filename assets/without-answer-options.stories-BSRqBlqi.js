import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"dateTime-wc-radio-button-repeating-noopts",text:"Select a date & time",type:"dateTime",repeats:!0,control:"radio-button"}),t=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/dateTime/with item-control/radio-button/repeating/without answer-options",component:o,parameters:s,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"dateTime-wc-radio-button-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-radio-button-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,g as __namedExportsOrder,S as default};
