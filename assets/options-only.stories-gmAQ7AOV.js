import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as t,c as l,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=l({linkId:"time-wc-slider-repeating-options-only",text:"Select a time",type:"time",repeats:!0,control:"slider",answerConstraint:"optionsOnly",answerOption:p("time",["08:00:00","12:30:00","18:00:00"])}),o=JSON.stringify(n.form.questionnaire,null,2),g={title:"Question/time/with item-control/slider/repeating/with answer-options",component:t,parameters:a,argTypes:i},e={name:"options only",args:{questionnaireSource:o},render:r=>s.jsx(t,{scenario:{name:"time-wc-slider-repeating-options-only",title:"options only",build:()=>n},questionnaireSource:r.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-slider-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
