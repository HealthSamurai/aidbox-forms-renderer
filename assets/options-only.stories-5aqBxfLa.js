import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"url-wc-drop-down-non-repeating-options-only",text:"Enter a URL",type:"url",repeats:!1,control:"drop-down",answerConstraint:"optionsOnly",answerOption:l("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/url/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:t=>s.jsx(n,{scenario:{name:"url-wc-drop-down-non-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-drop-down-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
