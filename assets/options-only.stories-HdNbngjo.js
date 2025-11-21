import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as p,m as l}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-wc-drop-down-repeating-options-only",text:"Boolean question",type:"boolean",repeats:!0,control:"drop-down",answerConstraint:"optionsOnly",answerOption:l("boolean",[!0,!1])}),e=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/boolean/with item-control/drop-down/repeating/with answer-options",component:n,parameters:i,argTypes:s},o={name:"options only",args:{questionnaireSource:e},render:t=>a.jsx(n,{scenario:{name:"boolean-wc-drop-down-repeating-options-only",title:"options only",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:e})};o.parameters={...o.parameters,docs:{...o.parameters?.docs,source:{originalSource:`{
  name: "options only",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-drop-down-repeating-options-only",
    title: "options only",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...o.parameters?.docs?.source}}};const f=["OptionsOnly"];export{o as OptionsOnly,f as __namedExportsOrder,S as default};
