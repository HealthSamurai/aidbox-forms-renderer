import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=c({linkId:"url-wc-check-box-repeating-options-only",text:"Enter a URL",type:"url",repeats:!0,control:"check-box",answerConstraint:"optionsOnly",answerOption:l("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(n.form.questionnaire,null,2),y={title:"Question/url/with item-control/check-box/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"url-wc-check-box-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-check-box-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const S=["OptionsOnly"];export{e as OptionsOnly,S as __namedExportsOrder,y as default};
