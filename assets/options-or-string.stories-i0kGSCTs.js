import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"url-wc-radio-button-repeating-options-or-string",text:"Enter a URL",type:"url",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),r=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/url/with item-control/radio-button/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>s.jsx(t,{scenario:{name:"url-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
