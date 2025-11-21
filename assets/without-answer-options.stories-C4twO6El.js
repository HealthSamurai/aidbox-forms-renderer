import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"attachment-wc-radio-button-repeating-noopts",text:"Upload an attachment",type:"attachment",repeats:!0,control:"radio-button"}),e=JSON.stringify(n.form.questionnaire,null,2),w={title:"Question/attachment/with item-control/radio-button/repeating/without answer-options",component:o,parameters:i,argTypes:s},t={name:"without answer-options",args:{questionnaireSource:e},render:r=>a.jsx(o,{scenario:{name:"attachment-wc-radio-button-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:e})};t.parameters={...t.parameters,docs:{...t.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "attachment-wc-radio-button-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...t.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{t as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
