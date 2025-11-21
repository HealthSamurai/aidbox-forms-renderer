import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"boolean-wc-radio-button-repeating-noopts",text:"Boolean question",type:"boolean",repeats:!0,control:"radio-button"}),o=JSON.stringify(n.form.questionnaire,null,2),b={title:"Question/boolean/with item-control/radio-button/repeating/without answer-options",component:t,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"boolean-wc-radio-button-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-radio-button-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,b as default};
