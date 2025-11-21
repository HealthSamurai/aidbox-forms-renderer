import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"date-wc-text-box-repeating-options-or-string",text:"Select a date",type:"date",repeats:!0,control:"text-box",answerConstraint:"optionsOrString",answerOption:u("date",["2025-02-01","2025-03-01","2025-04-01"])}),t=JSON.stringify(o.form.questionnaire,null,2),x={title:"Question/date/with item-control/text-box/repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"date-wc-text-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-text-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,x as default};
