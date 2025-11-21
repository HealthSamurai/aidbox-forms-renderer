import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as t,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"date-wc-drop-down-non-repeating-options-or-type",text:"Select a date",type:"date",repeats:!1,control:"drop-down",answerConstraint:"optionsOrType",answerOption:d("date",["2025-02-01","2025-03-01","2025-04-01"])}),o=JSON.stringify(r.form.questionnaire,null,2),y={title:"Question/date/with item-control/drop-down/non-repeating/with answer-options",component:t,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"date-wc-drop-down-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-drop-down-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,y as default};
