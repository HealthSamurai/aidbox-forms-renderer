import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"string-wc-check-box-non-repeating-noopts",text:"Enter text",type:"string",repeats:!1,control:"check-box"}),t=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/string/with item-control/check-box/non-repeating/without answer-options",component:o,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:t},render:r=>s.jsx(o,{scenario:{name:"string-wc-check-box-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "string-wc-check-box-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const h=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,h as __namedExportsOrder,w as default};
