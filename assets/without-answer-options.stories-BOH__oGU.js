import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"time-woc-non-repeating-noopts",text:"Select a time",type:"time",repeats:!1}),t=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/time/without item-control/non-repeating/without answer-options",component:o,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:t},render:r=>s.jsx(o,{scenario:{name:"time-woc-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-woc-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
