import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"dateTime-wc-autocomplete-repeating-options-only",text:"Select a date & time",type:"dateTime",repeats:!0,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:u("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/dateTime/with item-control/autocomplete/repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:a=>r.jsx(t,{scenario:{name:"dateTime-wc-autocomplete-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:a.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-autocomplete-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
