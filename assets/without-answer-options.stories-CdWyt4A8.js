import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"time-wc-check-box-non-repeating-noopts",text:"Select a time",type:"time",repeats:!1,control:"check-box"}),o=JSON.stringify(n.form.questionnaire,null,2),h={title:"Question/time/with item-control/check-box/non-repeating/without answer-options",component:t,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"time-wc-check-box-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-check-box-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,h as default};
