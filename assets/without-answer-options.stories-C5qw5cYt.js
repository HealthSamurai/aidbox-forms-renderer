import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"url-wc-drop-down-non-repeating-noopts",text:"Enter a URL",type:"url",repeats:!1,control:"drop-down"}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/url/with item-control/drop-down/non-repeating/without answer-options",component:r,parameters:i,argTypes:a},e={name:"without answer-options",args:{questionnaireSource:o},render:t=>s.jsx(r,{scenario:{name:"url-wc-drop-down-non-repeating-noopts",title:"without answer-options",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-drop-down-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
