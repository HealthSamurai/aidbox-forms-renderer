import{j as s}from"./index-BsWNCus6.js";import{b as a,a as i,N as n,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-wc-spinner-repeating-options-only",text:"Boolean question",type:"boolean",repeats:!0,control:"spinner",answerConstraint:"optionsOnly",answerOption:l("boolean",[!0,!1])}),o=JSON.stringify(r.form.questionnaire,null,2),f={title:"Question/boolean/with item-control/spinner/repeating/with answer-options",component:n,parameters:i,argTypes:a},e={name:"options only",args:{questionnaireSource:o},render:t=>s.jsx(n,{scenario:{name:"boolean-wc-spinner-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-spinner-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const g=["OptionsOnly"];export{e as OptionsOnly,g as __namedExportsOrder,f as default};
