import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"time-wc-text-box-repeating-noopts",text:"Select a time",type:"time",repeats:!0,control:"text-box"}),t=JSON.stringify(r.form.questionnaire,null,2),x={title:"Question/time/with item-control/text-box/repeating/without answer-options",component:o,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:t},render:n=>s.jsx(o,{scenario:{name:"time-wc-text-box-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-text-box-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,x as default};
