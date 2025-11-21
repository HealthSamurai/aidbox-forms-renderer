import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"time-wc-radio-button-non-repeating-options-or-type",text:"Select a time",type:"time",repeats:!1,control:"radio-button",answerConstraint:"optionsOrType",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/time/with item-control/radio-button/non-repeating/with answer-options",component:t,parameters:s,argTypes:i},e={name:"options or type",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"time-wc-radio-button-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-radio-button-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,f as default};
