import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"quantity-wc-radio-button-non-repeating-noopts",text:"Enter a quantity",type:"quantity",repeats:!1,control:"radio-button"}),e=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/quantity/with item-control/radio-button/non-repeating/without answer-options",component:o,parameters:s,argTypes:i},t={name:"without answer-options",args:{questionnaireSource:e},render:r=>a.jsx(o,{scenario:{name:"quantity-wc-radio-button-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "quantity-wc-radio-button-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const q=["WithoutAnswerOptions"];export{t as WithoutAnswerOptions,q as __namedExportsOrder,S as default};
