import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as n,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const r=p({linkId:"boolean-wc-drop-down-non-repeating-options-or-type",text:"Boolean question",type:"boolean",repeats:!1,control:"drop-down",answerConstraint:"optionsOrType",answerOption:u("boolean",[!0,!1])}),o=JSON.stringify(r.form.questionnaire,null,2),S={title:"Question/boolean/with item-control/drop-down/non-repeating/with answer-options",component:n,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:t=>a.jsx(n,{scenario:{name:"boolean-wc-drop-down-non-repeating-options-or-type",title:"options or type",build:()=>r},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-drop-down-non-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
