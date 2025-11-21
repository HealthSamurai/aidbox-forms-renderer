import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"reference-wc-spinner-repeating-noopts",text:"Choose a reference",type:"reference",repeats:!0,control:"spinner"}),r=JSON.stringify(t.form.questionnaire,null,2),w={title:"Question/reference/with item-control/spinner/repeating/without answer-options",component:n,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:r},render:o=>s.jsx(n,{scenario:{name:"reference-wc-spinner-repeating-noopts",title:"without answer-options",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-spinner-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
