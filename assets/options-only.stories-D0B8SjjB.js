import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"dateTime-wc-radio-button-non-repeating-options-only",text:"Select a date & time",type:"dateTime",repeats:!1,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/dateTime/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:s,argTypes:i},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(n,{scenario:{name:"dateTime-wc-radio-button-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-radio-button-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
