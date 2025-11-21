import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"url-wc-spinner-repeating-options-or-type",text:"Enter a URL",type:"url",repeats:!0,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),r=JSON.stringify(o.form.questionnaire,null,2),g={title:"Question/url/with item-control/spinner/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:r},render:n=>s.jsx(t,{scenario:{name:"url-wc-spinner-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-spinner-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
