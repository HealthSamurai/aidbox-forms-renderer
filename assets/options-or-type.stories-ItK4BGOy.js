import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"date-wc-spinner-repeating-options-or-type",text:"Select a date",type:"date",repeats:!0,control:"spinner",answerConstraint:"optionsOrType",answerOption:u("date",["2025-02-01","2025-03-01","2025-04-01"])}),t=JSON.stringify(o.form.questionnaire,null,2),g={title:"Question/date/with item-control/spinner/repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"date-wc-spinner-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-spinner-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
