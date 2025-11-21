import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"date-wc-drop-down-repeating-noopts",text:"Select a date",type:"date",repeats:!0,control:"drop-down"}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/date/with item-control/drop-down/repeating/without answer-options",component:t,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"date-wc-drop-down-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-drop-down-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,g as __namedExportsOrder,S as default};
