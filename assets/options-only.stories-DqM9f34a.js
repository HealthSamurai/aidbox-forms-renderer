import{j as i}from"./index-BsWNCus6.js";import{b as a,a as s,N as t,c as u,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=u({linkId:"time-wc-radio-button-repeating-options-only",text:"Select a time",type:"time",repeats:!0,control:"radio-button",answerConstraint:"optionsOnly",answerOption:p("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/time/with item-control/radio-button/repeating/with answer-options",component:t,parameters:s,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:r=>i.jsx(t,{scenario:{name:"time-wc-radio-button-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-radio-button-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
