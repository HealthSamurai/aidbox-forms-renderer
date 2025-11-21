import{j as n}from"./index-BsWNCus6.js";import{b as s,a as i,N as o,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"date-wc-autocomplete-repeating-options-or-type",text:"Select a date",type:"date",repeats:!0,control:"autocomplete",answerConstraint:"optionsOrType",answerOption:u("date",["2025-02-01","2025-03-01","2025-04-01"])}),t=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/date/with item-control/autocomplete/repeating/with answer-options",component:o,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:t},render:a=>n.jsx(o,{scenario:{name:"date-wc-autocomplete-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:a.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-autocomplete-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
