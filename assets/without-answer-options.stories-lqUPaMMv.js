import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"integer-wc-slider-repeating-noopts",text:"Enter integer value",type:"integer",repeats:!0,control:"slider"}),t=JSON.stringify(o.form.questionnaire,null,2),w={title:"Question/integer/with item-control/slider/repeating/without answer-options",component:r,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"integer-wc-slider-repeating-noopts",title:"without answer-options",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "integer-wc-slider-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
