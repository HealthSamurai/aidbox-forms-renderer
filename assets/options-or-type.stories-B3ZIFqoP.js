import{j as a}from"./index-BsWNCus6.js";import{b as s,a as i,N as r,c as p,m as u}from"./helpers-BRoEs9rh.js";import"./iframe-DXtTJtIS.js";import"./preload-helper-PPVm8Dsz.js";import"./index-BXc-CYbp.js";import"./form-DWk4cvsd.js";const n=p({linkId:"boolean-wc-drop-down-repeating-options-or-type",text:"Boolean question",type:"boolean",repeats:!0,control:"drop-down",answerConstraint:"optionsOrType",answerOption:u("boolean",[!0,!1])}),o=JSON.stringify(n.form.questionnaire,null,2),S={title:"Question/boolean/with item-control/drop-down/repeating/with answer-options",component:r,parameters:i,argTypes:s},e={name:"options or type",args:{questionnaireSource:o},render:t=>a.jsx(r,{scenario:{name:"boolean-wc-drop-down-repeating-options-or-type",title:"options or type",build:()=>n},questionnaireSource:t.questionnaireSource,defaultSource:o})};e.parameters={...e.parameters,docs:{...e.parameters?.docs,source:{originalSource:`{
  name: "options or type",
  args: {
    questionnaireSource: defaultSource
  },
  render: args => <NodeShell scenario={{
    name: "boolean-wc-drop-down-repeating-options-or-type",
    title: "options or type",
    build: () => defaultNode
  }} questionnaireSource={args.questionnaireSource} defaultSource={defaultSource} />
}`,...e.parameters?.docs?.source}}};const f=["OptionsOrType"];export{e as OptionsOrType,f as __namedExportsOrder,S as default};
