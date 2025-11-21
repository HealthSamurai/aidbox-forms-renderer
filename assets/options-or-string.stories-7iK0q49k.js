import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"dateTime-wc-lookup-repeating-options-or-string",text:"Select a date & time",type:"dateTime",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/dateTime/with item-control/lookup/repeating/with answer-options",component:t,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:o},render:n=>i.jsx(t,{scenario:{name:"dateTime-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const T=["OptionsOrString"];export{e as OptionsOrString,T as __namedExportsOrder,f as default};
