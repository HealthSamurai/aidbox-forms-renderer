import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=u({linkId:"date-wc-radio-button-non-repeating-options-only",text:"Select a date",type:"date",repeats:!1,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("date",["2025-02-01","2025-03-01","2025-04-01"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/date/with item-control/radio-button/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(n,{scenario:{name:"date-wc-radio-button-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-radio-button-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
