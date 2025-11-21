import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"string-wc-spinner-non-repeating-noopts",text:"Enter text",type:"string",repeats:!1,control:"spinner"}),n=JSON.stringify(r.form.questionnaire,null,2),w={title:"Question/string/with item-control/spinner/non-repeating/without answer-options",component:t,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:n},render:o=>s.jsx(t,{scenario:{name:"string-wc-spinner-non-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:o.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-spinner-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
