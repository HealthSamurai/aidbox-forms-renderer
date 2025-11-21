import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=c({linkId:"coding-wc-check-box-repeating-noopts",text:"Choose a code",type:"coding",repeats:!0,control:"check-box"}),o=JSON.stringify(r.form.questionnaire,null,2),h={title:"Question/coding/with item-control/check-box/repeating/without answer-options",component:t,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"coding-wc-check-box-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-check-box-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,w as __namedExportsOrder,h as default};
