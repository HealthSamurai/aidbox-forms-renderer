import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"dateTime-wc-drop-down-non-repeating-options-only",text:"Select a date & time",type:"dateTime",repeats:!1,control:"drop-down",answerConstraint:"optionsOnly",answerOption:d("dateTime",["2025-02-01T10:00:00Z","2025-03-01T12:00:00Z","2025-04-01T15:30:00Z"])}),o=JSON.stringify(t.form.questionnaire,null,2),y={title:"Question/dateTime/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options only",args:{questionnaireSource:o},render:r=>a.jsx(n,{scenario:{name:"dateTime-wc-drop-down-non-repeating-options-only",title:"options only",build:()=>t},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "dateTime-wc-drop-down-non-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,y as default};
