import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"decimal-wc-spinner-repeating-options-or-type",text:"Enter decimal value",type:"decimal",repeats:!0,control:"spinner",answerConstraint:"optionsOrType",answerOption:c("decimal",[1.5,2,2.5])}),r=JSON.stringify(t.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/spinner/repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options or type",args:{questionnaireSource:r},render:n=>s.jsx(o,{scenario:{name:"decimal-wc-spinner-repeating-options-or-type",title:"options or type",build:()=>t},questionnaireSource:n.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-spinner-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,g as default};
