import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"coding-wc-spinner-non-repeating-noopts",text:"Choose a code",type:"coding",repeats:!1,control:"spinner"}),n=JSON.stringify(t.form.questionnaire,null,2),w={title:"Question/coding/with item-control/spinner/non-repeating/without answer-options",component:o,parameters:a,argTypes:i},e={name:"without answer-options",args:{questionnaireSource:n},render:r=>s.jsx(o,{scenario:{name:"coding-wc-spinner-non-repeating-noopts",title:"without answer-options",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "coding-wc-spinner-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,S as __namedExportsOrder,w as default};
