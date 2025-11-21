import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as t,c,m as p}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=c({linkId:"time-wc-check-box-repeating-options-or-string",text:"Select a time",type:"time",repeats:!0,control:"check-box",answerConstraint:"optionsOrString",answerOption:p("time",["08:00:00","12:30:00","18:00:00"])}),r=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/time/with item-control/check-box/repeating/with answer-options",component:t,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:n=>i.jsx(t,{scenario:{name:"time-wc-check-box-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "time-wc-check-box-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const x=["OptionsOrString"];export{e as OptionsOrString,x as __namedExportsOrder,f as default};
