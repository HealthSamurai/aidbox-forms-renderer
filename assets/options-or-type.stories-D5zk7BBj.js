import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"dateTime-woc-repeating-options-or-type",text:"Select a date & time",type:"dateTime",repeats:!0,answerConstraint:"optionsOrType",answerOption:u("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),t=JSON.stringify(r.form.questionnaire,null,2),T={title:"Question/dateTime/without item-control/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"dateTime-woc-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-woc-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOrType"];export{e as OptionsOrType,g as __namedExportsOrder,T as default};
