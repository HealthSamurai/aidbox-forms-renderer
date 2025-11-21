import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=l({linkId:"url-wc-text-box-non-repeating-options-only",text:"Enter a URL",type:"url",repeats:!1,control:"text-box",answerConstraint:"optionsOnly",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/url/with item-control/text-box/non-repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"url-wc-text-box-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-text-box-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,S as default};
