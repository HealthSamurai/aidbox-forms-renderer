import{j as i}from"./index-BsWNCus6.js";import{b as a,a as s,N as t,c as u,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const o=u({linkId:"decimal-wc-radio-button-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"radio-button",answerConstraint:"optionsOrString",answerOption:c("decimal",[1.5,2,2.5])}),r=JSON.stringify(o.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/radio-button/repeating/with answer-options",component:t,parameters:s,argTypes:a},e={name:"options or string",args:{questionnaireSource:r},render:n=>i.jsx(t,{scenario:{name:"decimal-wc-radio-button-repeating-options-or-string",title:"options or string",build:()=>o},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-radio-button-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const b=["OptionsOrString"];export{e as OptionsOrString,b as __namedExportsOrder,f as default};
