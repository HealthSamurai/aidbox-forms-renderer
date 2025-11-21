import{j as i}from"./index-BsWNCus6.js";import{b as a,a as s,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"time-wc-radio-button-repeating-options-or-type",text:"Select a time",type:"time",repeats:!0,control:"radio-button",answerConstraint:"optionsOrType",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/time/with item-control/radio-button/repeating/with answer-options",component:o,parameters:s,argTypes:a},e={name:"options or type",args:{questionnaireSource:t},render:n=>i.jsx(o,{scenario:{name:"time-wc-radio-button-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-radio-button-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
