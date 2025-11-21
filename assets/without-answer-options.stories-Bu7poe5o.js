import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=u({linkId:"url-wc-radio-button-non-repeating-noopts",text:"Enter a URL",type:"url",repeats:!1,control:"radio-button"}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/url/with item-control/radio-button/non-repeating/without answer-options",component:t,parameters:i,argTypes:s},e={name:"without answer-options",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"url-wc-radio-button-non-repeating-noopts",title:"without answer-options",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "without answer-options",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-radio-button-non-repeating-noopts",
    title: "without answer-options",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["WithoutAnswerOptions"];export{e as WithoutAnswerOptions,f as __namedExportsOrder,S as default};
