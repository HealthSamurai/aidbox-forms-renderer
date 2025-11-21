import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=c({linkId:"url-wc-check-box-non-repeating-options-or-string",text:"Enter a URL",type:"url",repeats:!1,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("url",["https://example.com","https://health.example.com","https://docs.example.com"])}),r=JSON.stringify(t.form.questionnaire,null,2),h={title:"Question/url/with item-control/check-box/non-repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"url-wc-check-box-non-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "url-wc-check-box-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,h as default};
