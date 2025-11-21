import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"dateTime-wc-spinner-non-repeating-options-or-type",text:"Select a date & time",type:"dateTime",repeats:!1,control:"spinner",answerConstraint:"optionsOrType",answerOption:m("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),t=JSON.stringify(o.form.questionnaire,null,2),T={title:"Question/dateTime/with item-control/spinner/non-repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:r=>s.jsx(n,{scenario:{name:"dateTime-wc-spinner-non-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:r.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-spinner-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,T as default};
