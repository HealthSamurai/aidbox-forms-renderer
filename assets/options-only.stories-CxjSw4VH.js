import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"date-wc-radio-button-repeating-options-only",text:"Select a date",type:"date",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("date",["2025-02-01","2025-03-01","2025-04-01"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/date/with item-control/radio-button/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(t,{scenario:{name:"date-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
