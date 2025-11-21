import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=l({linkId:"url-wc-slider-repeating-options-only",text:"Enter a URL",type:"url",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),o=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/url/with item-control/slider/repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:n=>s.jsx(r,{scenario:{name:"url-wc-slider-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
