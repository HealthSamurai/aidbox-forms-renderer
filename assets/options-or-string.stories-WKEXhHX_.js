import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"url-wc-lookup-repeating-options-or-string",text:"Enter a URL",type:"url",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/url/with item-control/lookup/repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"url-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const h=["OptionsOrString"];export{e as OptionsOrString,h as __namedExportsOrder,f as default};
