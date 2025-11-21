import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as t,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"date-wc-check-box-repeating-options-or-string",text:"Select a date",type:"date",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("date",["2025-02-01","2025-03-01","2025-04-01"])}),r=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/date/with item-control/check-box/repeating/with answer-options",component:t,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>s.jsx(t,{scenario:{name:"date-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,f as default};
