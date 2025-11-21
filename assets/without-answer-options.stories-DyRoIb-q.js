import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"url-wc-lookup-repeating-noopts",text:"Enter a URL",type:"url",repeats:!0,control:"lookup"}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/url/with item-control/lookup/repeating/without answer-options",component:t,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"url-wc-lookup-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-lookup-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,g as __namedExportsOrder,S as default};
