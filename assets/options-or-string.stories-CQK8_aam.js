import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"dateTime-wc-spinner-repeating-options-or-string",text:"Select a date & time",type:"dateTime",repeats:!0,control:"spinner",answerConstraint:"optionsOrString",answerOption:u("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),r=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/dateTime/with item-control/spinner/repeating/with answer-options",component:t,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:o=>i.jsx(t,{scenario:{name:"dateTime-wc-spinner-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-spinner-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const T=["OptionsOrString"];export{e as OptionsOrString,T as __namedExportsOrder,f as default};
