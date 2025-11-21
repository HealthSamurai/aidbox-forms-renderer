import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"quantity-wc-text-box-repeating-noopts",text:"Enter a quantity",type:"quantity",repeats:!0,control:"text-box"}),t=JSON.stringify(n.form.questionnaire,null,2),x={title:"Question/quantity/with item-control/text-box/repeating/without answer-options",component:o,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:t},render:r=>a.jsx(o,{scenario:{name:"quantity-wc-text-box-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-text-box-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,x as default};
