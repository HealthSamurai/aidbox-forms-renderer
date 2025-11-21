import{j as i}from"./index-BsWNCus6.js";import{b as s,a,N as n,c as p,m as c}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const t=p({linkId:"decimal-wc-spinner-repeating-options-or-string",text:"Enter decimal value",type:"decimal",repeats:!0,control:"spinner",answerConstraint:"optionsOrString",answerOption:c("decimal",[1.5,2,2.5])}),r=JSON.stringify(t.form.questionnaire,null,2),f={title:"Question/decimal/with item-control/spinner/repeating/with answer-options",component:n,parameters:a,argTypes:s},e={name:"options or string",args:{questionnaireSource:r},render:o=>i.jsx(n,{scenario:{name:"decimal-wc-spinner-repeating-options-or-string",title:"options or string",build:()=>t},questionnaireSource:o.questionnaireSource,defaultSource:r})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or string",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "decimal-wc-spinner-repeating-options-or-string",
    title: "options or string",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const w=["OptionsOrString"];export{e as OptionsOrString,w as __namedExportsOrder,f as default};
