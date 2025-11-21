import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"date-wc-lookup-repeating-options-or-string",text:"Select a date",type:"date",repeats:!0,control:"lookup",answerConstraint:"optionsOrString",answerOption:u("date",["2025-02-01","2025-03-01","2025-04-01"])}),o=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/date/with item-control/lookup/repeating/with answer-options",component:r,parameters:i,argTypes:a},e={name:"options or string",args:{questionnaireSource:o},render:n=>s.jsx(r,{scenario:{name:"date-wc-lookup-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-lookup-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
