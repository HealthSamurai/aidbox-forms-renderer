import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"reference-wc-lookup-non-repeating-noopts",text:"Choose a reference",type:"reference",repeats:!1,control:"lookup"}),o=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/reference/with item-control/lookup/non-repeating/without answer-options",component:r,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:t=>s.jsx(r,{scenario:{name:"reference-wc-lookup-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "reference-wc-lookup-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
