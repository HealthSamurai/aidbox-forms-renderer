import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"string-wc-spinner-repeating-noopts",text:"Enter text",type:"string",repeats:!0,control:"spinner"}),t=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/string/with item-control/spinner/repeating/without answer-options",component:r,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:t},render:o=>s.jsx(r,{scenario:{name:"string-wc-spinner-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-spinner-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
