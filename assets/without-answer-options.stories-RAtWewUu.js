import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"boolean-wc-spinner-non-repeating-noopts",text:"Boolean question",type:"boolean",repeats:!1,control:"spinner"}),o=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/boolean/with item-control/spinner/non-repeating/without answer-options",component:n,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:r=>s.jsx(n,{scenario:{name:"boolean-wc-spinner-non-repeating-noopts",title:"without answer-options",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-spinner-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
