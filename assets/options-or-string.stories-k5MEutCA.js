import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as p,m as d}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"date-wc-slider-non-repeating-options-or-string",text:"Select a date",type:"date",repeats:!1,control:"slider",answerConstraint:"optionsOrString",answerOption:d("date",["2025-02-01","2025-03-01","2025-04-01"])}),r=JSON.stringify(n.form.questionnaire,null,2),f={title:"Question/date/with item-control/slider/non-repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options or string",args:{questionnaireSource:r},render:o=>s.jsx(t,{scenario:{name:"date-wc-slider-non-repeating-options-or-string",title:"options or string",build:()=>n},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "date-wc-slider-non-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
