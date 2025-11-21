import{j as a}from"./index-BsWNCus6.js";import{b as i,a as s,N as t,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"decimal-wc-radio-button-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!0,control:"radio-button",answerConstraint:"optionsOrType",answerOption:u("decimal",[1.5,2,2.5])}),o=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/radio-button/repeating/with answer-options",component:t,parameters:s,argTypes:i},e={name:"options or type",args:{questionnaireSource:o},render:n=>a.jsx(t,{scenario:{name:"decimal-wc-radio-button-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:n.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-radio-button-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
