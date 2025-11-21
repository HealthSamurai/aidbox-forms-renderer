import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as o,c as p,m}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"dateTime-wc-autocomplete-non-repeating-options-or-string",text:"Select a date & time",type:"dateTime",repeats:!1,control:"autocomplete",answerConstraint:"optionsOrString",answerOption:m("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),t=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/dateTime/with item-control/autocomplete/non-repeating/with answer-options",component:o,parameters:s,argTypes:i},e={name:"options or string",args:{questionnaireSource:t},render:n=>a.jsx(o,{scenario:{name:"dateTime-wc-autocomplete-non-repeating-options-or-string",title:"options or string",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-autocomplete-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const T=["OptionsOrString"];export{e as OptionsOrString,T as __namedExportsOrder,f as default};
