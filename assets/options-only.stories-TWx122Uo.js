import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=l({linkId:"url-wc-lookup-non-repeating-options-only",text:"Enter a URL",type:"url",repeats:!1,control:"lookup",answerConstraint:"optionsOnly",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/url/with item-control/lookup/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(n,{scenario:{name:"url-wc-lookup-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-lookup-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
