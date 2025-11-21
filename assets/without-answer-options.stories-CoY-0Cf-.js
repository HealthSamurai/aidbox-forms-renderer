import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"attachment-wc-spinner-repeating-noopts",text:"Upload an attachment",type:"attachment",repeats:!0,control:"spinner"}),t=JSON.stringify(o.form.questionnaire,null,2),w={title:"Question/attachment/with item-control/spinner/repeating/without answer-options",component:n,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:t},render:r=>a.jsx(n,{scenario:{name:"attachment-wc-spinner-repeating-noopts",title:"without answer-options",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-spinner-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
