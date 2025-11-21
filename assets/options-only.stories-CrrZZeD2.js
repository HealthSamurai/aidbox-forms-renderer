import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as o,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"decimal-wc-spinner-repeating-options-only",text:"Enter decimal value",type:"decimal",repeats:!0,control:"spinner",answerConstraint:"optionsOnly",answerOption:l("decimal",[1.5,2,2.5])}),n=JSON.stringify(r.form.questionnaire,null,2),g={title:"Question/decimal/with item-control/spinner/repeating/with answer-options",component:o,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:n},render:t=>s.jsx(o,{scenario:{name:"decimal-wc-spinner-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:n})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-spinner-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOnly"];export{e as OptionsOnly,f as __namedExportsOrder,g as default};
