import{j as s}from"./index-BsWNCus6.js";import{b as i,a,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=p({linkId:"time-wc-slider-repeating-options-or-type",text:"Select a time",type:"time",repeats:!0,control:"slider",answerConstraint:"optionsOrType",answerOption:u("time",["08:00:00","12:30:00","18:00:00"])}),t=JSON.stringify(o.form.questionnaire,null,2),g={title:"Question/time/with item-control/slider/repeating/with answer-options",component:r,parameters:a,argTypes:i},e={name:"options or type",args:{questionnaireSource:t},render:n=>s.jsx(r,{scenario:{name:"time-wc-slider-repeating-options-or-type",title:"options or type",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:t})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-slider-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
