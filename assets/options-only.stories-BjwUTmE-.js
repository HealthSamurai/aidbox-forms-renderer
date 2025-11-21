import{j as r}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"dateTime-wc-autocomplete-non-repeating-options-only",text:"Select a date & time",type:"dateTime",repeats:!1,control:"autocomplete",answerConstraint:"optionsOnly",answerOption:l("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),o=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/dateTime/with item-control/autocomplete/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:a=>r.jsx(t,{scenario:{name:"dateTime-wc-autocomplete-non-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:a.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-autocomplete-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
