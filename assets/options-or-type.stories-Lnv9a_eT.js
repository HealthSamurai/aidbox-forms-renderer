import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"url-wc-text-box-repeating-options-or-type",text:"Enter a URL",type:"url",repeats:!0,control:"text-box",answerConstraint:"optionsOrType",answerOption:u("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),t=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/url/with item-control/text-box/repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:n=>s.jsx(o,{scenario:{name:"url-wc-text-box-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-text-box-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,S as default};
