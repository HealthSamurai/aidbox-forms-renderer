import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as n,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"time-wc-spinner-non-repeating-noopts",text:"Select a time",type:"time",repeats:!1,control:"spinner"}),t=JSON.stringify(o.form.questionnaire,null,2),S={title:"Question/time/with item-control/spinner/non-repeating/without answer-options",component:n,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:t},render:r=>s.jsx(n,{scenario:{name:"time-wc-spinner-non-repeating-noopts",title:"without answer-options",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-spinner-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
