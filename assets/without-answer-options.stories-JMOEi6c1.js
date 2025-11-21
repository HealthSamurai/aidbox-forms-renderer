import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"time-wc-spinner-repeating-noopts",text:"Select a time",type:"time",repeats:!0,control:"spinner"}),t=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/time/with item-control/spinner/repeating/without answer-options",component:o,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:t},render:n=>s.jsx(o,{scenario:{name:"time-wc-spinner-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-spinner-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,g as __namedExportsOrder,S as default};
