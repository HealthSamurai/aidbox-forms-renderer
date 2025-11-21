import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"date-wc-drop-down-repeating-options-or-string",text:"Select a date",type:"date",repeats:!0,control:"drop-down",answerConstraint:"optionsOrString",answerOption:d("date",["2025-02-01","2025-03-01","2025-04-01"])}),r=JSON.stringify(t.form.questionnaire,null,2),w={title:"Question/date/with item-control/drop-down/repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"date-wc-drop-down-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-drop-down-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrString"];export{e as OptionsOrString,f as __namedExportsOrder,w as default};
