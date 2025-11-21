import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"url-wc-radio-button-repeating-options-only",text:"Enter a URL",type:"url",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:l("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/url/with item-control/radio-button/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"url-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
