import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"coding-wc-radio-button-repeating-noopts",text:"Choose a code",type:"coding",repeats:!0,control:"radio-button"}),o=JSON.stringify(r.form.questionnaire,null,2),w={title:"Question/coding/with item-control/radio-button/repeating/without answer-options",component:t,parameters:s,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"coding-wc-radio-button-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-radio-button-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
