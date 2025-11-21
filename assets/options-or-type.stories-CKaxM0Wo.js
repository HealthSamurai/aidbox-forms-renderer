import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"time-wc-check-box-repeating-options-or-type",text:"Select a time",type:"time",repeats:!0,control:"check-box",answerConstraint:"optionsOrType",answerOption:c("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/time/with item-control/check-box/repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:o},render:n=>s.jsx(t,{scenario:{name:"time-wc-check-box-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-check-box-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
