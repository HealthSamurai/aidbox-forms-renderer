import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"coding-wc-check-box-non-repeating-noopts",text:"Choose a code",type:"coding",repeats:!1,control:"check-box"}),o=JSON.stringify(t.form.questionnaire,null,2),h={title:"Question/coding/with item-control/check-box/non-repeating/without answer-options",component:n,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:r=>s.jsx(n,{scenario:{name:"coding-wc-check-box-non-repeating-noopts",title:"without answer-options",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-check-box-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,w as __namedExportsOrder,h as default};
