import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"url-wc-slider-non-repeating-noopts",text:"Enter a URL",type:"url",repeats:!1,control:"slider"}),r=JSON.stringify(t.form.questionnaire,null,2),S={title:"Question/url/with item-control/slider/non-repeating/without answer-options",component:o,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"url-wc-slider-non-repeating-noopts",title:"without answer-options",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-slider-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
