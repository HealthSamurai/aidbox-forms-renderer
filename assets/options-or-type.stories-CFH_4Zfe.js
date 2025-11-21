import{j as s}from"./index-BsWNCus6.js";import{b as a,a as p,N as r,c as i,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=i({linkId:"url-wc-lookup-non-repeating-options-or-type",text:"Enter a URL",type:"url",repeats:!1,control:"lookup",answerConstraint:"optionsOrType",answerOption:u("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/url/with item-control/lookup/non-repeating/with answer-options",component:r,parameters:p,argTypes:a},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(r,{scenario:{name:"url-wc-lookup-non-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-lookup-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,f as default};
